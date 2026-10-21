import { useContext } from 'react';
import { GamesContext } from '../context/GamesContext';

export default function useGamesContext() {
  const context = useContext(GamesContext);
  if (!context) throw new Error('useGamesContext debe ser utilizado dentro de un GamesProvider');
  return context;
}