import axios from 'axios';

// Get API URL based on environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Card {
  id: string;
  text: string;
  audioUrl: string;
  createdAt: string;
  updatedAt?: string;
}

export const api = {
  async getCards(): Promise<Card[]> {
    try {
      const response = await axios.get(`${API_URL}/cards`);
      return response.data;
    } catch (error) {
      console.error('Error fetching cards:', error);
      throw error;
    }
  },

  async createCard(text: string, audioBlob: Blob): Promise<Card> {
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('audio', audioBlob, 'audio.webm');

      const response = await axios.post(`${API_URL}/cards`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating card:', error);
      throw error;
    }
  },

  async updateCard(id: string, text: string, audioBlob?: Blob): Promise<Card> {
    try {
      const formData = new FormData();
      formData.append('text', text);
      if (audioBlob) {
        formData.append('audio', audioBlob, 'audio.webm');
      }

      const response = await axios.put(`${API_URL}/cards/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating card:', error);
      throw error;
    }
  },

  async deleteCard(id: string): Promise<void> {
    try {
      await axios.delete(`${API_URL}/cards/${id}`);
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  },
};