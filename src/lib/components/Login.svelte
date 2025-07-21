<script>
    import { onMount } from "svelte";
    let email = "";
    let password = "";
    let loading = false;
    let error = "";

    const handleSubmit = async () => {
        loading = true;
        error = "";

        try {
            // TODO: Implement actual login logic here
            console.log("Login attempt with:", { email, password });
        } catch (err) {
            error = "Failed to login. Please try again.";
        } finally {
            loading = false;
        }
    };

    onMount(() => {
        console.log("Login component mounted");
    });
</script>

<div class="flex flex-col items-center justify-center min-h-screen px-4">
    <div
        class="w-full max-w-md bg-gray-900/80 backdrop-blur-sm rounded-lg shadow-lg p-8 border border-gray-700"
    >
        <div class="flex items-center justify-center mb-6">
            <img
                src="/images/the-unc.png"
                alt="TheUnc Logo"
                class="w-20 h-20 object-contain"
            />
        </div>
        <h1 class="text-3xl font-bold text-center text-white mb-8">Login</h1>

        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
            {#if error}
                <div
                    class="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded"
                >
                    {error}
                </div>
            {/if}

            <div>
                <label
                    for="email"
                    class="block text-sm font-medium text-gray-300 mb-2"
                >
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    bind:value={email}
                    required
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="Enter your email"
                />
            </div>

            <div>
                <label
                    for="password"
                    class="block text-sm font-medium text-gray-300 mb-2"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    bind:value={password}
                    required
                    class="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
                    placeholder="Enter your password"
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </form>
    </div>
</div>
