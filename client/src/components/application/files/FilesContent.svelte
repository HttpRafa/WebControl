<script lang="ts">
    import TopNavigation from "../../top/TopNavigation.svelte";
    import {Folder, Icon} from "svelte-hero-icons";

</script>

<div class='content-container'>
    <TopNavigation title={"Files"}/>
    <div class='content-list'>
        <div class="mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
            <div class="px-4 py-5 sm:px-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Application Files</h3>
                <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">With this information you can access your files</p>
            </div>
            <div class="ml-4 mb-4 mr-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div class="bg-gray-200 dark:bg-gray-800 shadow-sm rounded pt-4 pb-4 pl-2">
                    <div class="flex">
                        <div class="cursor-pointer mr-2 text-green-500 w-12 h-12 flex justify-center items-center">
                            <Icon src="{Folder}" size="26"/>
                        </div>
                        <div>
                            <div class="font-medium lg:text-xls sm:text-xs text-gray-800 dark:text-gray-300">FTP Server</div>
                            <p class="mt-1 bg-transparent focus:outline-0 font-bold lg:text-lg sm:text-xs text-gray-800 dark:text-gray-300">No information to display</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>