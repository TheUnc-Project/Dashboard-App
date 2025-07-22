<script>
    let email = "";
    let password = "";

    function handleLogin(event) {
        event.preventDefault();
        // Add login logic here
        console.log("Login attempt:", { email, password });
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
                    <a
                        href="/dashboard"
                        class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        Sign in
                    </a>
                </div>
            </form>
        </div>
    </div>
</main>
