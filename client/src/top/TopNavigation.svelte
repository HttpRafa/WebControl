<script lang="ts">
    import {Icon, Moon, Sun, Hashtag, UserCircle} from "svelte-hero-icons";
    import {darkMode} from "../store";
    import {onMount} from "svelte";

    export let title: string;

    onMount(() => {
        darkMode.update(value => {
            update(value);
            return value;
        })
    });

    function changeTheme() {
        darkMode.update(value => {
            update(!value)

            return !value
        })
    }

    function update(value: boolean) {
        const bodyClass = window.document.body.classList;

        value ? bodyClass.add("dark") : bodyClass.remove("dark");
    }

</script>

<div class="top-navigation">
    <p class='title-text-root'>WebControl</p>
    <Icon src={Hashtag} size="18" class="mr-1 ml-1 title-slash" />
    <h5 class='title-text'>{title}</h5>
    <span on:click={changeTheme}>
        {#if darkMode}
            <Icon src={Sun} class="top-navigation-icon" size="24" />
        {:else}
            <Icon src={Moon} class="top-navigation-icon" size="24" />
        {/if}
    </span>
    <Icon src={UserCircle} size="24" class="top-navigation-icon" />
</div>