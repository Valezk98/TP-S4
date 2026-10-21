import { createContext, useState, useEffect } from 'react';
import { fetchData } from '../API/APIcon';
import useLocalStorage from '../hooks/useLocalStorage';

// Precios redondos entre 10.000 y 60.000 pesos ARS
const generarPrecio = (id) => {
  const base = ((id * 37 + 17) % 51); // 0 a 50
  return (10 + base) * 1000;
};

// Stock disponible para tienda (3 a 12 unidades)
const generarStock = (id) => {
  return ((id * 13 + 7) % 10) + 3;
};

// eslint-disable-next-line react-refresh/only-export-components
export const GamesContext = createContext();

export const GamesProvider = ({ children }) => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para la búsqueda global (evita prop drilling)
  const [activeSearch, setActiveSearch] = useState('');

  // Estado para el filtro y ordenamiento de juegos
  const [filtroOrden, setFiltroOrden] = useState('');

  // Lista de IDs favoritos guardada en localStorage
  const [favoritos, setFavoritos] = useLocalStorage('GLITCH_CORE:favoritos', []);

  const toggleFavorito = (id) => {
    setFavoritos((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const isFavorito = (id) => favoritos.includes(id);

  useEffect(() => {
    const getGames = async () => {
      try {
        const data = await fetchData();
        const gamesConTienda = data.map((game) => ({
          ...game,
          precio: generarPrecio(game.id),
          stock: generarStock(game.id),
        }));
        setGames(gamesConTienda);
      } catch {
        setError('Error al cargar el catálogo de juegos.');
      } finally {
        setLoading(false);
      }
    };
    getGames();
  }, []);

  return (
    <GamesContext.Provider
      value={{
        games,
        loading,
        error,
        activeSearch,
        setActiveSearch,
        activeSearchQuery: activeSearch,
        setActiveSearchQuery: setActiveSearch,
        filtroOrden,
        setFiltroOrden,
        favoritos,
        toggleFavorito,
        isFavorito,
      }}
    >
      {children}
    </GamesContext.Provider>
  );
};
