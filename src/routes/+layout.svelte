<script>import "../app.css";
import Header from "$lib/components/Header.svelte";
import Footer from "$lib/components/Footer.svelte";</script>

<div class="min-h-screen bg-white">
    <Header></Header>
    <main>
        <slot></slot>
    </main>
    <Footer></Footer>
</div>


<style>
    /* Custom styles that can't be handled by Tailwind */
</style>
