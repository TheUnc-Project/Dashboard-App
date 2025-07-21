<script>
    import { page } from "$app/stores";
</script>

<div
    class="container mx-auto px-4 py-16 min-h-screen flex flex-col items-center justify-center"
>
    <div class="text-center space-y-4">
        <h1
            class="text-[120px] font-bold text-[#58a6ff] font-dm-serif leading-none"
        >
            {$page.status}
        </h1>
        <h2 class="text-2xl font-semibold text-gray-300">
            {$page.error?.message || "Page Not Found"}
        </h2>
        <p class="text-gray-400 text-lg">
            The page you're looking for doesn't exist or has been moved.
        </p>
        <div class="pt-6">
            <a
                href="/"
                class="inline-block text-[#58a6ff] hover:underline transition-colors duration-200"
            >
                Return Home
            </a>
        </div>
    </div>
</div>

<svelte:head>
    <title>Page Not Found | TheUnc</title>
    <meta
        name="description"
        content="The page you're looking for doesn't exist or has been moved."
    />
    <meta name="robots" content="noindex, follow" />
</svelte:head>
