<script>
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    import "chartjs-adapter-date-fns";
    import DashboardHeader from "$lib/components/DashboardHeader.svelte";
    import TopicCard from "$lib/components/TopicCard.svelte";
    import Modal from "$lib/components/Modal.svelte";

    Chart.register(...registerables);

    let sentimentChartCanvas;
    let topicChartCanvas;
    let volumeChartCanvas;
    let topicChart;
    let volumeChart;
    let showAddTopic = false;
    let showTopicModal = false;
    let topicsPerPage = 6;
    let currentTopicsCount = 6;

    let feedbackData = [
        {
            id: 1,
            message: "Great service! Very happy with the delivery speed.",
            sentiment: "positive",
            topic: "delivery",
            timestamp: "2024-01-15 14:30",
            media: null,
        },
        {
            id: 2,
            message: "The product quality could be better. Not satisfied.",
            sentiment: "negative",
            topic: "product quality",
            timestamp: "2024-01-15 12:15",
            media: null,
        },
        {
            id: 3,
            message: "Average experience. Nothing special.",
            sentiment: "neutral",
            topic: "general",
            timestamp: "2024-01-15 10:45",
            media: "image",
        },
    ];

    let stats = {
        totalMessages: 1247,
        positiveCount: 789,
        negativeCount: 234,
        neutralCount: 224,
        todayMessages: 47,
    };

    let topics = [
        {
            id: 1,
            name: "Delivery",
            description:
                "Issues and feedback related to delivery speed, timing, and logistics",
            color: "#3B82F6",
            messageCount: 342,
        },
        {
            id: 2,
            name: "Product Quality",
            description:
                "Feedback about product defects, quality issues, or satisfaction",
            color: "#EF4444",
            messageCount: 234,
        },
        {
            id: 3,
            name: "Customer Service",
            description: "Interactions with support team and service quality",
            color: "#8B5CF6",
            messageCount: 189,
        },
        {
            id: 4,
            name: "General",
            description: "General feedback that doesn't fit other categories",
            color: "#10B981",
            messageCount: 156,
        },
        {
            id: 5,
            name: "Pricing",
            description: "Feedback about product pricing and value for money",
            color: "#F59E0B",
            messageCount: 89,
        },
        {
            id: 6,
            name: "Website Issues",
            description:
                "Problems with website functionality, navigation, or user experience",
            color: "#06B6D4",
            messageCount: 78,
        },
        {
            id: 7,
            name: "Payment Problems",
            description: "Issues with payment processing, billing, or refunds",
            color: "#84CC16",
            messageCount: 65,
        },
        {
            id: 8,
            name: "Returns & Exchanges",
            description:
                "Feedback about return policy, exchange process, or product returns",
            color: "#F97316",
            messageCount: 54,
        },
        {
            id: 9,
            name: "Account Management",
            description:
                "Issues with user accounts, login problems, or profile management",
            color: "#EC4899",
            messageCount: 43,
        },
        {
            id: 10,
            name: "Technical Support",
            description: "Technical issues, bugs, or software-related problems",
            color: "#6366F1",
            messageCount: 38,
        },
        {
            id: 11,
            name: "Promotions & Discounts",
            description:
                "Feedback about promotional offers, coupon codes, or discounts",
            color: "#14B8A6",
            messageCount: 29,
        },
        {
            id: 12,
            name: "Product Information",
            description:
                "Questions or feedback about product specifications or details",
            color: "#F59E0B",
            messageCount: 25,
        },
        {
            id: 13,
            name: "Mobile App",
            description:
                "Issues or feedback specific to the mobile application",
            color: "#8B5CF6",
            messageCount: 21,
        },
        {
            id: 14,
            name: "Subscription Management",
            description:
                "Feedback about subscription plans, renewals, or cancellations",
            color: "#EF4444",
            messageCount: 18,
        },
        {
            id: 15,
            name: "Feature Requests",
            description:
                "Suggestions for new features or improvements to existing ones",
            color: "#10B981",
            messageCount: 15,
        },
    ];

    // Chart data
    const topicData = {
        labels: topics.slice(0, 5).map((t) => t.name),
        datasets: [
            {
                data: topics.slice(0, 5).map((t) => t.messageCount),
                backgroundColor: topics.slice(0, 5).map((t) => t.color),
                borderWidth: 0,
            },
        ],
    };

    const volumeData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label: "Messages",
                data: [89, 156, 134, 178, 167, 145, 123],
                borderColor: "#10B981",
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                fill: true,
                tension: 0.4,
            },
        ],
    };

    function getSentimentColor(sentiment) {
        switch (sentiment) {
            case "positive":
                return "text-green-600 bg-green-100";
            case "negative":
                return "text-red-600 bg-red-100";
            case "neutral":
                return "text-yellow-600 bg-yellow-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    }

    function handleTopicSave(event) {
        const topicData = event.detail;

        if (topicData.id) {
            // Update existing topic
            const index = topics.findIndex((t) => t.id === topicData.id);
            if (index !== -1) {
                topics[index] = { ...topicData };
                topics = topics; // Trigger reactivity
            }
        } else {
            // Add new topic
            const newTopic = {
                ...topicData,
                id: Math.max(...topics.map((t) => t.id)) + 1,
                messageCount: 0,
            };
            topics = [...topics, newTopic];
            showAddTopic = false;
        }

        console.log("Topic saved:", topicData);
    }

    function handleTopicDelete(event) {
        const topicId = event.detail;
        topics = topics.filter((t) => t.id !== topicId);
        console.log("Topic deleted:", topicId);
    }

    function handleAddTopicCancel() {
        showAddTopic = false;
    }

    function loadMoreTopics() {
        currentTopicsCount = Math.min(
            currentTopicsCount + topicsPerPage,
            topics.length,
        );
    }

    // Reactive statement for displayed topics
    $: displayedTopics = topics.slice(0, currentTopicsCount);
    $: hasMoreTopics = currentTopicsCount < topics.length;

    function createCharts() {
        // Topic Chart (Bar)
        if (topicChartCanvas) {
            topicChart = new Chart(topicChartCanvas, {
                type: "bar",
                data: topicData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: "rgba(0,0,0,0.1)",
                            },
                        },
                        x: {
                            grid: {
                                display: false,
                            },
                        },
                    },
                },
            });
        }

        // Volume Chart (Line)
        if (volumeChartCanvas) {
            volumeChart = new Chart(volumeChartCanvas, {
                type: "line",
                data: volumeData,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false,
                        },
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                color: "rgba(0,0,0,0.1)",
                            },
                        },
                        x: {
                            grid: {
                                display: false,
                            },
                        },
                    },
                    elements: {
                        point: {
                            radius: 4,
                            hoverRadius: 6,
                        },
                    },
                },
            });
        }
    }

    onMount(() => {
        console.log("Dashboard loaded");
        createCharts();

        return () => {
            // Cleanup charts on component destroy
            if (topicChart) topicChart.destroy();
            if (volumeChart) volumeChart.destroy();
        };
    });
