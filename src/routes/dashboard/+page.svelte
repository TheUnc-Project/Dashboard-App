<script>
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    import "chartjs-adapter-date-fns";
    import { WordCloudController, WordElement } from "chartjs-chart-wordcloud";
    import DashboardHeader from "$lib/components/DashboardHeader.svelte";
    import TopicCard from "$lib/components/TopicCard.svelte";
    import Modal from "$lib/components/Modal.svelte";
    import { getAllTopics, createTopic, deleteTopic } from "$lib/api/topic";
    import {
        getStatistics,
        getMessages,
        getWordCloudStats,
    } from "$lib/api/dashboard";

    Chart.register(...registerables);
    Chart.register(WordCloudController, WordElement);

    let sentimentChartCanvas;
    let topicChartCanvas;
    let volumeChartCanvas;
    let topicChart;
    let volumeChart;
    let showAddTopic = false;
    let showTopicModal = false;
    let showMediaModal = false;
    let selectedMediaUrl = "";
    let topics = [];
    let colorIndex = 0;

    const colors = [
        "#10B981",
        "#3B82F6",
        "#8B5CF6",
        "#06B6D4",
        "#F59E0B",
        "#EF4444",
        "#84CC16",
        "#F97316",
    ];

    function areArraysEqual(arr1, arr2) {
        if (!arr1 || !arr2) return false;
        if (arr1.length !== arr2.length) return false;
        return arr1.every((val, idx) => val === arr2[idx]);
    }

    function areLabelsEqual(labels1, labels2) {
        if (!labels1 || !labels2) return false;
        if (labels1.length !== labels2.length) return false;
        return labels1.every((val, idx) => val === labels2[idx]);
    }

    function updateChartIfNeeded(chart, newData, newLabels) {
        if (!chart?.data) return false;

        const currentData = chart.data.datasets[0].data;
        const currentLabels = chart.data.labels;

        const dataChanged = !areArraysEqual(currentData, newData);
        const labelsChanged = !areLabelsEqual(currentLabels, newLabels);

        if (dataChanged || labelsChanged) {
            chart.data.datasets[0].data = newData;
            chart.data.labels = newLabels;
            chart.update("none"); // Use 'none' for better performance
            return true;
        }
        return false;
    }

    // Reactive statements for chart updates
    $: {
        if (topicChartCanvas && topTopics) {
            // Ensure we always have 10 topics by padding with empty ones if necessary
            const paddedTopics = [...topTopics];
            while (paddedTopics.length < 10) {
                paddedTopics.push({ topic: "No Data", count: 0 });
            }
            // Take only top 10 if we have more
            const top10Topics = paddedTopics.slice(0, 10);

            // Update topic data
            topicData = {
                labels: top10Topics.map((t) => capitalizeWords(t.topic)),
                datasets: [
                    {
                        data: top10Topics.map((t) => t.count),
                        backgroundColor: top10Topics.map(
                            (_, i) => colors[i % colors.length],
                        ),
                        borderWidth: 0,
                    },
                ],
            };
            createTopicChart();
        }
    }

    $: {
        if (volumeChartCanvas && wordCloudData) {
            // Ensure we always have 10 words by padding with empty ones if necessary
            const currentWords = wordCloudData.labels;
            const currentCounts = wordCloudData.datasets[0].data;
            const currentColors = wordCloudData.datasets[0].backgroundColor;

            // Create arrays of exactly 10 items
            const paddedWords = [...currentWords];
            const paddedCounts = [...currentCounts];
            const paddedColors = [...currentColors];

            while (paddedWords.length < 10) {
                paddedWords.push("No Data");
                paddedCounts.push(0);
                paddedColors.push(colors[paddedWords.length % colors.length]);
            }

            // Take only top 10 if we have more
            wordCloudData = {
                labels: paddedWords.slice(0, 10),
                datasets: [
                    {
                        ...wordCloudData.datasets[0],
                        data: paddedCounts.slice(0, 10),
                        backgroundColor: paddedColors.slice(0, 10),
                    },
                ],
            };
            createWordCountChart();
        }
    }

    async function loadMessages(page = 0) {
        try {
            isLoading = true;
            const response = await getMessages({ page, page_size: pageSize });

            if (page === 0) {
                // Reset feedback data if it's the first page
                feedbackData = response.messages;
            } else {
                // Append messages for subsequent pages
                feedbackData = [...feedbackData, ...response.messages];
            }

            totalMessages = response.total;
            currentPage = response.page;

            // Update word count chart with new data
            createWordCountChart();
        } catch (error) {
            console.error("Error loading messages:", error);
        } finally {
            isLoading = false;
        }
    }

    let statisticsInterval;
    let wordCloudInterval;
    let messagesInterval;

    async function refreshStatistics() {
        try {
            const statistics = await getStatistics();

            // Update stats
            stats = {
                totalMessages: statistics.num_messages,
                positiveCount: statistics.num_positive_messages,
                negativeCount: statistics.num_negative_messages,
                neutralCount: statistics.num_neutral_messages,
            };

            // Update top topics for chart
            topTopics = statistics.top_topics;

            console.log(
                "Statistics refreshed at:",
                new Date().toLocaleTimeString(),
            );
        } catch (error) {
            console.error("Error refreshing statistics:", error);
        }
    }

    async function refreshWordCloud() {
        try {
            await loadWordCloudData();
            console.log(
                "Word cloud refreshed at:",
                new Date().toLocaleTimeString(),
            );
        } catch (error) {
            console.error("Error refreshing word cloud:", error);
        }
    }

    async function refreshMessages() {
        try {
            await loadMessages(currentPage);
            console.log(
                "Messages refreshed at:",
                new Date().toLocaleTimeString(),
            );
        } catch (error) {
            console.error("Error refreshing messages:", error);
        }
    }

    onMount(async () => {
        try {
            // Load topics, statistics, and initial messages in parallel
            const [topicsData, statistics, messagesResponse] =
                await Promise.all([
                    getAllTopics(),
                    getStatistics(),
                    getMessages({ page: 0, page_size: pageSize }),
                ]);

            // Update topics
            topics = topicsData;
            colorIndex = topics.length;

            // Update stats
            stats = {
                totalMessages: statistics.num_messages,
                positiveCount: statistics.num_positive_messages,
                negativeCount: statistics.num_negative_messages,
                neutralCount: statistics.num_neutral_messages,
            };

            // Update top topics for chart
            topTopics = statistics.top_topics;

            // Initialize feedback data
            feedbackData = messagesResponse.messages;
            totalMessages = messagesResponse.total;
            currentPage = messagesResponse.page;

            // Load and initialize word cloud data
            await loadWordCloudData();

            // Set up refresh intervals
            statisticsInterval = setInterval(refreshStatistics, 10000); // Every 10 seconds
            wordCloudInterval = setInterval(refreshWordCloud, 10000); // Every 10 seconds
            messagesInterval = setInterval(refreshMessages, 10000); // Every 10 seconds
        } catch (error) {
            console.error("Error loading dashboard data:", error);
        }

        // Cleanup function
        return () => {
            if (statisticsInterval) {
                clearInterval(statisticsInterval);
            }
            if (wordCloudInterval) {
                clearInterval(wordCloudInterval);
            }
            if (messagesInterval) {
                clearInterval(messagesInterval);
            }
            cleanup();
        };
    });

    // Pagination state
    let currentPage = 0;
    let pageSize = 20;
    let totalMessages = 0;
    let isLoading = false;
    let feedbackData = [];

    let stats = {
        totalMessages: 0,
        positiveCount: 0,
        negativeCount: 0,
        neutralCount: 0,
    };

    let topTopics = [];

    // Function to capitalize words in a string
    function capitalizeWords(str) {
        return str
            .split(" ")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    }

    let topicData = {
        labels: [],
        datasets: [
            {
                data: [],
                backgroundColor: [],
                borderWidth: 0,
            },
        ],
    };

    let wordCloudData = {
        labels: [],
        datasets: [
            {
                label: "Word Cloud",
                data: [],
                backgroundColor: [],
                borderWidth: 1,
                pointStyle: "word",
                rotation: [-30, 30],
            },
        ],
    };

    async function loadWordCloudData() {
        try {
            const data = await getWordCloudStats();
            const maxCount = Math.max(...data.words.map((w) => w.count));

            // Filter out words with very low counts (less than 10% of max)
            const significantWords = data.words.filter(
                (w) => w.count > maxCount * 0.1,
            );

            wordCloudData = {
                labels: significantWords.map((w) => w.word),
                datasets: [
                    {
                        label: "Word Cloud",
                        data: significantWords.map((w) => w.count),
                        backgroundColor: significantWords.map(
                            (_, i) => colors[i % colors.length],
                        ),
                        borderWidth: 1,
                        pointStyle: "word",
                        rotation: [-30, 30],
                    },
                ],
            };

            console.log("Updated word cloud data:", wordCloudData);
        } catch (error) {
            console.error("Error loading word cloud data:", error);
        }
    }

    function getSentimentStyles(sentiment) {
        switch (sentiment.toLowerCase()) {
            case "positive":
                return {
                    pill: "text-green-600 bg-green-100",
                    topic: "text-green-700 bg-green-50",
                };
            case "negative":
                return {
                    pill: "text-red-600 bg-red-100",
                    topic: "text-red-700 bg-red-50",
                };
            default: // neutral or any other case
                return {
                    pill: "text-gray-600 bg-gray-100",
                    topic: "text-gray-700 bg-gray-50",
                };
        }
    }

    async function handleTopicSave(event) {
        const topicData = event.detail;

        try {
            if (topicData.id) {
                // Update existing topic
                const index = topics.findIndex((t) => t.id === topicData.id);
                if (index !== -1) {
                    topics[index] = { ...topicData };
                    topics = topics; // Trigger reactivity
                }
            } else {
                // Add new topic
                const newTopic = await createTopic({
                    label: topicData.label,
                    description: topicData.description,
                });
                topics = [...topics, newTopic];
                showAddTopic = false;
            }

            console.log("Topic saved:", topicData);
        } catch (error) {
            console.error("Error saving topic:", error);
        }
    }

    async function handleTopicDelete(event) {
        const topicId = event.detail;
        try {
            await deleteTopic(topicId);
            topics = topics.filter((t) => t.id !== topicId);
            console.log("Topic deleted:", topicId);
        } catch (error) {
            console.error("Error deleting topic:", error);
        }
    }

    function handleAddTopicCancel() {
        showAddTopic = false;
    }

    function createTopicChart() {
        // Ensure we have the canvas and data
        if (!topicChartCanvas || !topicData) {
            return;
        }

        // If chart exists, try to update it
        if (topicChart) {
            const updated = updateChartIfNeeded(
                topicChart,
                topicData.datasets[0].data,
                topicData.labels,
            );
            if (updated) {
                console.log("Topic chart updated with new data");
            } else {
                console.log("Topic chart data unchanged - skipping update");
            }
            return;
        }

        // Create new chart only if it doesn't exist
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
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                // Don't show tooltip for "No Data" entries
                                if (
                                    context.raw === 0 &&
                                    context.label === "No Data"
                                ) {
                                    return "";
                                }
                                return `Messages: ${context.raw}`;
                            },
                        },
                        filter: function (tooltipItem) {
                            // Hide tooltip for "No Data" entries
                            return !(
                                tooltipItem.raw === 0 &&
                                tooltipItem.label === "No Data"
                            );
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                        title: {
                            display: true,
                            text: "Number of Messages",
                            font: {
                                size: 14,
                                weight: "bold",
                            },
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                size: 12,
                            },
                            maxRotation: 45,
                            minRotation: 45,
                            callback: function (value, index, values) {
                                // Hide "No Data" labels
                                const label = this.getLabelForValue(value);
                                return label === "No Data" ? "" : label;
                            },
                        },
                    },
                },
            },
        });
        console.log("New topic chart created");
    }

    function createWordCountChart() {
        // Ensure we have the canvas and data
        if (!volumeChartCanvas || !wordCloudData) {
            return;
        }

        // If chart exists, try to update it
        if (volumeChart) {
            const updated = updateChartIfNeeded(
                volumeChart,
                wordCloudData.datasets[0].data,
                wordCloudData.labels,
            );
            if (updated) {
                console.log("Word cloud chart updated with new data");
            } else {
                console.log("Word cloud data unchanged - skipping update");
            }
            return;
        }

        // Create new chart only if it doesn't exist
        volumeChart = new Chart(volumeChartCanvas, {
            type: "bar",
            data: wordCloudData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false,
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                // Don't show tooltip for "No Data" entries
                                if (
                                    context.raw === 0 &&
                                    context.label === "No Data"
                                ) {
                                    return "";
                                }
                                return `${context.label}: ${context.raw} occurrences`;
                            },
                        },
                        filter: function (tooltipItem) {
                            // Hide tooltip for "No Data" entries
                            return !(
                                tooltipItem.raw === 0 &&
                                tooltipItem.label === "No Data"
                            );
                        },
                    },
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: "rgba(0,0,0,0.1)",
                        },
                        title: {
                            display: true,
                            text: "Word Count",
                            font: {
                                size: 14,
                                weight: "bold",
                            },
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                        ticks: {
                            font: {
                                size: 12,
                            },
                            maxRotation: 45,
                            minRotation: 45,
                            callback: function (value, index, values) {
                                // Hide "No Data" labels
                                const label = this.getLabelForValue(value);
                                return label === "No Data" ? "" : label;
                            },
                        },
                    },
                },
            },
        });
        console.log("New word cloud chart created");
    }

    // Cleanup function for charts
    function cleanup() {
        if (topicChart) {
            topicChart.destroy();
            topicChart = null;
        }
        if (volumeChart) {
            volumeChart.destroy();
            volumeChart = null;
        }
    }

    onMount(() => {
        return cleanup;
    });
