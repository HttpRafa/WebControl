<script lang="ts">
    import {Icon} from "svelte-hero-icons";

    export let icon: any;
    export let text: string;
</script>

<div class="sidebar-icon group">
    <Icon src="{icon}" size="26" />
    <span class="sidebar-tooltip group-hover:scale-100">
        {text}
    </span>
</div>