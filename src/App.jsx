import { Routes, Route } from 'react-router-dom'
import { useState, useEffect, Suspense, lazy } from 'react'

import Header from './components/Header'
import Footer from './components/Footer'
import FormModal from './components/FormModal'
import { heritageAPI, transformCoordinates } from './lib/supabase'

const MapView = lazy(() => import('./components/MapView'))
const DetailView = lazy(() => import('./components/DetailView'))
const GalleryView = lazy(() => import('./components/GalleryView'))
const AboutView = lazy(() => import('./components/AboutView'))
const AdminPanel = lazy(() => import('./components/AdminPanel'))
const AdminLogin = lazy(() => import('./components/AdminLogin'))
const NotFound = lazy(() => import('./components/NotFound'))

// Двомовні мок-дані для тестування
const getMockData = () => [
  {
    id: '1', title: 'Будинок культури, Ірпінь', title_en: 'House of Culture, Irpin',
    coordinates: { lat: 50.518, lng: 30.222 },
    region: 'Київська область', region_en: 'Kyiv Oblast',
    city_or_settlement: 'Ірпінь', city_or_settlement_en: 'Irpin',
    category: 'culture_house', damage_level: 'destroyed', damage_date: '2022-03-01',
    description: "Знакова будівля міста, повністю зруйнована прямим влучанням ракети.",
    description_en: "A landmark building of the city, completely destroyed by a direct missile hit.",
    photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=BEFORE',
    photo_after_url: 'https://placehold.co/600x400/e53e3e/ffffff?text=AFTER',
    source_url: 'https://mkip.gov.ua', is_verified: true, created_at: '2023-01-01T10:00:00Z'
  },
  {
    id: '2', title: 'Музей Сковороди', title_en: 'Skovoroda Museum',
    coordinates: { lat: 49.95, lng: 35.533 },
    region: 'Харківська область', region_en: 'Kharkiv Oblast',
    city_or_settlement: 'Сковородинівка', city_or_settlement_en: 'Skovorodynivka',
    category: 'museum', damage_level: 'heavy', damage_date: '2022-05-01',
    description: 'Національний музей. Зруйнований ракетним ударом.',
    description_en: 'National museum. Destroyed by a missile strike.',
    photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=BEFORE',
    photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=AFTER',
    source_url: 'https://unesco.org', is_verified: true, created_at: '2023-02-15T11:00:00Z'
  }
]

const PageLoader = () => (
  <div className="flex-grow flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-ukr-blue border-t-transparent"></div>
    </div>
  </div>
)

function App() {
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)

  useEffect(() => { loadObjects() }, [])

  const loadObjects = async () => {
    try {
      setLoading(true)
      const data = await heritageAPI.getAllObjects()
      setObjects(data)
    } catch (error) {
      console.warn('Supabase не підключено, використовуються мок-дані', error)
      setObjects(getMockData().map(transformCoordinates))
    } finally {
      setLoading(false)
    }
  }

  const addNewObject = async (objectData) => {
    try {
      const res = await heritageAPI.addObject({ ...objectData, is_verified: false })
      if (res.success) { await loadObjects(); return { success: true } }
      return { success: false, message: 'Error' }
    } catch (err) { return { success: false, message: err.message } }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onOpenForm={() => setIsFormModalOpen(true)} />
      <main className="flex-grow flex flex-col">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<MapView objects={objects} loading={loading} onRefresh={loadObjects} isFormModalOpen={isFormModalOpen} />} />
            <Route path="/object/:id" element={<DetailView objects={objects} />} />
            <Route path="/gallery" element={<GalleryView objects={objects} loading={loading} />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <FormModal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSubmit={addNewObject} />
      <Footer />
    </div>
  )
}
export default App