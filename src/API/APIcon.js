import axios from 'axios';

export const fetchData = async () => {
  // En producción con Netlify usamos la función serverless. En desarrollo usamos la URL directa o la variable de entorno.
  const apiUrl = import.meta.env.DEV
    ? (import.meta.env.VITE_API_URL || 'https://www.freetogame.com/api/games')
    : '/.netlify/functions/games';

  const response = await axios.get(apiUrl);

  if (Array.isArray(response.data)) {
    // Retornamos todos los juegos para que la búsqueda global funcione. 
    // La paginación o límite de vista se manejará en el componente Content.
    return response.data;
  } else {
    throw new Error('La API no devolvió datos válidos.');
  }
};

