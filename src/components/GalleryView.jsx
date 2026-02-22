// src/components/GalleryView.jsx
import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '../hooks/useLocalizedData'

const GalleryView = ({ objects, loading }) => {
  const [page, setPage] = useState(1)
  const [toast, setToast] = useState(false)
  const PER_PAGE = 12

  // Підключення i18n та хука для БД
  const { t } = useTranslation()
  const { getField } = useLocalizedData()

  const filteredObjects = useMemo(() => objects, [objects])
  const totalPages = Math.ceil(filteredObjects.length / PER_PAGE)
  const paginated = filteredObjects.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const shareObject = (obj) => {
    // Використовуємо локалізовану назву
    const localizedTitle = getField(obj, 'title')
    const text = `${t('header.heritage', 'Зруйнована спадщина')}: ${localizedTitle} — ${window.location.origin}/object/${obj.id}`

    if (navigator.share) {
      navigator.share({ title: localizedTitle, text, url: `${window.location.origin}/object/${obj.id}` })
    } else {
      navigator.clipboard.writeText(text).then(() => {
        setToast(true)
        setTimeout(() => setToast(false), 3000)
      })
    }
  }

  const getDamageColor = (damage) => {
    if (damage === 'destroyed') return 'bg-red-500 shadow-red-500/30'
    if (damage === 'heavy') return 'bg-yellow-500 shadow-yellow-500/30'
    return 'bg-blue-500 shadow-blue-500/30'
  }

  // Компонент-скелетон для красивого завантаження
  const SkeletonCard = () => (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm animate-pulse flex flex-col h-[380px]">
      <div className="w-full h-56 bg-slate-200"></div>
      <div className="p-6 flex flex-col flex-grow">
        <div className="w-1/3 h-3 bg-slate-200 rounded mb-4"></div>
        <div className="w-3/4 h-6 bg-slate-200 rounded mb-2"></div>
        <div className="w-1/2 h-6 bg-slate-200 rounded mb-4"></div>
        <div className="mt-auto pt-4 border-t border-slate-50 flex justify-between items-center">
          <div className="w-24 h-6 bg-slate-200 rounded-full"></div>
          <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 relative">
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            {t('gallery.title', "Каталог об'єктів")}
          </h1>
          <p className="text-slate-500 mt-2">
            {t('gallery.subtitle', 'Задокументовані втрати культурної спадщини')}
          </p>
        </div>
        {!loading && (
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 text-sm font-medium text-slate-600">
            {t('gallery.total', 'Всього записів:')} {filteredObjects.length}
          </div>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {paginated.map(obj => (
              <div key={obj.id} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <Link to={`/object/${obj.id}`} className="relative block overflow-hidden aspect-[4/3]">
                  <img
                    src={obj.photo_after_url}
                    alt={getField(obj, 'title')}
                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`w-3 h-3 rounded-full shadow-lg ${getDamageColor(obj.damage_level)}`}></span>
                  </div>
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-300"></div>
                </Link>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-auto">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-2 block">
                      {getField(obj, 'region')}
                    </span>
                    <h4 className="font-bold text-lg leading-tight text-slate-900 mb-3 group-hover:text-ukr-blue transition-colors line-clamp-2">
                      {getField(obj, 'title')}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-50">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${obj.is_verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {obj.is_verified ? `✓ ${t('gallery.verified', 'Верифіковано')}` : t('gallery.moderation', 'На модерації')}
                    </span>
                    <button
                      onClick={() => shareObject(obj)}
                      className="text-slate-400 hover:text-ukr-blue transition-colors p-2 -mr-2"
                      title={t('gallery.share', 'Поділитися')}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-5.368m0 5.368l5.628 3.376m-5.628-3.376l5.628-3.376m1.155 4.502a3 3 0 10-5.368 0m5.368 0l-5.628-3.376" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-16 mb-8">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i+1}
                  onClick={() => setPage(i+1)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all duration-200 ${
                    page === i+1
                      ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {i+1}
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Toast Notification */}
      <div className={`fixed bottom-8 right-8 z-[9999] transition-all duration-500 transform ${toast ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
        <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-medium">
          <div className="w-2 h-2 rounded-full bg-ukr-yellow animate-pulse"></div>
          {t('gallery.copied', 'Посилання скопійовано!')}
        </div>
      </div>
    </div>
  )
}

export default GalleryView