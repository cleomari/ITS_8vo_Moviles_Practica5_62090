import AsyncStorage from '@react-native-async-storage/async-storage';
// app/services/api.ts
//const API_BASE_URL = 'https://her-rhode-launch-grants.trycloudflare.com/api';
 const API_BASE_URL = 'https://sin-ia-blog-ppc.trycloudflare.com/api';    

interface Tarea {
  id: number;
  titulo: string;
  descripcion: string;
  completada: boolean;
}

const getAuthHeader = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export const api = {
  getTareas: async (): Promise<Tarea[]> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/tareas`, { headers });
      if (!response.ok) throw new Error('Error fetching tareas');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tareas:', error);
      throw error;
    }
  },

  getTarea: async (id: number): Promise<Tarea> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, { headers });
      if (!response.ok) throw new Error(`Error fetching tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error fetching tarea ${id}:`, error);
      throw error;
    }
  },

  createTarea: async (tarea: Omit<Tarea, 'id'>): Promise<Tarea> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/tareas`, {
        method: 'POST',
        headers,
        body: JSON.stringify(tarea),
      });
      if (!response.ok) throw new Error('Error creating tarea');
      return await response.json();
    } catch (error) {
      console.error('Error creating tarea:', error);
      throw error;
    }
  },

  updateTarea: async (id: number, tarea: Partial<Tarea>): Promise<Tarea> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(tarea),
      });
      if (!response.ok) throw new Error(`Error updating tarea ${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Error updating tarea ${id}:`, error);
      throw error;
    }
  },

  deleteTarea: async (id: number): Promise<void> => {
    try {
      const headers = await getAuthHeader();
      const response = await fetch(`${API_BASE_URL}/tareas/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!response.ok) throw new Error(`Error deleting tarea ${id}`);
    } catch (error) {
      console.error(`Error deleting tarea ${id}:`, error);
      throw error;
    }
  },

  login: async (username: string, password: string): Promise<{ token: string }> => {
    try {
      //console.log('[LOGIN] Enviando a backend:', { username, password });
  
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      //console.log('[LOGIN] Respuesta del backend:', data);
  
      if (!response.ok) throw new Error(data.message || 'Login fallido');
  
      await AsyncStorage.setItem('token', data.token);
      return data;
    } catch (error) {
      console.error('[LOGIN ERROR]', error);
      throw error;
    }
  },
  
  register: async (username: string, password: string): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) throw new Error('Registro fallido');
      return await response.json();
    } catch (error) {
      console.error('Error en register:', error);
      throw error;
    }
  },
};