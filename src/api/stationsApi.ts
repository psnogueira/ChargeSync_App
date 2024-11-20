import axios, { AxiosResponse } from 'axios';
import { Station } from '../interfaces/Station';

// URL base da API
const API_BASE_URL = 'http://localhost:3000/api';

// Função para buscar todas as estações
export const getAllStations = async (token: string): Promise<AxiosResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Retorna a resposta completa, não apenas os dados
    return response;
  } catch (error) {
    console.error('Erro ao buscar estações:', error);
    throw error; // Repassa o erro para ser tratado no componente que chamou essa função
  }
};

// Função para buscar uma estação pelo ID
export const getStationById = async (id: number, token: string): Promise<Station> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/stations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Retorna uma única estação
  } catch (error) {
    console.error(`Erro ao buscar estação com ID ${id}:`, error);
    throw error;
  }
};

// Função para criar uma nova estação
export const createStation = async (stationData: Omit<Station, 'id'>, token: string): Promise<Station> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/stations`, stationData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Retorna a estação criada
  } catch (error) {
    console.error('Erro ao criar nova estação:', error);
    throw error;
  }
};

// Função para atualizar uma estação existente
export const updateStation = async (id: number, stationData: Partial<Station>, token: string): Promise<Station> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/stations/${id}`, stationData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Retorna a estação atualizada
  } catch (error) {
    console.error(`Erro ao atualizar estação com ID ${id}:`, error);
    throw error;
  }
};

// Função para atualizar a disponibilidade de uma estação
export const updateStationAvailability = async (stationId: number, available: boolean, token: string): Promise<Station> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/stations/${stationId}/available`, { available }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Retorna a estação com a nova disponibilidade
  } catch (error) {
    console.error(`Erro ao atualizar disponibilidade da estação com ID ${stationId}:`, error);
    throw error;
  }
};

// Função para deletar uma estação
export const deleteStation = async (id: number, token: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/stations/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Erro ao deletar estação com ID ${id}:`, error);
    throw error;
  }
};