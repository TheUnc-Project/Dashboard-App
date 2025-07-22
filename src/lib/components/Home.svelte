<script>
    import { onMount } from "svelte";

    onMount(() => {
        console.log("Dashboard component mounted");
    });
</script>

<!-- Hero Section -->
<main class="pt-16">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center">
            <div
                class="inline-block bg-green-100 text-green-800 px-4 py-1 rounded-full text-sm font-medium mb-4"
            >
                AI-Powered Customer Insights
            </div>
            <h1
                class="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
            >
                Transform your customer
                <span class="text-green-600">feedback</span>
            </h1>
            <p class="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Automatically analyze, categorize, and extract meaningful
                insights from your WhatsApp customer messages. Make data-driven
                decisions that improve customer satisfaction and business
                growth.
            </p>
            <div class="flex justify-center space-x-4">
                <a
                    href="/login"
                    class="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 flex items-center"
                >
                    Login to Dashboard
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 ml-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fill-rule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </a>
            </div>
        </div>

        <!-- Features Section -->
        <div class="py-24">
            <div class="text-center mb-16">
                <h2 class="text-4xl font-bold text-gray-900 mb-4">
                    Real-time Analytics Dashboard
                </h2>
                <p class="text-xl text-gray-600">
                    Everything you need to understand your data better
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <!-- Sentiment Analysis -->
                <div
                    class="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                    <div
                        class="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-green-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">
                        Sentiment Analysis
                    </h3>
                    <p class="text-gray-600">
                        Automatically classifies customer messages as positive,
                        negative, or neutral using AI-driven models to help
                        identify satisfaction and dissatisfaction trends.
                    </p>
                </div>

                <!-- Topic Categorization -->
                <div
                    class="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                    <div
                        class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">
                        Topic Categorization
                    </h3>
                    <p class="text-gray-600">
                        Tags each message with a relevant topic (e.g., delivery
                        issue, refund request) using rule-based or ML-based
                        classification for better organization and filtering.
                    </p>
                </div>

                <!-- Real-time Message Ingestion -->
                <div
                    class="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                    <div
                        class="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">
                        Real-time Message Ingestion
                    </h3>
                    <p class="text-gray-600">
                        Receives and stores customer messages and media from
                        WhatsApp instantly via webhook, allowing the dashboard
                        to stay up to date with new feedback.
                    </p>
                </div>

                <!-- Media Integration -->
                <div
                    class="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                    <div
                        class="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-orange-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">
                        Media Integration
                    </h3>
                    <p class="text-gray-600">
                        Processes and stores customer-shared images and videos
                        securely on Amazon S3, with direct access from the
                        dashboard for visual reference.
                    </p>
                </div>

                <!-- Dashboard Search & Filtering -->
                <div
                    class="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                    <div
                        class="bg-red-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">
                        Dashboard Search & Filtering
                    </h3>
                    <p class="text-gray-600">
                        Enables administrators to search, filter, and group
                        feedback by sentiment, topic, time range, or
                        user-defined tags for focused analysis.
                    </p>
                </div>

                <!-- Secure & Compliant Storage -->
                <div
                    class="bg-white p-8 rounded-lg shadow-sm border border-gray-100"
                >
                    <div
                        class="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-6"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-3">
                        Secure & Compliant Storage
                    </h3>
                    <p class="text-gray-600">
                        Ensures all feedback data and media are securely stored
                        in PostgreSQL and S3 with privacy-compliant access
                        controls.
                    </p>
                </div>
            </div>
        </div>
    </div>
</main>

<style>
    /* Add any custom styles here */
    :global(body) {
        background-color: #f9fafb;
    }
</style>
