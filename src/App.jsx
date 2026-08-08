import { useState, useEffect } from 'react'
import Layout from './components/Layout'
import { GridScan } from './components/ui/GridScan/GridScan'
import './components/ui/GridScan/GridScan.css'
import Home from './pages/Home'
import Study from './pages/Study'
import Stats from './pages/Stats'

export default function App() {
  const [currentPage, setCurrentPage] = useState('home')

  useEffect(() => {
    // 背景图路径带 BASE_URL，适配 GitHub Pages 子路径部署
    document.body.style.backgroundImage = `url(${import.meta.env.BASE_URL}ims.webp)`
    document.body.style.backgroundSize = '100% auto'
    document.body.style.backgroundPosition = 'center top'
    document.body.style.backgroundRepeat = 'no-repeat'
    document.body.style.backgroundAttachment = 'scroll'
  }, [])

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <GridScan
          sensitivity={0.3}
          lineThickness={0.5}
          linesColor="#5a2a3a"
          scanColor="#d05050"
          scanOpacity={0.35}
          gridScale={0.12}
          lineStyle="solid"
          lineJitter={0.05}
          scanDirection="pingpong"
          noiseIntensity={0.005}
          scanGlow={0.3}
          scanSoftness={3}
          scanDuration={5}
          scanDelay={4}
          scanOnClick={false}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage} hideNav={currentPage === 'home'}>
        {currentPage === 'home' && (
          <Home onStart={() => setCurrentPage('study')} />
        )}
        {currentPage === 'study' && (
          <Study
            onComplete={() => setCurrentPage('home')}
            onBack={() => setCurrentPage('home')}
          />
        )}
        {currentPage === 'stats' && <Stats />}
      </Layout>
    </>
  )
}
