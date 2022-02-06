<script lang="ts">
    import {Home, Plus, Adjustments, Chip, Server, Terminal, Folder, Key, FingerPrint } from "svelte-hero-icons";
    import SideBarIcon from "./SideBarIcon.svelte";
    import SideBarDivider from "./SideBarDivider.svelte";
    import {SideBarIconIds} from "../../js/ids/SideBarIconIds";

    export let hideIcon: Array<number>;
</script>

<div class="fixed top-0 left-0 h-screen w-16 flex flex-col bg-white dark:bg-gray-900 shadow-lg">
    {#if !hideIcon.includes(SideBarIconIds.home) }
        <SideBarIcon icon={Home} text="Home" />
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.application) }
        <SideBarDivider hide={false} />
        <SideBarIcon icon={Chip} text="Application" />
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.options) }
        <SideBarIcon icon={Adjustments} text="Options" />
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.console) }
        <SideBarIcon icon={Terminal} text="Console" />
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.files) }
        <SideBarIcon icon={Folder} text="Files" />
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.access) }
        <SideBarIcon icon={Key} text="Access" />
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.create_application) }
        <SideBarDivider hide={false} />
        <SideBarIcon icon={Plus} text="Create Application" />
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.applications) }
        <SideBarIcon icon={Server} text="Example Application" />
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.settings) }
        <SideBarDivider hide={false} />
        <SideBarIcon icon={FingerPrint} text="Settings" />
    {/if}
</div>