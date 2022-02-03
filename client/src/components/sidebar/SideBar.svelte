<script lang="ts">
    import {Home, Plus, Adjustments, Chip, Server, Terminal, Folder, Key, FingerPrint } from "svelte-hero-icons";
    import SideBarIcon from "./SideBarIcon.svelte";
    import SideBarDivider from "./SideBarDivider.svelte";
</script>

<div class="fixed top-0 left-0 h-screen w-16 flex flex-col bg-white dark:bg-gray-900 shadow-lg">
    <SideBarIcon icon={Home} text="Home" />
    <SideBarDivider hide={false} />
    <SideBarIcon icon={Chip} text="Application" />
    <SideBarIcon icon={Adjustments} text="Options" />
    <SideBarIcon icon={Terminal} text="Console" />
    <SideBarIcon icon={Folder} text="Files" />
    <SideBarIcon icon={Key} text="Access" />
    <SideBarDivider hide={false} />
    <SideBarIcon icon={Plus} text="Create Application" />
    <SideBarIcon icon={Server} text="Example Application" />
    <SideBarDivider hide={false} />
    <SideBarIcon icon={FingerPrint} text="Settings" />
</div>