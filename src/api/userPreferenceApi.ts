import axios, { AxiosResponse } from 'axios';
import { UserPreference } from "../interfaces/UserPreference"

// URL base para a API (pode ser configurada com variáveis de ambiente)
const API_URL = 'http://localhost:3000/api';

// Função para obter todas as preferências de um usuário específico
export const getUserPreferences = async (userId: number, token: string): Promise<AxiosResponse> => {
  try {
    const response = await axios.get(`${API_URL}/users/${userId}/preferences`, {
      headers: {
        Authorization: `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
      },
    });

    // Retorna a resposta completa, não apenas os dados
    return response;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao buscar as preferências do usuário';
    throw new Error(errorMessage);
  }
};

// Função para criar uma nova preferência de usuário
export const createUserPreferences = async (
  userId: number,
  preferences: Omit<UserPreference, 'id' | 'userId'>
): Promise<UserPreference> => {
  try {
    const response = await axios.post(
      `${API_URL}/users/${userId}/preferences`,
      preferences
    );
    return response.data; // Retorna a preferência criada
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao criar a preferência do usuário';
    throw new Error(errorMessage);
  }
};

// Função para atualizar uma preferência de usuário com base no ID da preferência
export const updateUserPreferenceById = async (
  id: number,
  updatedPreferences: Partial<Omit<UserPreference, 'id' | 'userId'>>,
  token: string
): Promise<AxiosResponse> => {
  try {
    const response = await axios.put(
      `${API_URL}/preferences/${id}`,
      updatedPreferences,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Adiciona o token JWT no cabeçalho
        },
      }
    );
    return response; // Retorna a preferência atualizada
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao atualizar a preferência do usuário';
    throw new Error(errorMessage);
  }
};