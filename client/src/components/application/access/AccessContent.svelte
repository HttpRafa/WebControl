<script lang="ts">
    import TopNavigation from "../../top/TopNavigation.svelte";
    import {Icon, Plus, Pencil, Trash} from "svelte-hero-icons";

    let users = [{ username: "HttpRafa" }, { username: "MainSkript" }];

    function addUser() {

    }

</script>

<div class='content-container'>
    <TopNavigation title={"Access"}/>
    <div class='content-list'>
        <div class="mr-9 ml-9 mt-9 mb-9 mb-24 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Application Access</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Here you can specify with user can access your application</p>
            </div>
            {#if users.length > 0}
                <div class="ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {#each users as user}
                        <div class="bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2">
                            <div class="flex">
                                <div class="ml-4 flex justify-center items-center">
                                    <div class="font-medium lg:text-xls sm:text-xs text-gray-800 dark:text-gray-300">{user.username}</div>
                                </div>
                                <div class="ml-auto mr-0 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-blue-600 dark:bg-gray-900 text-blue-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
                                    <Icon src="{Pencil}" size="24"/>
                                </div>
                                <div on:click={function() {}} class="ml-2 mr-4 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-red-600 dark:bg-gray-900 text-red-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
                                    <Icon src="{Trash}" size="24"/>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="ml-4 mb-4 border-t border-gray-200 dark:border-gray-850">
                    <dl>
                        <div class="bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-white">This Application has no added users</dt>
                        </div>
                    </dl>
                </div>
            {/if}
            <form class='bottom-bar' on:submit={function(event) {event.preventDefault();addUser();}}>
                <input type='text' id="access-input" placeholder='Enter username...' class='bottom-bar-input' />
                <div on:click={function() {addUser();}}>
                    <Icon src="{Plus}" size="26" class="text-green-500 mx-2 dark:text-primary cursor-pointer"/>
                </div>
            </form>
        </div>
    </div>

</div>