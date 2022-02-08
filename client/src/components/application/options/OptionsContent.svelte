<script lang="ts">
    import TopNavigation from "../../top/TopNavigation.svelte";
    import {SaveStates} from "../../../js/enums/SaveStates";
    import {Check, Database, Icon, Pencil, Refresh, Save} from "svelte-hero-icons";

    let saveStatus = SaveStates.saved;
    let options = [];

</script>

<div class='content-container'>
    <TopNavigation title={"Options"}/>

        <div class="overflow-y-scroll mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Application Options</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Here you can change the options of the application</p>
                {#if options.length > 0}
                    <div class="text-right mt-2">
                        <button type="button" class="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:bg-green-700">
                            {#if saveStatus === SaveStates.need_to_save}
                                <Icon src="{Save}" class="-ml-1 mr-2 h-5 w-5"/>Save
                            {:else if saveStatus === SaveStates.saving}
                                <Icon src="{Refresh}" class="-ml-1 mr-2 h-5 w-5 service-button-loading"/>Saving
                            {:else if saveStatus === SaveStates.saved}
                                <Icon src="{Check}" class="-ml-1 mr-2 h-5 w-5"/>Saved
                            {/if}
                        </button>
                    </div>
                {/if}
            </div>
            {#if options.length > 0}
                <div class="ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {#each options as option}
                        <div class="bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2">
                            <div class="flex">
                                <div class="cursor-pointer mr-2 text-green-500 w-12 h-12 flex justify-center items-center">
                                    <Icon src="{Database}" size="26"/>
                                </div>
                                <div>
                                    <div class="font-medium text-xlss text-gray-800 dark:text-gray-300">{option.name}</div>
                                    <p class="mt-1 bg-transparent focus:outline-0 font-bold text-xls text-gray-800 dark:text-gray-300">{option.value}</p>
                                </div>
                                <div on:click={function() {}} class="ml-auto mr-4 relative flex items-center justify-center h-12 w-12 bg-gray-400 hover:bg-blue-600 dark:bg-gray-900 text-blue-500 hover:text-white hover:rounded-xl rounded-3xl transition-all duration-300 ease-linear cursor-pointer shadow-lg">
                                    <Icon src="{Pencil}" size="24"/>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="ml-4 mb-4 border-t border-gray-200 dark:border-gray-850">
                    <dl>
                        <div class="bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                            <dt class="text-sm font-medium text-gray-500 dark:text-white">This Application has no options</dt>
                        </div>
                    </dl>
                </div>
            {/if}
        </div>
</div>