<script>
    import "../app.css";
    let { children } = $props();
</script>

<div class="min-h-screen bg-[#181818] text-white relative">
    <div class="min-h-screen">
        <main class="container mx-auto px-4 min-h-screen">
            {@render children()}
        </main>
    </div>
</div>

<style>
    /* Custom styles that can't be handled by Tailwind */
</style>
