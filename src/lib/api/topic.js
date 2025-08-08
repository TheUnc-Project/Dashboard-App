import { API_ENDPOINT } from '$lib/meta';
import { getAuthHeaders, handleApiError } from './auth';

/**
 * Fetches all topics from the API
 * @returns {Promise<Array>} Array of topic objects
 */
export async function getAllTopics() {
    try {
        const response = await fetch(`${API_ENDPOINT}/topic/all`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const { topics, success } = await response.json();
        if (!success) {
            throw new Error('API returned unsuccessful response');
        }
        return topics;
    } catch (error) {
        console.error('Error fetching topics:', error);
        throw error;
    }
}

/**
 * Creates a new topic
 * @param {Object} topicData - The topic data to create
 * @param {string} topicData.label - The label of the topic
 * @param {string} topicData.description - The description of the topic
 * @returns {Promise<Object>} The created topic object
 */
/**
 * Deletes a topic by ID
 * @param {number} topicId - The ID of the topic to delete
 * @returns {Promise<boolean>} True if deletion was successful
 */
export async function deleteTopic(topicId) {
    try {
        const response = await fetch(`${API_ENDPOINT}/topic/${topicId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const { success } = await response.json();
        if (!success) {
            throw new Error('API returned unsuccessful response');
        }
        return true;
    } catch (error) {
        console.error('Error deleting topic:', error);
        throw error;
    }
}

export async function createTopic(topicData) {
    try {
        const response = await fetch(`${API_ENDPOINT}/topic/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            },
            body: JSON.stringify(topicData)
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const { success, topic } = await response.json();
        if (!success) {
            throw new Error('API returned unsuccessful response');
        }
        return topic;
    } catch (error) {
        console.error('Error creating topic:', error);
        throw error;
    }
}