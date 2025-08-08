<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { isAuthenticated } from "$lib/stores/auth";
    import { browser } from "$app/environment";

    let authenticated = false;
    isAuthenticated.subscribe((value) => {
        authenticated = value;
    });

    onMount(() => {
        isAuthenticated.check();
        if (browser && !authenticated) {
            goto("/login");
        }
    });
</script>

<slot />
