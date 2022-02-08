<script lang="ts">
    import TopNavigation from "../../top/TopNavigation.svelte";
    import {Check, Icon} from "svelte-hero-icons";

    let messages = ["Test1", "Test2"]

    function sendCommand() {
        // @ts-ignore
        let message: string = document.getElementById("console-input").value;
        // @ts-ignore
        document.getElementById("console-input").value = "";

        messages = [...messages, message];
    }
</script>

<div class="content-container">
    <TopNavigation title={"Console"}/>
    <div class="content-list">
        <div class="console">
            {#each messages as message}
                <div class="console-line">{message}</div>
            {/each}
        </div>
    </div>
    <form class="bottom-bar" on:submit={function(event) {event.preventDefault();sendCommand();}}>
        <input type="text" id="console-input" placeholder="Enter command..." class="bottom-bar-input" />
        <div on:click={function() {sendCommand();}}>
            <Icon src="{Check}" size="26" class="text-green-500 mx-2 dark:text-primary cursor-pointer"/>
        </div>
    </form>
</div>