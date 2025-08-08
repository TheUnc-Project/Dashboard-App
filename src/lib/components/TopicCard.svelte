<script>
    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();
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

    export let mode = "add"; // 'add', 'edit', 'view'
    export let topic = {
        id: null,
        label: "",
        description: "",
    };
    export let colorIndex = 0;

    let isEditing = mode === "add" || mode === "edit";
    let formData = { ...topic };
    let showDeleteConfirm = false;

    // Get a color based on the topic's position
    function getTopicColor(index) {
        return colors[index % colors.length];
    }

    // Safely capitalize the first letter of a string
    function capitalizeLabel(label) {
        if (!label) return "";
        return label.charAt(0).toUpperCase() + label.slice(1);
    }

    function handleSave() {
        if (!formData.label.trim()) {
            alert("Topic label is required");
            return;
        }

        // For new topics, assign a color based on position
        if (mode === "add") {
            formData.color = getTopicColor(colorIndex);
            colorIndex++;
        }

        dispatch("save", formData);

        if (mode === "add") {
            // Reset form for adding new topic
            formData = {
                id: null,
                label: "",
                description: "",
            };
        } else {
            isEditing = false;
        }
    }

    function handleCancel() {
        formData = { ...topic };
        isEditing = false;
        if (mode === "add") {
            dispatch("cancel");
        }
    }

    function handleEdit() {
        isEditing = true;
    }

    function handleDelete() {
        showDeleteConfirm = true;
    }

    function confirmDelete() {
        dispatch("delete", topic.id);
        showDeleteConfirm = false;
    }

    function cancelDelete() {
        showDeleteConfirm = false;
    }
</script>

<div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    {#if mode === "add"}
        <div class="flex items-center mb-4">
            <div class="p-2 bg-green-100 rounded-lg mr-3">
                <svg
                    class="w-6 h-6 text-green-600"
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
            </div>
            <h3 class="text-lg font-semibold text-gray-900">Add New Topic</h3>
        </div>
    {:else}
        <div class="flex items-center justify-between mb-4">
            <div class="flex items-center">
                <div
                    class="w-4 h-4 rounded-full mr-3"
                    style="background-color: {getTopicColor(colorIndex)}"
                ></div>
                <h3 class="text-lg font-semibold text-gray-900">
                    {capitalizeLabel(topic.label)}
                </h3>
            </div>

            {#if !isEditing}
                <div class="flex gap-2">
                    <button
                        on:click={handleDelete}
                        class="p-2 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        title="Delete topic"
                        aria-label="Delete topic"
                    >
                        <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </div>
            {/if}
        </div>
    {/if}

    {#if isEditing}
        <form on:submit|preventDefault={handleSave} class="space-y-4">
            <!-- Topic Label -->
            <div>
                <label
                    for="topic-label"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Topic Name *
                </label>
                <input
                    id="topic-label"
                    type="text"
                    bind:value={formData.label}
                    placeholder="e.g., Product Quality, Delivery Issues"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                />
            </div>

            <!-- Description -->
            <div>
                <label
                    for="topic-description"
                    class="block text-sm font-medium text-gray-700 mb-1"
                >
                    Description
                </label>
                <textarea
                    id="topic-description"
                    bind:value={formData.description}
                    placeholder="Describe when this topic should be applied..."
                    rows="3"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                ></textarea>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-3 pt-4">
                <button
                    type="submit"
                    class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm font-medium"
                >
                    {mode === "add" ? "Add Topic" : "Save Changes"}
                </button>
                <button
                    type="button"
                    on:click={handleCancel}
                    class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm font-medium"
                >
                    Cancel
                </button>
            </div>
        </form>
    {:else if mode !== "add"}
        <!-- View Mode -->
        <div class="space-y-3">
            {#if topic.description}
                <p class="text-gray-600 text-sm">{topic.description}</p>
            {/if}
        </div>
    {/if}
</div>

{#if showDeleteConfirm}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
                Delete Topic
            </h3>
            <p class="text-gray-600 mb-6">
                Are you sure you want to delete the topic "{capitalizeLabel(
                    topic.label,
                )}"? This action cannot be undone.
            </p>
            <div class="flex justify-end gap-3">
                <button
                    on:click={cancelDelete}
                    class="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                    Cancel
                </button>
                <button
                    on:click={confirmDelete}
                    class="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
{/if}
