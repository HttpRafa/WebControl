<script lang="ts">
    import SideBar from "./sidebar/SideBar.svelte";
    import HomeContent from "./components/HomeContent.svelte";
    import LoadingContent from "./components/LoadingContent.svelte";
    import LoginContent from "./components/LoginContent.svelte";
    import AddNodeContent from "./components/AddNodeContent.svelte";
    import RegisterContent from "./components/RegisterContent.svelte";
    import {PageIds} from "./js/PageIds";

    let sideId = PageIds.register;
</script>

<main class="flex">
    <SideBar />
    {#if sideId === PageIds.home}
        <HomeContent />
    {:else if sideId === PageIds.loading}
        <LoadingContent />
    {:else if sideId === PageIds.login}
        <LoginContent />
    {:else if sideId === PageIds.register}
        <RegisterContent />
    {:else if sideId === PageIds.addNode}
        <AddNodeContent />
    {/if}
</main>

<style>
</style>