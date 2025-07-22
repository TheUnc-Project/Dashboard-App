<script>
    export let title = "Dashboard";
    export let description = "";
    export let showActions = true;
    export let showDateFilter = true;
    export let showExportButton = true;
    export let showRefreshButton = true;

    let selectedDateRange = "7d";

    function handleExport() {
        console.log("Exporting data...");
        // Add export functionality here
    }

    function handleRefresh() {
        console.log("Refreshing data...");
        // Add refresh functionality here
    }

    function handleDateChange(event) {
        selectedDateRange = event.target.value;
        console.log("Date range changed to:", selectedDateRange);
        // Add date filter functionality here
    }
</script>

<div class="bg-white border-b border-gray-200 mb-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div
            class="flex flex-col sm:flex-row sm:items-center sm:justify-between"
        >
            <!-- Title and Description -->
            <div class="flex-1 min-w-0">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                    {title}
                </h1>
                {#if description}
                    <p class="text-gray-600 text-sm sm:text-base">
                        {description}
                    </p>
                {/if}
            </div>
        </div>

        <!-- Optional Breadcrumbs -->
        <nav class="mt-4 flex" aria-label="Breadcrumb">
            <ol class="flex items-center space-x-4">
                <li>
                    <div>
                        <a href="/" class="text-gray-400 hover:text-gray-500">
                            <svg
                                class="flex-shrink-0 h-5 w-5"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"
                                />
                            </svg>
                            <span class="sr-only">Home</span>
                        </a>
                    </div>
                </li>
                <li>
                    <div class="flex items-center">
                        <svg
                            class="flex-shrink-0 h-5 w-5 text-gray-300"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fill-rule="evenodd"
                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                clip-rule="evenodd"
                            />
                        </svg>
                        <span class="ml-4 text-sm font-medium text-gray-500"
                            >Dashboard</span
                        >
                    </div>
                </li>
            </ol>
        </nav>
    </div>
</div>
