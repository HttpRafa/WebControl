<script lang="ts">
    import SideBar from "./components/sidebar/SideBar.svelte";
    import HomeContent from "./components/HomeContent.svelte";
    import LoadingContent from "./components/LoadingContent.svelte";
    import LoginContent from "./components/LoginContent.svelte";
    import AddNodeContent from "./components/AddNodeContent.svelte";
    import RegisterContent from "./components/RegisterContent.svelte";

    import {PageIds} from "./js/PageIds";
    import {ApplicationError} from "./js/ApplicationError";
    import {currentError, currentNode, networkManager} from "./js/Store";

    let sideId = PageIds.loading;

    networkManager.update(value => {
        value.prepareManager();

        if(value.nodeManager.nodes.length <= 0) {
            sideId = PageIds.addNode;
        } else {
            currentNode.update(nodeId => {
                connectToNode(nodeId);
                return nodeId;
            })
        }

        return value;
    })

    function connectToNode(id: number) {
        sideId = PageIds.loading;

        networkManager.update(manager => {
            manager.nodeManager.connect((result, node) => {
                if(result == 1) {
                    if(node.hasUser()) {

                    } else {
                        sideId = PageIds.login;
                    }
                }
            });
            return manager;
        })
    }

    function requestLogin(username: string, password: string, checked: boolean) {
        console.log("Try to create login session for user[" + username + "].");
        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                return nodeId;
            })
            return value;
        })
    }

    function addNode(host: string, port: number) {
        console.log("Trying to connect to node[" + host + ":" + port + "]");
        networkManager.update(value => {
            value.nodeManager.testNode(host, port, () => {
                let id = value.nodeManager.addNode(host, port);
                currentNode.set(id);
                connectToNode(id);
            }, () => {
                currentError.set(new ApplicationError(1000, "Error while connecting to the node[" + host + ":" + port + "]"))
            });
            return value;
        })
    }
</script>

<main class="flex">
    <SideBar />
    {#if sideId === PageIds.home}
        <HomeContent />
    {:else if sideId === PageIds.loading}
        <LoadingContent />
    {:else if sideId === PageIds.login}
        <LoginContent submitCallback={requestLogin} />
    {:else if sideId === PageIds.register}
        <RegisterContent />
    {:else if sideId === PageIds.addNode}
        <AddNodeContent submitCallback={addNode} />
    {/if}
</main>

<style>
</style>