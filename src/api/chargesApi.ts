import axios, { AxiosResponse } from 'axios';
import { Charge } from "../interfaces/Charge";

// URL base para a API (pode ser configurada com variáveis de ambiente)
const API_URL = 'http://localhost:3000/api';

// Função para criar uma nova sessão de recarga
export const createCharge = async (
  chargeData: Omit<Charge, 'id' | 'progress' | 'startedAt' | 'endedAt'>,
  token: string // Token JWT
): Promise<AxiosResponse> => {
  try {
    const response = await axios.post(
      `${API_URL}/charges`,
      chargeData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response; // Retorna a sessão de recarga criada
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao criar a sessão de recarga';
    throw new Error(errorMessage);
  }
};

// Função para atualizar o progresso de uma sessão de recarga
export const updateChargeProgress = async (
  chargeId: number,
  progress: number,
  token: string // Token JWT
): Promise<AxiosResponse> => {
  try {
    const response = await axios.put(
      `${API_URL}/charges/${chargeId}/progress`,
      { progress },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response; // Retorna a sessão de recarga atualizada
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao atualizar o progresso da sessão de recarga';
    throw new Error(errorMessage);
  }
};

// Função para obter todas as sessões de recarga de um usuário específico
export const getChargesByUserId = async (
  userId: number,
  token: string // Token JWT
): Promise<AxiosResponse> => {
  try {
    const response = await axios.get(
      `${API_URL}/users/${userId}/charges`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response; // Retorna a lista de sessões de recarga
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao obter as sessões de recarga do usuário';
    throw new Error(errorMessage);
  }
};