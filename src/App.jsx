import { useContext } from 'react'
import { GamesContext } from './context/GamesContext'
import Navbar from './components/layout/Navbar'
import Hero from './components/layout/Hero'
import Plataformas from './components/Plataformas'
import FeatureSection from './components/FeatureSection'
import Content from './components/layout/Content'
import StatsBar from './components/StatsBar'
import Reseñas from './components/Reseñas'
import Newsletter from './components/Newsletter'
import Footer from './components/layout/Footer'
import Checkout from './components/views/Checkout'
import CarritoModal from './components/views/CarritoModal'

export default function App() {
  const { activeSearch } = useContext(GamesContext);

  return (
    <>
      <Navbar/>
      
      {!activeSearch ? (
        // Vista normal (Inicio)
        <>
          <Hero/>
          <FeatureSection/>
          <Content/>
          <Plataformas/>
          <StatsBar/>
          <Reseñas/>
          <Newsletter/>
        </>
      ) : (
        // Vista de búsqueda sencilla (sólo Navbar, Contenido y Footer)
        <div className="pt-24 min-h-[80vh]">
          <Content/>
        </div>
      )}
      
      {/* Modales globales de la Store */}
      <Checkout />
      <CarritoModal />

      <Footer/>
    </>
  )
}