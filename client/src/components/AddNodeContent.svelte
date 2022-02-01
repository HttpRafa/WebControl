<script lang="ts">
    import TopNavigation from "../top/TopNavigation.svelte";
    import { Icon, Refresh, LockClosed } from "svelte-hero-icons";

    let iconState = false;
</script>

<div class='content-container'>
    <TopNavigation title={"Node"}/>
    <div class='content-list'>
        <div class="mt-9 flex justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div class="max-w-md w-full space-y-8">
                <div>
                    <img class="mx-auto h-24 w-24" src="/images/logo512.png" alt="Workflow"/>
                    <h2 class="text-center text-3xl font-extrabold text-gray-900 dark:text-gray-300">Add Node</h2>
                    <p class="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
                        The note is needed to be able to set up the login and the services.
                    </p>
                </div>
                <form class="mt-8 space-y-6" action="#" method="POST" on:submit={function(event) {
                    event.preventDefault();

                    iconState = true;
                }}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div class="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input id="nodeServerAddressInput" name="nodeServerAddressInput" type="text" autoComplete="text" required class="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Server address"/>
                        </div>
                        <div>
                            <input id="nodePortInput" name="nodePortInput" type="number" autoComplete="port" required class="appearance-none rounded-none relative block w-full px-3 py-2 border bg-gray-white dark:bg-gray-800 dark:border-gray-700 border-gray-300 dark:placeholder-gray-600 placeholder-gray-400 dark:text-gray-300 text-gray-500 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Port"/>
                        </div>
                    </div>
                    <div>
                        <button type="submit" class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            <span class="absolute left-0 inset-y-0 flex items-center pl-3">
                                {#if iconState}
                                    <Icon src={Refresh} size="19" class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 service-button-loading" aria-hidden="true" />
                                {:else}
                                    <Icon src={LockClosed} size="19" class="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" aria-hidden="true" />
                                {/if}
                            </span>Connect
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>