</script>

<svelte:head>
    <title>Dashboard - TheUnc Project</title>
    <meta name="description" content="Customer feedback analytics dashboard" />
</svelte:head>

<main class="min-h-screen bg-gray-50 pt-16">
    <!-- Dashboard Header Component -->
    <DashboardHeader
        title="Customer Feedback Dashboard"
        description="Monitor and analyze WhatsApp customer feedback in real-time"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-blue-100 rounded-lg">
                        <svg
                            class="h-6 w-6 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">
                            Total Messages
                        </p>
                        <p class="text-2xl font-semibold text-gray-900">
                            {stats.totalMessages}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-green-100 rounded-lg">
                        <svg
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
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">
                            Positive
                        </p>
                        <p class="text-2xl font-semibold text-green-600">
                            {stats.positiveCount}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-red-100 rounded-lg">
                        <svg
                            class="h-6 w-6 text-red-600"
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
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">
                            Negative
                        </p>
                        <p class="text-2xl font-semibold text-red-600">
                            {stats.negativeCount}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-yellow-100 rounded-lg">
                        <svg
                            class="h-6 w-6 text-yellow-600"
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
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Neutral</p>
                        <p class="text-2xl font-semibold text-yellow-600">
                            {stats.neutralCount}
                        </p>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center">
                    <div class="p-2 bg-purple-100 rounded-lg">
                        <svg
                            class="h-6 w-6 text-purple-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    <div class="ml-4">
                        <p class="text-sm font-medium text-gray-600">Today</p>
                        <p class="text-2xl font-semibold text-purple-600">
                            {stats.todayMessages}
                        </p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Topic Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    Topic Summary
                </h3>
                <div class="h-64">
                    <canvas bind:this={topicChartCanvas}></canvas>
                </div>
            </div>

            <!-- Message Volume Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    Weekly Message Volume
                </h3>
                <div class="h-64">
                    <canvas bind:this={volumeChartCanvas}></canvas>
                </div>
            </div>
        </div>

        <!-- Topic Management Button -->
        <div class="mb-8">
            <div class="bg-white rounded-lg shadow p-6">
                <div class="flex items-center justify-between">
                    <div>
                        <h2 class="text-lg font-semibold text-gray-900">
                            Topic Management
                        </h2>
                        <p class="text-gray-600 text-sm mt-1">
                            Configure categories for automatic message
                            classification
                        </p>
                    </div>
                    <button
                        on:click={() => (showTopicModal = true)}
                        class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm"
                    >
                        <svg
                            class="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                        </svg>
                        Manage Topics
                    </button>
                </div>
            </div>
        </div>

        <!-- Filters and Search -->
        <div class="bg-white rounded-lg shadow mb-8 p-6">
            <div class="flex flex-col sm:flex-row gap-4">
                <div class="flex-1">
                    <input
                        type="text"
                        placeholder="Search messages..."
                        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                </div>
                <div class="flex gap-2">
                    <select
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option>All Sentiments</option>
                        <option>Positive</option>
                        <option>Negative</option>
                        <option>Neutral</option>
                    </select>
                    <select
                        class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                        <option>All Topics</option>
                        <option>Delivery</option>
                        <option>Product Quality</option>
                        <option>Customer Service</option>
                        <option>General</option>
                    </select>
                    <button
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        Filter
                    </button>
                </div>
            </div>
        </div>

        <!-- Recent Messages -->
        <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">
                    Customer Messages
                </h2>
            </div>
            <div class="divide-y divide-gray-200">
                {#each feedbackData as feedback}
                    <div class="p-6 hover:bg-gray-50">
                        <div class="flex items-start justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <span
                                        class="px-2 py-1 text-xs font-medium rounded-full {getSentimentColor(
                                            feedback.sentiment,
                                        )}"
                                    >
                                        {feedback.sentiment}
                                    </span>
                                    <span
                                        class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full"
                                    >
                                        {feedback.topic}
                                    </span>
                                    {#if feedback.media}
                                        <span
                                            class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full"
                                        >
                                            📷 Media
                                        </span>
                                    {/if}
                                </div>
                                <p class="text-gray-700 mb-2">
                                    {feedback.message}
                                </p>
                                <p class="text-sm text-gray-500">
                                    {feedback.timestamp}
                                </p>
                            </div>
                            {#if feedback.media}
                                <div class="ml-4 flex-shrink-0">
                                    <div
                                        class="w-24 h-24 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden"
                                    >
                                        {#if feedback.media === "image"}
                                            <!-- Placeholder image -->
                                            <div
                                                class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center"
                                            >
                                                <svg
                                                    class="w-8 h-8 text-blue-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        {:else if feedback.media === "video"}
                                            <!-- Placeholder video -->
                                            <div
                                                class="w-full h-full bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center"
                                            >
                                                <svg
                                                    class="w-8 h-8 text-red-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>
                                        {:else}
                                            <!-- Generic file -->
                                            <div
                                                class="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"
                                            >
                                                <svg
                                                    class="w-8 h-8 text-gray-500"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        stroke-linecap="round"
                                                        stroke-linejoin="round"
                                                        stroke-width="2"
                                                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                                    />
                                                </svg>
                                            </div>
                                        {/if}
                                    </div>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Load More -->
        <div class="text-center mt-8">
            <button
                class="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            >
                Load More Messages
            </button>
        </div>
    </div>
</main>

<!-- Topic Management Modal -->
<Modal
    isOpen={showTopicModal}
    title="Topic Management"
    size="xl"
    on:close={() => (showTopicModal = false)}
>
    <div class="space-y-6">
        <div class="flex justify-between items-center">
            <p class="text-gray-600">
                Configure categories for automatic message classification
            </p>
            <button
                on:click={() => (showAddTopic = true)}
                class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm"
            >
                <svg
                    class="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                </svg>
                Add Topic
            </button>
        </div>

        <!-- Add Topic Card (separate section) -->
        {#if showAddTopic}
            <div class="border-b border-gray-200 pb-6">
                <TopicCard
                    mode="add"
                    on:save={handleTopicSave}
                    on:cancel={handleAddTopicCancel}
                />
            </div>
        {/if}

        <!-- Existing Topics Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {#each displayedTopics as topic (topic.id)}
                <TopicCard
                    mode="view"
                    {topic}
                    on:save={handleTopicSave}
                    on:delete={handleTopicDelete}
                />
            {/each}
        </div>

        <!-- Load More Button -->
        {#if hasMoreTopics}
            <div class="text-center pt-4">
                <button
                    on:click={loadMoreTopics}
                    class="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium text-sm"
                >
                    <svg
                        class="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                    Load More Topics ({topics.length - currentTopicsCount} remaining)
                </button>
            </div>
        {/if}
    </div>
</Modal>
