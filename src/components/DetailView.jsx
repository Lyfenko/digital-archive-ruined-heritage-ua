import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { heritageAPI } from '../lib/supabase'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '../hooks/useLocalizedData'
// Імпортуємо компоненти слайдера
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider'

const DetailView = ({ objects }) => {
  const { id } = useParams()
  const [object, setObject] = useState(null)
  const [loading, setLoading] = useState(true)

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

          {/* НОВИЙ БЛОК: Інтерактивний слайдер ДО/ПІСЛЯ */}
          <div className="mb-12">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-sm md:text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-300"></span> {t('detail.before', 'До руйнування')}
              </h3>
              <p className="hidden md:block text-xs font-bold text-slate-400 uppercase tracking-widest animate-pulse">
                {t('detail.drag_hint', '↔ Перетягніть повзунок')}
              </p>
              <h3 className="text-sm md:text-lg font-bold text-red-600 flex items-center gap-2">
                {t('detail.after', 'Після руйнування')} <span className="w-2 h-2 rounded-full bg-red-500"></span>
              </h3>
            </div>

            <div className="relative overflow-hidden rounded-3xl shadow-md border border-slate-200 aspect-[4/3] md:aspect-[21/9] bg-slate-100">
              <ReactCompareSlider
                className="w-full h-full"
                boundsPadding={0}
                itemOne={
                  <ReactCompareSliderImage
                    src={object.photo_before_url || 'https://placehold.co/1200x800/e2e8f0/94a3b8?text=Немає+фото'}
                    alt={t('detail.before', 'До руйнування')}
                    style={{ objectFit: 'cover' }}
                  />
                }
                itemTwo={
                  <ReactCompareSliderImage
                    src={object.photo_after_url || 'https://placehold.co/1200x800/fee2e2/ef4444?text=Немає+фото'}
                    alt={t('detail.after', 'Після руйнування')}
                    style={{ objectFit: 'cover' }}
                  />
                }
              />
            </div>
            {object.damage_date && (
              <p className="text-sm text-slate-500 text-center font-medium mt-4">
                {t('detail.date', 'Дата фіксації:')} {new Date(object.damage_date).toLocaleDateString(locale)}
              </p>
            )}
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
    </div>
  )
}

export default DetailView