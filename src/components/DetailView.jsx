import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { heritageAPI } from '../lib/supabase'

const DetailView = ({ objects }) => {
  const { id } = useParams()
  const [object, setObject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modalImage, setModalImage] = useState(null) // Для модалки

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
    const colors = { 'destroyed': '#E53E3E', 'heavy': '#F6AD55', 'partial': '#3182CE' }
    return colors[damage] || '#9ca3af'
  }

  const getDamageText = (damage) => {
    const texts = { 'destroyed': 'Повністю ЗРУЙНОВАНО', 'heavy': 'СИЛЬНО ПОШКОДЖЕНО', 'partial': 'ЧАСТКОВО ПОШКОДЖЕНО' }
    return texts[damage] || 'Невідомо'
  }

  const getCategoryText = (category) => {
    const texts = { 'church': 'Сакральна споруда', 'museum': 'Музей/Галерея', 'culture_house': 'Палац культури/Театр', 'monument': 'Пам\'ятка/Меморіал', 'other': 'Інше' }
    return texts[category] || 'Невідома категорія'
  }

  if (loading) return <div className="text-center p-10 text-gray-500">Завантаження деталей...</div>
  if (!object) return <div className="text-center p-10 text-red-500">Об'єкт не знайдено.</div>

  const hasCoordinates = object.coordinates && object.coordinates.lat !== undefined && object.coordinates.lng !== undefined

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Link to="/" className="text-ukr-blue hover:text-ukr-blue/80 mb-6 inline-block font-medium">
        ← Повернутися до мапи
      </Link>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-8" style={{ borderTopColor: getDamageColor(object.damage_level) }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b pb-4 mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">{object.title}</h1>
          <span className="text-sm font-bold px-4 py-2 rounded-full mt-4 sm:mt-0" style={{
            backgroundColor: `${getDamageColor(object.damage_level)}20`,
            color: getDamageColor(object.damage_level),
            border: `1px solid ${getDamageColor(object.damage_level)}50`
          }}>
            {getDamageText(object.damage_level)}
          </span>
        </div>

        {/* ГАЛЕРЕЯ: ОДИНАКОВИЙ РОЗМІР + КЛІК ДЛЯ ЗБІЛЬШЕННЯ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {/* ДО */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-700">До руйнування</h3>
            <div className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group"
                 onClick={() => setModalImage(object.photo_before_url || 'https://placehold.co/1200x800/3182ce/ffffff?text=ДО+ВІЙНИ')}>
              <img
                src={object.photo_before_url || 'https://placehold.co/1200x800/3182ce/ffffff?text=ДО+ВІЙНИ'}
                alt={`До: ${object.title}`}
                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition">Збільшити</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic text-center">Фото до: {object.damage_date || 'невідомо'}</p>
          </div>

          {/* ПІСЛЯ */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-red-600">Після руйнування</h3>
            <div className="relative overflow-hidden rounded-2xl shadow-xl cursor-pointer group ring-4 ring-red-300"
                 onClick={() => setModalImage(object.photo_after_url || 'https://placehold.co/1200x800/e53e3e/ffffff?text=ПІСЛЯ+РУЙНУВАННЯ')}>
              <img
                src={object.photo_after_url || 'https://placehold.co/1200x800/e53e3e/ffffff?text=ПІСЛЯ+РУЙНУВАННЯ'}
                alt={`Після: ${object.title}`}
                className="w-full h-96 object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition flex items-center justify-center">
                <span className="text-white text-4xl opacity-0 group-hover:opacity-100 transition">Збільшити</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 italic text-center">Дата пошкодження: {object.damage_date || 'невідомо'}</p>
          </div>
        </div>

        {/* ОПИС */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Опис та історія втрат</h3>
            <p className="text-gray-700 leading-relaxed text-lg mb-6">{object.description}</p>

            <div className="bg-gray-50 p-6 rounded-xl space-y-3 text-lg">
              <p><span className="font-bold text-ukr-blue">Місце:</span> {object.city_or_settlement}, {object.region}</p>
              <p><span className="font-bold text-ukr-blue">Категорія:</span> {getCategoryText(object.category)}</p>
              <p>
                <span className="font-bold text-ukr-blue">Джерело:</span>{' '}
                {object.source_url ? (
                  <a href={object.source_url} target="_blank" rel="noopener noreferrer" className="text-ukr-blue hover:underline">
                    Переглянути оригінал →
                  </a>
                ) : '—'}
              </p>
              <p className={`font-bold ${object.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {object.is_verified ? 'Офіційно підтверджено' : 'Очікує модерації'}
              </p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-300 shadow-inner">
              <h4 className="font-bold text-xl text-ukr-blue mb-4">Віртуальний простір</h4>
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-48 flex items-center justify-center text-gray-500">
                3D-модель (в розробці)
              </div>
              {hasCoordinates && (
                <p className="text-sm mt-4 text-gray-600">
                  Координати: {object.coordinates.lat.toFixed(5)}, {object.coordinates.lng.toFixed(5)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* МОДАЛКА ДЛЯ ПОВНОЕКРАННОГО ПЕРЕГЛЯДУ */}
      {modalImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setModalImage(null)}
        >
          <img
            src={modalImage}
            alt="Повноекранне фото"
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
          />
          <button className="absolute top-6 right-6 text-white text-5xl hover:text-gray-400 transition">
            ×
          </button>
        </div>
      )}
    </div>
  )
}

export default DetailView