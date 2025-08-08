import { API_ENDPOINT } from '$lib/meta';
import { getAuthHeaders, handleApiError } from './auth';

/**
 * Fetches dashboard statistics from the API
 * @returns {Promise<Object>} Object containing message counts and top topics
 * @property {Object} statistics - The statistics object
 * @property {number} statistics.num_messages - Total number of messages
 * @property {number} statistics.num_positive_messages - Number of positive messages
 * @property {number} statistics.num_negative_messages - Number of negative messages
 * @property {number} statistics.num_neutral_messages - Number of neutral messages
 * @property {Array<Object>} statistics.top_topics - Array of top topics with counts
 * @property {string} statistics.top_topics[].topic - Topic name
 * @property {number} statistics.top_topics[].count - Number of messages for this topic
 */
export async function getStatistics() {
    try {
        const response = await fetch(`${API_ENDPOINT}/dashboard/statistics`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const { statistics, success } = await response.json();
        if (!success) {
            throw new Error('API returned unsuccessful response');
        }
        return statistics;
    } catch (error) {
        console.error('Error fetching dashboard statistics:', error);
        throw error;
    }
}

/**
 * Fetches paginated messages from the API
 * @param {Object} options - The options object
 * @param {number} [options.page=0] - Page number (0-based)
 * @param {number} [options.page_size=100] - Number of messages per page
 * @returns {Promise<Object>} Object containing messages and pagination info
 * @property {Array<Object>} messages - Array of message objects
 * @property {string} messages[].sentiment - Message sentiment (Positive/Negative/Neutral)
 * @property {Array<string>} messages[].topics - Array of topics associated with the message
 * @property {number} messages[].feedback_id - Unique identifier for the feedback
 * @property {string} messages[].product_name - Name of the product
 * @property {string} messages[].feedback_text - The actual feedback message
 * @property {Array<string>} messages[].media_urls - Array of media URLs associated with the message
 * @property {number} total - Total number of messages available
 * @property {number} page - Current page number
 * @property {number} page_size - Number of messages per page
 * @property {boolean} success - Whether the API call was successful
 */
export async function getMessages({ page = 0, page_size = 100 } = {}) {
    try {
        const response = await fetch(`${API_ENDPOINT}/dashboard/messages?page=${page}&page_size=${page_size}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error('API returned unsuccessful response');
        }

        if (data.messages) {
            data.messages = data.messages.sort(
                (a, b) => b.feedback_id - a.feedback_id,
            );
        }
        return data;
    } catch (error) {
        console.error('Error fetching messages:', error);
        throw error;
    }
}

/**
 * Fetches word frequency analysis for feedback messages
 * @returns {Promise<Object>} Object containing word frequency data
 * @property {Array<Object>} words - Array of word frequency objects
 * @property {string} words[].word - The word
 * @property {number} words[].count - Number of occurrences
 * @property {boolean} success - Whether the API call was successful
 */
export async function getWordCloudStats() {
    try {
        const response = await fetch(`${API_ENDPOINT}/dashboard/wordcount-analysis`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        });

        if (!response.ok) {
            await handleApiError(response);
        }

        const data = await response.json();
        if (!data.success) {
            throw new Error('API returned unsuccessful response');
        }

        return data;
    } catch (error) {
        console.error('Error fetching word cloud stats:', error);
        throw error;
    }
}