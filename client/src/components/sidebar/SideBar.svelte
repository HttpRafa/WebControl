<script lang="ts">
    import {
        Home,
        Plus,
        Adjustments,
        Chip,
        Server,
        Terminal,
        Folder,
        Key,
        FingerPrint,
        Cloud,
        DesktopComputer, DocumentDuplicate
    } from "svelte-hero-icons";
    import SideBarIcon from "./SideBarIcon.svelte";
    import SideBarDivider from "./SideBarDivider.svelte";
    import {SideBarIconIds} from "../../js/enums/SideBarIconIds";
    import {userData} from "../../js/Store";

    export let hideIcon: Array<number>;
</script>

<div class="fixed top-0 left-0 h-screen w-16 pt-1 flex flex-col bg-white dark:bg-gray-900 shadow-lg">
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
        {#each $userData.applications as application}
            {#if application.icon === 0}
                <SideBarIcon icon={Server} text={application.name} />
            {:else if application.icon === 1}
                <SideBarIcon icon={Chip} text={application.name} />
            {:else if application.icon === 2}
                <SideBarIcon icon={Cloud} text={application.name} />
            {:else if application.icon === 3}
                <SideBarIcon icon={DesktopComputer} text={application.name} />
            {:else if application.icon === 4}
                <SideBarIcon icon={DocumentDuplicate} text={application.name} />
            {/if}
        {/each}
    {/if}
    {#if !hideIcon.includes(SideBarIconIds.settings) }
        <SideBarDivider hide={false} />
        <SideBarIcon icon={FingerPrint} text="Settings" />
    {/if}
</div>