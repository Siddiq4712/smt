// backend/utils/ollamaClient.js
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_MODEL_NAME = process.env.OLLAMA_MODEL_NAME || 'mistral';

const ollamaAxios = axios.create({
    baseURL: OLLAMA_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Generates text using the configured Ollama model.
 * @param {string} prompt The prompt to send to the LLM.
 * @returns {Promise<string>} The generated text response.
 * @throws {Error} If the Ollama API call fails.
 */
export const generateTextWithOllama = async (prompt) => {
    try {
        const response = await ollamaAxios.post('/api/generate', {
            model: OLLAMA_MODEL_NAME,
            prompt: prompt,
            stream: false, // We want the full response at once
        });

        // The response structure might vary slightly, typically it's in response.data.response
        return response.data.response;
    } catch (error) {
        console.error('Error calling Ollama API:', error.message);
        if (error.response) {
            console.error('Ollama Response Status:', error.response.status);
            console.error('Ollama Response Data:', error.response.data);
        }
        throw new Error('Failed to get response from Ollama. Is Ollama running?');
    }
};
