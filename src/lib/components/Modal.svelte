<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    export let isOpen = false;
    export let title = "";
    export let size = "lg"; // 'sm', 'md', 'lg', 'xl', 'full'
    export let showCloseButton = true;
    export let closeOnBackdrop = true;

    function handleClose() {
        dispatch("close");
    }

    function handleBackdropClick(event) {
        if (closeOnBackdrop && event.target === event.currentTarget) {
            handleClose();
        }
    }

    function handleKeydown(event) {
        if (event.key === "Escape") {
            handleClose();
        }
    }

    const sizeClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-4xl",
        xl: "max-w-6xl",
        full: "max-w-full mx-4",
    };
</script>

{#if isOpen}
    <div
        class="fixed inset-0 z-50 overflow-y-auto"
        on:keydown={handleKeydown}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
    >
        <!-- Backdrop -->
        <div
            class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            on:click={handleBackdropClick}
        ></div>

        <!-- Modal Container -->
        <div class="flex min-h-full items-center justify-center p-4">
            <!-- Modal Content -->
            <div
                class="relative bg-white rounded-lg shadow-xl transform transition-all w-full {sizeClasses[
                    size
                ]}"
            >
                <!-- Header -->
                {#if title || showCloseButton}
                    <div
                        class="flex items-center justify-between p-6 border-b border-gray-200"
                    >
                        {#if title}
                            <h3
                                id="modal-title"
                                class="text-lg font-semibold text-gray-900"
                            >
                                {title}
                            </h3>
                        {/if}

                        {#if showCloseButton}
                            <button
                                type="button"
                                on:click={handleClose}
                                class="text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-lg p-1"
                            >
                                <svg
                                    class="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        {/if}
                    </div>
                {/if}

                <!-- Body -->
                <div class="p-6">
                    <slot></slot>
                </div>

                <!-- Footer (if provided) -->
                {#if $$slots.footer}
                    <div
                        class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg"
                    >
                        <slot name="footer"></slot>
                    </div>
                {/if}
            </div>
        </div>
    </div>
{/if}

<style>
    /* Prevent body scroll when modal is open */
    :global(body.modal-open) {
        overflow: hidden;
    }
</style>
