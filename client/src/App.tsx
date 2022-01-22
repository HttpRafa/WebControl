import React, {useEffect, useState} from "react";
import './App.css';

import JavaScriptTags from './components/script/JavaScriptTags';
import AppRoot from "./components/AppRoot";

let _setSiteId: (value: number) => void;
let _setHideSideBar: (value: number[]) => void;

let _setStoredData: (value: any) => void;
let _storedData: any;

function App() {

  const [hideSideBar, setHideSideBar] = useState([-1]);
  _setHideSideBar = setHideSideBar;
  const [siteId, setSiteId] = useState(-100);
  _setSiteId = setSiteId;
  const [applicationState, setApplicationState] = useState({
    state: "STARTING"
  });
  const [currentErrorState, setCurrentErrorState] = useState({
    error: 0,
    message: ""
  });
  const [consoleMessages, setConsoleMessages] = useState([]);

  // @ts-ignore JSON.parse(localStorage.getItem("web:storedData")) |
  const [storedData, setStoredData] = useState(localStorage.getItem("web:storedData") !== null ? JSON.parse(localStorage.getItem("web:storedData")) : {
    nodes: [],
    selectedNode: 0
  });
  _storedData = storedData;
  _setStoredData = setStoredData;

  // @ts-ignore
  const [connectedNode, setConnectedNode] = useState<Node>(undefined);

  useEffect(() => {
    _storedData = storedData;

    // @ts-ignore
    localStorage.setItem("web:storedData", JSON.stringify(storedData));
    console.log("Saved " + JSON.stringify(storedData));

    if(connectedNode !== undefined) {
      connectedNode.kill();
    }
    if(nodes.length > 0) {
      findNode(nodes, storedData, setConnectedNode);
    } else {
      setSiteId(-101);
    }
  }, [storedData]);

  useEffect(() => {
    if(connectedNode !== undefined) {
      if(connectedNode._address === "null" && connectedNode._port === -25) {
        setSiteId(-101);
        setTimeout(() => {
          setCurrentErrorState({
            error: -1001,
            message: "The panel could not connect to one of your saved nodes"
          });
        }, 250);
      } else {
      }
    }
  }, [connectedNode]);

  // @ts-ignore
  let nodes: Node[] = [];
  // eslint-disable-next-line array-callback-return
  storedData.nodes.map(function (node: Node) {
    const newNode: Node = new Node(node._address, node._port);
    // @ts-ignore
    newNode._nodeUser = new NodeUser(node._nodeUser?._username, node._nodeUser?._session);
    nodes.push(newNode);
  });

  return (
      <>
        <AppRoot hideSideBar={hideSideBar} applicationState={applicationState} errorState={currentErrorState} setCurrentErrorState={setCurrentErrorState} consoleMessages={consoleMessages} setSideId={setSiteId} siteId={siteId} connectNode={(address:string, port:number) => {

          let similarNode: boolean = false;
          // eslint-disable-next-line array-callback-return
          nodes.map(node => {
            if(node._address === address && node._port === port) {
              similarNode = true;
              setCurrentErrorState({
                error: -1002,
                message: "This node is already added"
              });
            }
          });

          if(!similarNode) {
            const node = new Node(address, port);
            node.testNode(() => {
              console.log("Node Test: Success");

              // @ts-ignore
              const tempNodes: Node[] = [...storedData.nodes];
              tempNodes.push(node);
              // @ts-ignore
              setStoredData({nodes: tempNodes, selectedNode: 0});
            }, (event, url) => {
              if(event.currentTarget != null) {
                setCurrentErrorState({
                  error: -1000,
                  message: "WebSocket connection to " + url + " failed"
                });
              }
            })
          }
        }} submitLogin={(username:string, password:string, remember:boolean) => {
          connectedNode.requestLoginSession(username, password, remember);
        }}/>
        <JavaScriptTags />
      </>
  );
}

let currentNode: number = 0;
function findNode(nodes: Node[], storedData: any, setConnectedNode: (node: Node) => void) {
  const node: Node = nodes[storedData.selectedNode];
  node.connect(() => {

    node.callback(message => {
      const packet = JSON.parse(message.data);
      if(packet.id === 0) {
        if(node._nodeUser?._username === undefined) {
          _setSiteId(-102);
          _setHideSideBar([-1]);
        } else {
          node.requestVerify();
        }
      } else if(packet.id === 1) {
        if(packet.data.result === -1) {
          _setSiteId(-102);
          _setHideSideBar([-1]);
        } else if(packet.data.result === 1) {
          _setSiteId(-1);
          _setHideSideBar([]);
        }
      } else if(packet.id === 2) {
        if(packet.status === 1) {

          // TODO: Remember me

          const nodeArray: Node[] = [];
          // eslint-disable-next-line array-callback-return
          storedData.nodes.map((mapNode: Node) => {
            const cNode = mapNode;
            if(mapNode._port === node._port && mapNode._address === node._address) {
              cNode._nodeUser = new NodeUser(packet.data._username, packet.data._session);
            }
            nodeArray.push(cNode);
          });

          _setStoredData({
            nodes: nodeArray,
            selectedNode: storedData.selectedNode
          });

          _setSiteId(-1);
          _setHideSideBar([]);
        }
      }
    });

    setConnectedNode(node);
  }, () => {
    currentNode++;
    if(currentNode < nodes.length) {
      storedData.selectedNode = currentNode;
      findNode(nodes, storedData, setConnectedNode);
    } else {
      setConnectedNode(new Node("null", -25));
    }
  });
}

class NodeUser {

  public _username: string;
  public _session: string;

  constructor(username: string, session: string) {
    this._username = username;
    this._session = session;
  }

  login(node: Node, password: string) {
    node._webSocket?.send(JSON.stringify({id: 1, data: { _username: this._username, _password: password }}))
  }

  verify(node: Node) {
    node._webSocket?.send(JSON.stringify({id: 0, data: { _username: this._username, _session: this._session }}));
  }

}

class Node {

  public readonly _address: string;
  public readonly _port: number;
  public _webSocket: WebSocket | undefined;
  public _nodeUser: NodeUser | undefined;

  public _messageCallbacks: ((message: MessageEvent) => void)[] = [];

  constructor(address: string, port: number) {
    this._address = address;
    this._port = port;
  }

  requestLoginSession(username: string, password: string, remember:boolean) {
    const user = new NodeUser(username, "");
    user.login(this, password);
  }

  requestVerify() {
    const user = this._nodeUser;
    user?.verify(this);
  }

  connect(openCallback: () => void, errorCallback: () => void) {
    this._webSocket = new WebSocket("ws://" + this._address + ":" + this._port);

    this._webSocket.onopen = () => {openCallback()};
    this._webSocket.onerror = errorCallback;
    this._webSocket.onmessage = event => {
      // eslint-disable-next-line array-callback-return
      this._messageCallbacks.map(value => {
        value(event);
      });
    };
  }

  kill() {
    this._webSocket?.close();
  }

  testNode(openCallback: () => void, errorCallback: (a: Event, b: string) => void) {
    const testSocket = new WebSocket("ws://" + this._address + ":" + this._port);
    testSocket.onopen = () => {
      openCallback();
      testSocket.close();
    }
    testSocket.onerror = (event) => {
      errorCallback(event, "ws://" + this._address + ":" + this._port);
      // "WebSocket connection to " + event.currentTarget.url + " failed",
    }
  }

  callback(messageCallback: (message: MessageEvent) => void) {
    this._messageCallbacks.push(messageCallback);
  }

  sendMessage(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    this._webSocket?.send(data);
  }

}

export default App;