</script>

<svelte:head>
    <title>Dashboard - TheUnc Project</title>
    <meta name="description" content="Customer feedback analytics dashboard" />
    <script
        src="https://cdn.jsdelivr.net/npm/chartjs-chart-wordcloud@3.2.0/build/index.umd.min.js"
    ></script>
</svelte:head>

<main class="min-h-screen bg-gray-50 pt-16">
    <!-- Dashboard Header Component -->
    <DashboardHeader
        title="Customer Feedback Dashboard"
        description="Monitor and analyze WhatsApp customer feedback in real-time"
    />

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        <!-- Charts Section -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <!-- Topic Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    Top Topics Summary
                </h3>
                <div class="h-64">
                    <canvas bind:this={topicChartCanvas}></canvas>
                </div>
            </div>

            <!-- Message Volume Chart -->
            <div class="bg-white rounded-lg shadow p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">
                    Top Words
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

        <!-- Recent Messages -->
        <div class="bg-white rounded-lg shadow">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-lg font-semibold text-gray-900">
                    Customer Messages
                </h2>
            </div>
            <div class="divide-y divide-gray-200">
                {#each feedbackData as feedback}
                    {@const styles = getSentimentStyles(feedback.sentiment)}
                    <div class="p-6 hover:bg-gray-50">
                        <div class="flex items-center justify-between">
                            <div class="flex-1">
                                <div class="flex items-center gap-3 mb-2">
                                    <span
                                        class="px-2 py-1 text-xs font-medium rounded-full {styles.pill}"
                                    >
                                        {feedback.sentiment?.toLowerCase()}
                                    </span>
                                    {#each feedback.topics as topic}
                                        <span
                                            class="px-2 py-1 text-xs font-medium rounded-full {styles.pill}"
                                        >
                                            {topic}
                                        </span>
                                    {/each}
                                </div>
                                <div class="flex items-center gap-2 mb-2 mt-4">
                                    <span
                                        class="text-lg text-gray-700 font-semibold"
                                    >
                                        {feedback.product_name}
                                    </span>
                                </div>
                                <p class="text-gray-700 mb-2">
                                    {feedback.feedback_text}
                                </p>
                            </div>
                            {#if feedback.media_urls && feedback.media_urls.length > 0}
                                <div class="ml-4 flex-shrink-0">
                                    <button
                                        class="bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center overflow-hidden hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                                        style="height: 250px; width: 200px"
                                        on:click={() => {
                                            selectedMediaUrl =
                                                feedback.media_urls[0];
                                            showMediaModal = true;
                                        }}
                                    >
                                        <!-- Placeholder image -->
                                        <img
                                            src={feedback.media_urls[0]}
                                            alt={`${feedback.product_name} Media`}
                                            class="w-full h-full object-cover"
                                        />
                                    </button>
                                </div>
                            {/if}
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Load More -->
        <div class="text-center mt-8">
            {#if feedbackData.length < totalMessages}
                <button
                    on:click={() => loadMessages(currentPage + 1)}
                    class="px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                >
                    {#if isLoading}
                        Loading...
                    {:else}
                        Load More Messages
                    {/if}
                </button>
            {/if}
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
                    {colorIndex}
                    on:save={handleTopicSave}
                    on:cancel={handleAddTopicCancel}
                />
            </div>
        {/if}

        <!-- Existing Topics Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {#each topics as topic, index (topic.id)}
                <TopicCard
                    mode="view"
                    {topic}
                    colorIndex={index}
                    on:save={handleTopicSave}
                    on:delete={handleTopicDelete}
                />
            {/each}
        </div>
    </div>
</Modal>

<!-- Media Modal -->
<Modal
    isOpen={showMediaModal}
    title="Media Preview"
    size="xl"
    on:close={() => (showMediaModal = false)}
>
    <div class="relative aspect-video w-full">
        <img
            src={selectedMediaUrl}
            alt="Feedback Media"
            class="w-full h-full object-contain rounded-lg"
        />
    </div>
</Modal>
