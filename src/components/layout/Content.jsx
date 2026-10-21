import { useState, useEffect, useRef, useContext } from 'react';
import { GamesContext } from '../../context/GamesContext';
import Card from '../Card';
import Filtros from '../Filtros';
import Paginacion from '../Paginacion';

const ITEMS_POR_PAGINA = 12;

// Para leer el parametro 'page' desde la URL
const getPageFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  const p = parseInt(params.get('page'), 10);
  return !isNaN(p) && p > 0 ? p : 1;
};

export default function Content() {
  const { games, loading, error, activeSearchQuery, setActiveSearchQuery, filtroOrden, favoritos } = useContext(GamesContext);
  const [showGames, setShowGames] = useState(true);
  const [page, setPage] = useState(getPageFromURL);
  const isFirstMount = useRef(true);
  const hasUserChangedFilters = useRef(false);
  const initialSearchRef = useRef(activeSearchQuery);
  const initialFilterRef = useRef(filtroOrden);

  // Escuchar navegación del navegador (adelante y atrás)
  useEffect(() => {
    const handlePopState = () => {
      setPage(getPageFromURL());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // 1. Filtrado por búsqueda
  let result = activeSearchQuery 
    ? games.filter(game => game.title.toLowerCase().includes(activeSearchQuery.toLowerCase()))
    : [...games];

  // 2. Ordenamiento o filtrado según la opción seleccionada
  if (filtroOrden === 'favoritos') {
    result = result.filter(game => favoritos.includes(game.id));
  } else if (filtroOrden === 'recientes') {
    result.sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0));
  } else if (filtroOrden === 'antiguos') {
    result.sort((a, b) => new Date(a.release_date || 0) - new Date(b.release_date || 0));
  } else if (filtroOrden === 'mayor-precio') {
    result.sort((a, b) => (b.precio || 0) - (a.precio || 0));
  } else if (filtroOrden === 'menor-precio') {
    result.sort((a, b) => (a.precio || 0) - (a.precio || 0));
  }

  // 3. Cálculos de paginación
  const totalPaginas = Math.max(1, Math.ceil(result.length / ITEMS_POR_PAGINA));
  const paginaActual = loading ? page : Math.min(Math.max(1, page), totalPaginas);

  // Detectar si el usuario cambió búsqueda/filtro después de la carga inicial
  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      initialSearchRef.current = activeSearchQuery;
      initialFilterRef.current = filtroOrden;
      return;
    }
    if (initialSearchRef.current !== activeSearchQuery || initialFilterRef.current !== filtroOrden) {
      hasUserChangedFilters.current = true;
      initialSearchRef.current = activeSearchQuery;
      initialFilterRef.current = filtroOrden;
    }
  }, [activeSearchQuery, filtroOrden]);

  // Solo si el usuario cambia la búsqueda o el filtro, volver a la página 1
  useEffect(() => {
    if (!hasUserChangedFilters.current) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') && params.get('page') !== '1') {
      params.set('page', '1');
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }
    setPage(1);
    hasUserChangedFilters.current = false;
  }, [activeSearchQuery, filtroOrden]);

  // Sincronizar página si queda fuera de rango tras cargar datos
  useEffect(() => {
    if (loading) return;
    const safePage = Math.min(Math.max(1, page), totalPaginas);
    if (safePage !== page) {
      setPage(safePage);
      const params = new URLSearchParams(window.location.search);
      params.set('page', safePage.toString());
      window.history.replaceState(null, '', `${window.location.pathname}?${params.toString()}`);
    }
  }, [loading, totalPaginas]); // eslint-disable-line react-hooks/exhaustive-deps

  // Actualizar página con URLSearchParams y scroll suave
  const cambiarPagina = (nuevaPagina) => {
    const p = Math.max(1, Math.min(nuevaPagina, totalPaginas));
    setPage(p);

    const params = new URLSearchParams(window.location.search);
    params.set('page', p);
    window.history.pushState(null, '', `${window.location.pathname}?${params.toString()}`);

    const catalogEl = document.getElementById('catalog');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const indiceInicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
  const displayedGames = result.slice(indiceInicio, indiceInicio + ITEMS_POR_PAGINA);

  return (
    <main className="w-full max-w-360 mx-auto px-margin-mobile md:px-margin-desktop py-xl min-h-auto" id="catalog">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-lg gap-4">
        <div>
          <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
            {activeSearchQuery ? `Resultados para "${activeSearchQuery}"` : "Catálogo"}
          </h2>
          <p className="text-on-surface-variant font-body-md mt-sm">
            {activeSearchQuery
              ? `Se encontraron ${result.length} juegos.`
              : `Explora la colección (${result.length} juegos en total).`}
          </p>
          
          <div className="flex gap-4 items-center mt-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer text-on-surface text-sm">
              <input 
                id="checkb" 
                type="checkbox" 
                checked={showGames}
                onChange={(e) => setShowGames(e.target.checked)}
                className="accent-primary w-4 h-4 cursor-pointer"
              /> 
              Mostrar/Ocultar juegos
            </label>

            {activeSearchQuery && (
              <button 
                onClick={() => setActiveSearchQuery('')}
                className="text-primary hover:text-on-surface transition-colors font-bold text-sm border border-primary/30 px-3 py-1 rounded-full cursor-pointer"
              >
                Volver al inicio
              </button>
            )}
          </div>
        </div>

        {/* Componente Filtro */}
        <Filtros />
      </div>
        
      {showGames && (
        <>
          <div id="cards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter transition-all">
            {loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-xl">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"></div>
                <p className="text-primary font-bold animate-pulse font-label-sm tracking-widest">CARGANDO BASE DE DATOS...</p>
              </div>
            )}
            
            {error && (
              <div className="col-span-full text-center py-xl bg-error-container/20 rounded-xl border border-error/50">
                <p className="text-error font-bold">{error}</p>
              </div>
            )}
            
            {!loading && !error && displayedGames.length === 0 && (
              <div className="col-span-full text-center py-xl">
                <p className="text-on-surface-variant font-bold text-lg">
                  {filtroOrden === 'favoritos'
                    ? 'Aún no tienes juegos marcados como favoritos. Haz clic en la estrellita ⭐ de cualquier tarjeta para agregarlo.'
                    : 'No se encontraron juegos para tu búsqueda.'}
                </p>
              </div>
            )}

            {!loading && !error && displayedGames.map((game) => (
              <Card key={game.id} game={game} />
            ))}
          </div>

          {/* Componente de Paginación */}
          {!loading && !error && (
            <Paginacion
              paginaActual={paginaActual}
              totalPaginas={totalPaginas}
              onCambiarPagina={cambiarPagina}
            />
          )}
        </>
      )}
    </main>
  );
}