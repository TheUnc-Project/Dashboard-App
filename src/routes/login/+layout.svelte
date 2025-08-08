<script>
    import { onMount } from "svelte";
    import { goto } from "$app/navigation";
    import { isAuthenticated } from "$lib/stores/auth";
    import { browser } from "$app/environment";

    onMount(() => {
        if (browser) {
            const isAuthed = isAuthenticated.check();
            if (isAuthed) {
                goto("/dashboard");
            }
        }
    });
</script>

<slot />
