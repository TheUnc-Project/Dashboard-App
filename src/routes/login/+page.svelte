<script>
    import { login } from "$lib/api/auth";
    import { goto } from "$app/navigation";

    let email = "";
    let password = "";
    let error = "";
    let loading = false;

    async function handleLogin(event) {
        event.preventDefault();
        error = "";
        loading = true;

        try {
            await login(email, password);
            goto("/dashboard");
        } catch (e) {
            error = e.message || "Login failed. Please try again.";
        } finally {
            loading = false;
        }
    }
</script>

<svelte:head>
    <title>Login - TheUnc Project</title>
    <meta name="description" content="Login to your TheUnc Project dashboard" />
</svelte:head>

<main
    class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8"
>
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <div class="flex justify-center">
            <img
                src="/images/the-unc.png"
                alt="TheUnc Project"
                class="h-12 w-auto"
            />
        </div>
        <h2 class="mt-6 text-center text-3xl font-bold text-gray-900">
            Sign in to your account
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
            Access your customer feedback dashboard
        </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form class="space-y-6" on:submit={handleLogin}>
                <div>
                    <label
                        for="email"
                        class="block text-sm font-medium text-gray-700"
                    >
                        Email address
                    </label>
                    <div class="mt-1">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autocomplete="email"
                            required
                            bind:value={email}
                            class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                            placeholder="Enter your email"
                        />
                    </div>
                </div>

                <div>
                    {#if error}
                        <p class="text-red-600 text-sm mb-4">{error}</p>
                    {/if}
                    <button
                        type="submit"
                        disabled={loading}
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </div>
            </form>
        </div>
    </div>
</main>
