// src/components/DetailView.jsx
import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { heritageAPI } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '../hooks/useLocalizedData'

const DetailView = ({ objects }) => {
  const { id } = useParams()
  const [object, setObject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalImage, setModalImage] = useState(null)

  // Підключення i18n та хука для бази даних
  const { t, i18n } = useTranslation()
  const { getField, getCategoryText, getDamageText } = useLocalizedData()

  useEffect(() => {
    const loadObject = async () => {
      try {
        setLoading(true)
        const existingObject = objects.find(obj => obj.id === id)
        if (existingObject) {
          setObject(existingObject)
        } else {
          const data = await heritageAPI.getObjectById(id)
          setObject(data)
        }
      } catch (error) {
        console.error('Помилка завантаження обʼєкта:', error)
      } finally {
        setLoading(false)
      }
    }
    if (id) loadObject()
  }, [id, objects])

  const getDamageColor = (damage) => {
    const colors = { 'destroyed': '#ef4444', 'heavy': '#eab308', 'partial': '#3b82f6' }
    return colors[damage] || '#94a3b8'
  }

  if (loading) return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ukr-blue"></div></div>
  if (!object) return <div className="text-center p-10 text-red-500 font-medium">{t('detail.not_found', "Об'єкт не знайдено.")}</div>

  const hasCoordinates = object.coordinates && object.coordinates.lat !== undefined && object.coordinates.lng !== undefined

  // Визначення локалі для форматування дати
  const locale = i18n.language.startsWith('en') ? 'en-US' : 'uk-UA'

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-ukr-blue mb-6 font-medium transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        {t('detail.back', 'Повернутися')}
      </Link>

      <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 overflow-hidden relative">
        {/* Кольорова лінія статусу */}
        <div className="h-2 w-full" style={{ backgroundColor: getDamageColor(object.damage_level) }}></div>

        <div className="p-8 md:p-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-6 mb-10 gap-4">
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">
                {getField(object, 'city_or_settlement')}, {getField(object, 'region')}
              </p>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                {getField(object, 'title')}
              </h1>
            </div>
            <span className="text-sm font-bold px-5 py-2.5 rounded-xl shrink-0" style={{
              backgroundColor: `${getDamageColor(object.damage_level)}15`,
              color: getDamageColor(object.damage_level),
            }}>
              {getDamageText(object.damage_level)}
            </span>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mb-12">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span> {t('detail.before', 'До руйнування')}
              </h3>
              <div className="relative overflow-hidden rounded-3xl shadow-sm cursor-pointer group aspect-[4/3]"
                   onClick={() => setModalImage(object.photo_before_url || 'https://placehold.co/1200x800/e2e8f0/94a3b8?text=Немає+фото')}>
                <img src={object.photo_before_url || 'https://placehold.co/1200x800/e2e8f0/94a3b8?text=Немає+фото'} alt="До" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition font-medium px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg">Збільшити</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold text-red-600 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> {t('detail.after', 'Після руйнування')}
              </h3>
              <div className="relative overflow-hidden rounded-3xl shadow-sm cursor-pointer group aspect-[4/3] ring-1 ring-red-100"
                   onClick={() => setModalImage(object.photo_after_url || 'https://placehold.co/1200x800/fee2e2/ef4444?text=Немає+фото')}>
                <img src={object.photo_after_url || 'https://placehold.co/1200x800/fee2e2/ef4444?text=Немає+фото'} alt="Після" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition font-medium px-4 py-2 bg-black/40 backdrop-blur-md rounded-lg">Збільшити</span>
                </div>
              </div>
              {object.damage_date && (
                <p className="text-sm text-slate-500 text-center font-medium">
                  {t('detail.date', 'Дата фіксації:')} {new Date(object.damage_date).toLocaleDateString(locale)}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-2xl font-black text-slate-900">{t('detail.history', "Історія об'єкта та опис втрат")}</h3>
              <p className="text-slate-600 leading-relaxed text-lg bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {getField(object, 'description')}
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <span className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 shadow-sm">
                  🏢 {getCategoryText(object.category)}
                </span>
                {object.source_url && (
                  <a href={object.source_url} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-medium transition-colors">
                    🔗 {t('detail.source', 'Офіційне джерело')}
                  </a>
                )}
                <span className={`px-4 py-2 rounded-xl text-sm font-medium border ${object.is_verified ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                  {object.is_verified ? `✓ ${t('detail.verified', 'Дані верифіковано')}` : `⏳ ${t('detail.moderation', 'Очікує модерації')}`}
                </span>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 shadow-sm h-full flex flex-col">
                <h4 className="font-bold text-lg text-slate-900 mb-4">{t('detail.space', 'Віртуальний простір')}</h4>
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl flex-grow min-h-[160px] flex items-center justify-center text-slate-400 font-medium">
                  {t('detail.model', '3D-модель (в розробці)')}
                </div>
                {hasCoordinates && (
                  <div className="mt-6 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">{t('detail.gps', 'Координати GPS')}</p>
                    <p className="text-slate-700 font-mono text-sm">{object.coordinates.lat.toFixed(5)}, {object.coordinates.lng.toFixed(5)}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {modalImage && (
        <div className="fixed inset-0 bg-slate-900/95 backdrop-blur-md z-[9999] flex items-center justify-center p-4 cursor-pointer" onClick={() => setModalImage(null)}>
          <img src={modalImage} alt="Повноекранне фото" className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl" />
          <button className="absolute top-8 right-8 text-white/50 hover:text-white text-5xl transition-colors">×</button>
        </div>
      )}
    </div>
  )
}

export default DetailView