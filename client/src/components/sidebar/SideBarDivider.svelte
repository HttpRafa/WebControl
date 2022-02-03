<script lang="ts">
    export let hide: boolean;
</script>

{#if hide}
    <hr class="hidden sidebar-hr" />
{:else}
    <hr class="sidebar-hr">
{/if}