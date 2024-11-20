import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth';

export const login = async (username: string, password: string): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    return response.data.token; // Retorna o token JWT
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || 'Erro ao realizar login';
    throw new Error(errorMessage);
  }
};

// Função para buscar o ID do usuário pelo username
export const getUserIdByUsername = async (username: string): Promise<number> => {
  try {
    // Faz a requisição GET para o endpoint /user/:username
    const response = await axios.get(`${API_URL}/users/name/${username}`);
    return response.data.id; // Retorna o ID do usuário
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || 'Erro ao buscar o ID do usuário';
    throw new Error(errorMessage);
  }
};