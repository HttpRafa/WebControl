<script lang="ts">
    import TopNavigation from "../../top/TopNavigation.svelte";
    import {Check, Icon} from "svelte-hero-icons";
    import {applicationConsoleMessages} from "../../../js/Store";

    function sendCommand() {
        // @ts-ignore
        let message: string = document.getElementById("console-input").value;
        // @ts-ignore
        document.getElementById("console-input").value = "";

        addLog(message);
    }

    function addLog(message: string) {
        applicationConsoleMessages.update(value => {
            return [...value, message];
        });

        document.getElementById("scrollDiv").scrollIntoView();
    }

</script>

<div class="content-container">
    <TopNavigation title={"Console"}/>
    <div class="content-list">
        <div class="console">
            {#if $applicationConsoleMessages !== undefined}
                {#each $applicationConsoleMessages as message}
                    <div class="console-line">{message}</div>
                {/each}
                <div id="scrollDiv"></div>
            {:else}

            {/if}
        </div>
    </div>
    <form class="bottom-bar" on:submit={function(event) {event.preventDefault();sendCommand();}}>
        <input type="text" id="console-input" placeholder="Enter command..." class="bottom-bar-input" />
        <div on:click={function() {sendCommand();}}>
            <Icon src="{Check}" size="26" class="text-green-500 mx-2 dark:text-primary cursor-pointer"/>
        </div>
    </form>
</div>
