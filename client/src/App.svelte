<script lang="ts">
    import SideBar from "./sidebar/SideBar.svelte";
    import HomeContent from "./components/HomeContent.svelte";
    import LoadingContent from "./components/LoadingContent.svelte";
    import LoginContent from "./components/LoginContent.svelte";
    import AddNodeContent from "./components/AddNodeContent.svelte";
    import RegisterContent from "./components/RegisterContent.svelte";

    import {PageIds} from "./js/PageIds";
    import {currentError, networkManager} from "./store";
    import {currentNode} from "./js/network/node/NodeManager";
    import {ApplicationError} from "./js/ApplicationError";

    let sideId = PageIds.loading;

    networkManager.update(value => {
        value.prepareManager();

        if(value.nodeManager.nodes.length <= 0) {
            sideId = PageIds.addNode;
        } else {
            currentNode.update(node => {
                if(!value.nodeManager.getNodeById(node).isLoggedIn()) {
                    sideId = PageIds.login;
                } else {
                    value.nodeManager.connect(value.nodeManager.getNodeById(node)).then(result => {
                        if(result == 1) {
                            value.nodeManager.getNodeById(node).login().then(loginResult => {
                                console.log(loginResult);
                            })
                        }
                    });
                }
                return node;
            })
        }

        return value;
    })

    function addNode(host: string, port: number) {
        console.log("Trying to connect to node[" + host + ":" + port + "]");
        networkManager.update(value => {
            value.nodeManager.testNode(host, port, () => {
                value.nodeManager.addNode(host, port);
            }, () => {
                console.log("Error while connecting to the node[" + host + ":" + port + "]")
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
        <LoginContent />
    {:else if sideId === PageIds.register}
        <RegisterContent />
    {:else if sideId === PageIds.addNode}
        <AddNodeContent submitCallback={addNode} />
    {/if}
</main>

<style>
</style>