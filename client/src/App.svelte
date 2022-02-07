<script lang="ts">
    import SideBar from "./components/sidebar/SideBar.svelte";
    import HomeContent from "./components/HomeContent.svelte";
    import LoadingContent from "./components/LoadingContent.svelte";
    import LoginContent from "./components/LoginContent.svelte";
    import AddNodeContent from "./components/AddNodeContent.svelte";
    import RegisterContent from "./components/RegisterContent.svelte";

    import {PageIds} from "./js/ids/PageIds";
    import {ApplicationError} from "./js/ApplicationError";
    import {currentError, currentNode, networkManager, userData} from "./js/Store";
    import {ErrorIds} from "./js/ids/ErrorIds";
    import {PacketOutRequestUserData} from "./js/network/packet/out/PacketOutRequestUserData";
    import {onMount} from "svelte";

    let sideId = PageIds.loading;
    let hideSideBarIcon = [1, 2, 3, 4, 5, 6, 7, 8];

    onMount(() => {
        userData.subscribe(value => {
            if(value.applicationIndex > -1) {
                requestApplicationData(() => {
                    hideSideBarIcon = [];
                });
            } else if(value.applicationIndex == -1) {
                hideSideBarIcon = [1, 2, 3, 4, 5];
            } else {
                hideSideBarIcon = [1, 2, 3, 4, 5, 6, 7, 8];
            }
        });
    });

    networkManager.update(value => {
        value.prepareManager();

        if(value.nodeManager.nodes.length <= 0) {
            sideId = PageIds.addNode;
        } else {
            currentNode.update(nodeId => {
                connectToNode();
                return nodeId;
            })
        }

        return value;
    })

    function connectToNode() {
        sideId = PageIds.loading;

        networkManager.update(manager => {
            manager.nodeManager.connect((result, node) => {
                if(result == 1) {
                    if(node.hasUser()) {
                        sendClientLoginRequest();
                    } else {
                        sideId = PageIds.login;
                    }
                }
            });
            return manager;
        })
    }

    function sendClientLoginRequest() {
        sideId = PageIds.loading;

        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.requestLogin().then(result => {
                    if(result == 1) {
                        sideId = PageIds.home;

                        // TODO: Load applications and currentApplication
                        updateUserData();
                    } else if(result == 0) {
                        node.user.delete();
                        currentError.set(new ApplicationError(ErrorIds.session_outdated, "Your session is out of date or has errors, please log in again."));
                        sideId = PageIds.login;
                    } else {
                        sideId = PageIds.login;
                    }
                })
                return nodeId;
            });
            return value;
        });
    }

    function requestLogin(username: string, password: string, checked: boolean) {
        console.log("Trying to create login session for user[" + username + "].");
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.requestLoginSession(username, password, checked).then(result => {
                    if(result == undefined) {
                        currentError.set(new ApplicationError(ErrorIds.create_session, "Password or username is wrong"));
                    } else {
                        node.saveUser(username, result);
                        sendClientLoginRequest();
                    }
                });
                return nodeId;
            })
            return value;
        })
    }

    function createAccount(username: string, password: string, token: string) {
        console.log("Trying to create account with username[" + username + "]");
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.createAccount(username, password, token).then(result => {
                    if(result == 1) {
                        sideId = PageIds.login;
                    } else if(result == 0) {
                        currentError.set(new ApplicationError(ErrorIds.create_account, "The token is wrong or a user with the username[" + username + "] already exists"));
                    }
                });
                return nodeId;
            });
            return value;
        });
    }

    function addNode(host: string, port: number) {
        console.log("Trying to connect to node[" + host + ":" + port + "]");
        networkManager.update(value => {
            value.nodeManager.testNode(host, port, () => {
                let id = value.nodeManager.addNode(host, port);
                currentNode.set(id);
                connectToNode();
            }, () => {
                currentError.set(new ApplicationError(ErrorIds.node_connect, "Error while connecting to the node[" + host + ":" + port + "]"))
            });
            return value;
        })
    }

    function updateUserData() {
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.requestUserData().then(result => {
                    userData.set(result);
                })
                return nodeId;
            })
            return value;
        })
    }

    function requestApplicationData(callback: () => void) {

    }

</script>

<main class="flex">
    <SideBar hideIcon={hideSideBarIcon} />
    {#if sideId === PageIds.home}
        <HomeContent />
    {:else if sideId === PageIds.loading}
        <LoadingContent />
    {:else if sideId === PageIds.login}
        <LoginContent changeToRegisterCallback={function() {sideId = PageIds.register;}} submitCallback={requestLogin} />
    {:else if sideId === PageIds.register}
        <RegisterContent changeToLoginCallback={function() {sideId = PageIds.login;}} submitCallback={createAccount} />
    {:else if sideId === PageIds.addNode}
        <AddNodeContent submitCallback={addNode} />
    {/if}
</main>

<style>
</style>