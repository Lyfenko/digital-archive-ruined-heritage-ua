import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { heritageAPI } from '../lib/supabase'

const DetailView = ({ objects }) => {
  const { id } = useParams()
  const [object, setObject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadObject = async () => {
      try {
        setLoading(true)
        // Спочатку шукаємо в наявних об'єктах
        const existingObject = objects.find(obj => obj.id === id)
        if (existingObject) {
          setObject(existingObject)
        } else {
          // Якщо не знайшли, завантажуємо з API
          const data = await heritageAPI.getObjectById(id)
          setObject(data)
        }
      } catch (error) {
        console.error('Помилка завантаження обʼєкта:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadObject()
    }
  }, [id, objects])

  const getDamageColor = (damage) => {
    const colors = {
      'destroyed': '#E53E3E', // Червоний
      'heavy': '#F6AD55',     // Помаранчевий
      'partial': '#3182CE',    // Синій (менш критично)
    }
    return colors[damage] || '#9ca3af'
  }

  const getDamageText = (damage) => {
    const texts = {
      'destroyed': 'Повністю ЗРУЙНОВАНО',
      'heavy': 'СИЛЬНО ПОШКОДЖЕНО',
      'partial': 'ЧАСТКОВО ПОШКОДЖЕНО',
    }
    return texts[damage] || 'Невідомо'
  }

  const getCategoryText = (category) => {
    const texts = {
      'church': 'Сакральна споруда',
      'museum': 'Музей/Галерея',
      'culture_house': 'Палац культури/Театр',
      'monument': 'Пам\'ятка/Меморіал',
      'other': 'Інше',
    }
    return texts[category] || 'Невідома категорія'
  }

  if (loading) {
    return <div className="text-center p-10 text-gray-500">Завантаження деталей...</div>
  }

  if (!object) {
    return <div className="text-center p-10 text-red-500">Об'єкт не знайдено.</div>
  }

  // Перевірка наявності координат
  const hasCoordinates = object.coordinates && object.coordinates.lat && object.coordinates.lng

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8">
      <Link to="/" className="text-ukr-blue hover:text-ukr-blue/80 mb-6 inline-block font-medium">
        ← Повернутися до мапи
      </Link>

      <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border-t-8" style={{ borderTopColor: getDamageColor(object.damage_level) }}>

        <div className="flex items-start justify-between border-b pb-4 mb-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
            {object.title}
          </h1>
          <p
            className="text-sm font-bold px-3 py-1 rounded-full whitespace-nowrap"
            style={{
              backgroundColor: `${getDamageColor(object.damage_level)}20`,
              color: getDamageColor(object.damage_level),
              border: `1px solid ${getDamageColor(object.damage_level)}50`
            }}
          >
            {getDamageText(object.damage_level)}
          </p>
        </div>

        {/* Галерея: ДО vs ПІСЛЯ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-700">До руйнування</h3>
            <img
              src={object.photo_before_url}
              alt={`Фото ${object.title} до руйнування`}
              className="w-full h-auto object-cover rounded-xl shadow-md"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ'
              }}
            />
            <p className="text-xs text-gray-500 italic">
              Фото: {object.damage_date || 'Дата невідома'}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-red-600">Після руйнування</h3>
            <img
              src={object.photo_after_url}
              alt={`Фото ${object.title} після руйнування`}
              className="w-full h-auto object-cover rounded-xl shadow-md border-2 border-red-300"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x400/e53e3e/ffffff?text=ПІСЛЯ+РУЙНАЦІЇ'
              }}
            />
            <p className="text-xs text-gray-500 italic">
              Дата пошкодження: {object.damage_date || 'Дата невідома'}
            </p>
          </div>
        </div>

        {/* Опис та інформаційна панель */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Опис та історія втрат</h3>
            <p className="text-gray-700 leading-relaxed mb-6">{object.description}</p>

            {/* Основні атрибути */}
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-semibold text-gray-700">Місцезнаходження:</span> {object.city_or_settlement}, {object.region}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Категорія:</span> {getCategoryText(object.category)}
              </p>
              <p>
                <span className="font-semibold text-gray-700">Джерело:</span>
                {object.source_url ? (
                  <a href={object.source_url} target="_blank" rel="noopener noreferrer" className="text-ukr-blue hover:underline ml-1">
                    Переглянути
                  </a>
                ) : (
                  <span className="text-gray-500 ml-1">не вказано</span>
                )}
              </p>
              <p className={`text-sm mt-2 ${object.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                {object.is_verified ? '✅ Офіційно підтверджено' : '⚠️ Очікує підтвердження'}
              </p>
            </div>
          </div>

          {/* Бічна панель з додатковою інформацією */}
          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <div className="p-5 bg-yellow-50/50 rounded-xl border border-yellow-200 shadow-inner">
              <h4 className="font-bold text-lg text-yellow-700 mb-3">
                Віртуальний простір
              </h4>
              <p className="text-sm text-gray-700 mb-4">
                Розділ для демонстрації 3D-моделей або віртуальної реконструкції.
              </p>
              <div className="w-full h-32 bg-gray-200 flex items-center justify-center rounded-lg border-2 border-dashed border-gray-400 text-sm text-gray-500">
                [3D-модель (Blender/Sketchfab)]
              </div>
              <p className="text-xs text-gray-500 mt-3">
                {/* ВИПРАВЛЕНО: Використовуємо .lat та .lng */}
                {hasCoordinates ?
                  `Координати: ${object.coordinates.lat.toFixed(4)}, ${object.coordinates.lng.toFixed(4)}`
                  : 'Координати недоступні'}
              </p>
              <button className="mt-4 w-full bg-ukr-yellow text-ukr-blue py-2 rounded-lg font-semibold hover:bg-ukr-yellow/90 transition duration-150 shadow-md">
                Переглянути у 3D (в розробці)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailView
