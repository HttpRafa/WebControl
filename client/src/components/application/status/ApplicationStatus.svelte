<script lang="ts">
    import {Icon, Play, Refresh, Stop} from "svelte-hero-icons";
    import {ApplicationStates} from "../../../js/enums/ApplicationStates";
    import {applicationState} from "../../../js/Store";
    import {updateWorkerState} from "../../../js/application/Application";

    updateWorkerState();

</script>

<div class="mr-9 ml-9 mt-9 mb-9 bg-white dark:bg-gray-900 rounded-lg shadow-lg">
    <div class="px-4 py-5 sm:px-6">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">Application Information</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">Information about the Application</p>
        <div class="text-right mt-2">
            {#if $applicationState === ApplicationStates.starting}
                <button type="button" class="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:bg-green-700"><Icon src="{Refresh}" class="-ml-1 mr-2 h-5 w-5 service-button-loading"/>Start</button>
            {:else}
                <button type="button" class="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:bg-green-700"><Icon src="{Play}" class="-ml-1 mr-2 h-5 w-5"/>Start</button>
            {/if}
            {#if $applicationState === ApplicationStates.restarting}
                <button type="button" class="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-450 hover:bg-yellow-500"><Icon src="{Refresh}" class="-ml-1 mr-2 h-5 w-5 service-button-loading"/>Restart</button>
            {:else}
                <button type="button" class="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-450 hover:bg-yellow-500"><Icon src="{Refresh}" class="-ml-1 mr-2 h-5 w-5"/>Restart</button>
            {/if}
            {#if $applicationState === ApplicationStates.stopping}
                <button type="button" class="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:bg-red-700"><Icon src="{Refresh}" class="-ml-1 mr-2 h-5 w-5 service-button-loading"/>Stop</button>
            {:else}
                <button type="button" class="transition inline-flex items-center mt-2 mr-2 px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-700 focus:bg-red-700"><Icon src="{Stop}" class="-ml-1 mr-2 h-5 w-5"/>Stop</button>
            {/if}
        </div>
    </div>
    <div class="border-t border-gray-200 dark:border-gray-850">
        <dl>
            <div class="bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-white">Current Status</dt>
                {#if $applicationState === ApplicationStates.started}
                    <dd class="mt-1 text-sm text-green-500 font-medium sm:mt-0 sm:col-span-2">Online</dd>
                {:else if $applicationState === ApplicationStates.starting}
                    <dd class="mt-1 text-sm text-green-500 font-medium sm:mt-0 sm:col-span-2">Starting</dd>
                {:else if $applicationState === ApplicationStates.restarting}
                    <dd class="mt-1 text-sm text-orange-450 font-medium sm:mt-0 sm:col-span-2">Restarting</dd>
                {:else if $applicationState === ApplicationStates.stopping}
                    <dd class="mt-1 text-sm text-red-600 font-medium sm:mt-0 sm:col-span-2">Stopping</dd>
                {:else if $applicationState === ApplicationStates.stopped}
                    <dd class="mt-1 text-sm text-red-600 font-medium sm:mt-0 sm:col-span-2">Offline</dd>
                {/if}
            </div>
            <div class="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-white">Type</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">Minecraft Server</dd>
            </div>
            <div class="bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-white">Current Uptime</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">1 min 25 sec</dd>
            </div>
            <div class="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-white">CPU load</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">35%</dd>
            </div>
            <div class="bg-gray-50 dark:bg-gray-850 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-white">Description</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">
                    Nothing
                </dd>
            </div>
            <div class="bg-white dark:bg-gray-900 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500 dark:text-white">Memory Usage</dt>
                <dd class="mt-1 text-sm text-gray-900 dark:text-gray-400 sm:mt-0 sm:col-span-2">2500 MB / 7000 MB</dd>
            </div>
        </dl>
    </div>
</div>