import axios from 'axios';

export const fetchData = async () => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error('Falta la variable de entorno VITE_API_URL');
  }

  const response = await axios.get(apiUrl);

  if (Array.isArray(response.data)) {
    // Retornamos todos los juegos para que la búsqueda global funcione. 
    // La paginación o límite de vista se manejará en el componente Content.
    return response.data;
  } else {
    throw new Error('La API no devolvió datos válidos.');
  }
};

