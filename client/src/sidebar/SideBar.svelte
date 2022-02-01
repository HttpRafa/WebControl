<script lang="ts">
    import {Home, FolderAdd, Database, Server, Collection, Archive, User, Selector } from "svelte-hero-icons";
    import SideBarIcon from "./SideBarIcon.svelte";
    import SideBarDivider from "./SideBarDivider.svelte";
</script>

<div class="fixed top-0 left-0 h-screen w-16 flex flex-col bg-white dark:bg-gray-900 shadow-lg">
    <SideBarIcon icon={Home} text="Home" />
    <SideBarDivider hide={false} />
    <SideBarIcon icon={Server} text="Application" />
    <SideBarIcon icon={Database} text="Options" />
    <SideBarIcon icon={Collection} text="Console" />
    <SideBarIcon icon={Archive} text="Files" />
    <SideBarIcon icon={User} text="Access" />
    <SideBarDivider hide={false} />
    <SideBarIcon icon={FolderAdd} text="Create Application" />
    <SideBarIcon icon={Server} text="Example Application" />
    <SideBarDivider hide={false} />
    <SideBarIcon icon={Selector} text="Settings" />
</div>