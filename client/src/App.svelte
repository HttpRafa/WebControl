<script lang="ts">
    import SideBar from "./components/sidebar/SideBar.svelte";
    import HomeContent from "./components/other/HomeContent.svelte";
    import LoadingContent from "./components/other/LoadingContent.svelte";
    import LoginContent from "./components/other/LoginContent.svelte";
    import AddNodeContent from "./components/other/AddNodeContent.svelte";
    import RegisterContent from "./components/other/RegisterContent.svelte";
    import ApplicationContent from "./components/application/status/ApplicationContent.svelte";
    import ConsoleContent from "./components/application/console/ConsoleContent.svelte";
    import OptionsContent from "./components/application/options/OptionsContent.svelte";
    import AccessContent from "./components/application/access/AccessContent.svelte";
    import FilesContent from "./components/application/files/FilesContent.svelte";

    import {PageIds} from "./js/enums/PageIds";
    import {ApplicationError} from "./js/ApplicationError";
    import {currentError, currentNode, networkManager, pageId, userData} from "./js/Store";
    import {ErrorIds} from "./js/enums/ErrorIds";
    import {onMount} from "svelte";
    import {UserData} from "./js/data/UserData";
    import {SideBarIconIds} from "./js/enums/SideBarIconIds";

    let hideSideBarIcon = [1, 2, 3, 4, 5, 6, 7, 8];

    onMount(() => {
        userData.subscribe(value => {
            if(value.applicationId > -1) {
                hideSideBarIcon = [];
                pageId.set(PageIds.application);
            } else if(value.applicationId == -1) {
                hideSideBarIcon = [1, 2, 3, 4, 5];
            } else {
                hideSideBarIcon = [1, 2, 3, 4, 5, 6, 7, 8];
            }
        });
    });

    networkManager.update(value => {
        value.prepareManager();

        if(value.nodeManager.nodes.length <= 0) {
            pageId.set(PageIds.addNode);
        } else {
            currentNode.update(nodeId => {
                connectToNode();
                return nodeId;
            })
        }

        return value;
    })

    function connectToNode() {
        pageId.set(PageIds.loading);

        networkManager.update(manager => {
            manager.nodeManager.connect((result, node) => {
                if(result == 1) {
                    if(node.hasUser()) {
                        sendClientLoginRequest();
                    } else {
                        pageId.set(PageIds.login);
                    }
                }
            });
            return manager;
        })
    }

    function sendClientLoginRequest() {
        pageId.set(PageIds.loading);

        networkManager.update(value => {
            currentNode.update(nodeId => {
                let node = value.nodeManager.getNodeById(nodeId);
                node.requestLogin().then(result => {
                    if(result == 1) {
                        pageId.set(PageIds.home);

                        // TODO: Load applications and currentApplication
                        updateUserData().then(userData => {});
                    } else if(result == 0) {
                        node.user.delete();
                        currentError.set(new ApplicationError(ErrorIds.session_outdated, "Your session is out of date or has errors, please log in again."));
                        pageId.set(PageIds.login);
                    } else {
                        pageId.set(PageIds.login);
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
                        pageId.set(PageIds.login);
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

    function updateUserData(): Promise<UserData> {
        return new Promise<UserData>(resolve => {
            networkManager.update(value => {
                currentNode.update(nodeId => {
                    let node = value.nodeManager.getNodeById(nodeId);
                    node.requestUserData().then(result => {
                        userData.set(result);
                        resolve(result);
                    })
                    return nodeId;
                })
                return value;
            })
        });
    }

    function changePage(iconId: number) {
        if(iconId == SideBarIconIds.home) {
            pageId.set(PageIds.home);
        }
        if(iconId == SideBarIconIds.application) {
            pageId.set(PageIds.application);
        }
        if(iconId == SideBarIconIds.options) {
            pageId.set(PageIds.options);
        }
        if(iconId == SideBarIconIds.console) {
            pageId.set(PageIds.console);
        }
        if(iconId == SideBarIconIds.files) {
            pageId.set(PageIds.files);
        }
        if(iconId == SideBarIconIds.access) {
            pageId.set(PageIds.access);
        }
        if(iconId == SideBarIconIds.create_application) {
            // TODO: Add Create Application
        }
        //pageId.set(icon);
    }

</script>

<main class="flex">
    <SideBar hideIcon={hideSideBarIcon} iconPressed={function(iconId) {
        changePage(iconId);
    }} />
    {#if $pageId === PageIds.home}
        <HomeContent />
    {:else if $pageId === PageIds.loading}
        <LoadingContent />
    {:else if $pageId === PageIds.login}
        <LoginContent changeToRegisterCallback={function() {
            pageId.set(PageIds.register);
        }} submitCallback={requestLogin} />
    {:else if $pageId === PageIds.register}
        <RegisterContent changeToLoginCallback={function() {
            pageId.set(PageIds.login);
        }} submitCallback={createAccount} />
    {:else if $pageId === PageIds.addNode}
        <AddNodeContent submitCallback={addNode} />
    {:else if $pageId === PageIds.application}
        <ApplicationContent />
    {:else if $pageId === PageIds.options}
        <OptionsContent />
    {:else if $pageId === PageIds.console}
        <ConsoleContent />
    {:else if $pageId === PageIds.files}
        <FilesContent />
    {:else if $pageId === PageIds.access}
        <AccessContent />
    {/if}
</main>

<style>
</style>
