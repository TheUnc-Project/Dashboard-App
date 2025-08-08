<script>
    import { logout } from "$lib/api/auth";
    import { isAuthenticated } from "$lib/stores/auth";
    import { onMount } from "svelte";

    onMount(() => {
        isAuthenticated.check();
    });

    function handleLogout() {
        logout();
        isAuthenticated.set(false);
    }
</script>

<!-- Navigation -->
<nav class="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
            <div class="flex items-center">
                <a href="/" class="flex items-center">
                    <img
                        src="/images/the-unc.png"
                        alt="TheUnc Project"
                        class="h-8 w-auto"
                    />
                    <span class="ml-2 text-xl font-semibold text-gray-900"
                        >TheUnc Project</span
                    >
                </a>
            </div>
            <div class="flex items-center space-x-4">
                {#if $isAuthenticated}
                    <button
                        on:click={handleLogout}
                        class="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                    >
                        Log Out
                    </button>
                {:else}
                    <a
                        href="/login"
                        class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                    >
                        Get Started
                    </a>
                {/if}
            </div>
        </div>
    </div>
</nav>
