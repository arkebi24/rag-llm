import axios from 'axios';

const API_URL = 'http://localhost:3000/api/rag-llm';

export const processRagLlm = async (message: string) => {
  try {
    const response = await axios.post(API_URL, {
      message,
      textChunkSize: 200,
      textChunkOverlap: 20,
      returnLLMResults: true,
      returnSimilaritySearchResults: true,
      numberOfSimilarityResults: 2,
      numberOfPagesToScan: 4,
    });
    return response.data;
  } catch (error) {
    console.error('Error processing RAG LLM:', error);
    throw error;
  }
};