import { useState } from 'react'

const FormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    coordinates: '',
    region: '',
    city_or_settlement: '',
    category: 'culture_house',
    damage_level: 'destroyed',
    damage_date: '',
    description: '',
    photo_before_url: '',
    photo_after_url: '',
    source_url: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')

  const categories = [
    { value: 'church', label: 'Сакральна споруда' },
    { value: 'museum', label: 'Музей/Галерея' },
    { value: 'culture_house', label: 'Палац культури/Театр' },
    { value: 'monument', label: 'Пам\'ятка/Меморіал' },
    { value: 'other', label: 'Інше' },
  ]

  const damageLevels = [
    { value: 'destroyed', label: 'Повністю ЗРУЙНОВАНО' },
    { value: 'heavy', label: 'СИЛЬНО ПОШКОДЖЕНО' },
    { value: 'partial', label: 'ЧАСТКОВО ПОШКОДЖЕНО' },
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const resetForm = () => {
    setFormData({
      title: '',
      coordinates: '',
      region: '',
      city_or_settlement: '',
      category: 'culture_house',
      damage_level: 'destroyed',
      damage_date: '',
      description: '',
      photo_before_url: '',
      photo_after_url: '',
      source_url: ''
    })
    setMessage('')
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // 1. Валідація та перетворення координат
      // Очікуємо формат "широта, довгота" (наприклад: 50.45, 30.52)
      const coordsMatch = formData.coordinates.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/)
      if (!coordsMatch) {
        throw new Error('Некоректний формат координат. Використовуйте "широта, довгота" (наприклад, 50.45, 30.52).')
      }

      const [, lat, lng] = coordsMatch
      const objectData = {
        ...formData,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) }
      }

      // 2. Відправлення даних
      const result = await onSubmit(objectData)

      if (result.success) {
        setMessage('✅ Дані успішно надіслано на модерацію! Дякуємо за ваш внесок.')
        // resetForm() // Залишаємо дані для перегляду успіху
      } else {
         // Обробка помилки, поверненої з App.jsx (наприклад, помилка RLS)
        throw new Error(result.message || 'Невідома помилка на сервері.')
      }

    } catch (error) {
      console.error('Помилка відправки форми:', error.message)
      setMessage(`❌ Помилка: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4 transition-opacity duration-300"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Запобігаємо закриттю при кліку всередині
      >
        <div className="sticky top-0 bg-white p-6 border-b z-10 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-ukr-blue">Надіслати інформацію про втрату</h2>
          <button onClick={handleClose} className="text-gray-500 hover:text-gray-900 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Назва та місцезнаходження */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Назва об'єкта *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                placeholder="Наприклад, Будинок культури, Ірпінь"
              />
            </div>
            <div>
              <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 mb-1">
                Координати (широта, довгота) *
              </label>
              <input
                type="text"
                id="coordinates"
                name="coordinates"
                value={formData.coordinates}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                placeholder="50.45, 30.52"
              />
              <p className="text-xs text-gray-500 mt-1">
                Для точності використовуйте формати GPS
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">
                Область *
              </label>
              <input
                type="text"
                id="region"
                name="region"
                value={formData.region}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                placeholder="Київська область"
              />
            </div>
            <div>
              <label htmlFor="city_or_settlement" className="block text-sm font-medium text-gray-700 mb-1">
                Населений пункт
              </label>
              <input
                type="text"
                id="city_or_settlement"
                name="city_or_settlement"
                value={formData.city_or_settlement}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                placeholder="Ірпінь"
              />
            </div>
          </div>

          {/* Категорія та руйнування */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Категорія *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="damage_level" className="block text-sm font-medium text-gray-700 mb-1">
                Ступінь руйнування *
              </label>
              <select
                id="damage_level"
                name="damage_level"
                value={formData.damage_level}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
              >
                {damageLevels.map(d => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="damage_date" className="block text-sm font-medium text-gray-700 mb-1">
                Дата пошкодження
              </label>
              <input
                type="date"
                id="damage_date"
                name="damage_date"
                value={formData.damage_date}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
              />
            </div>
          </div>

          {/* Опис */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Детальний опис
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
              placeholder="Коротка історична довідка та деталі пошкоджень"
            />
          </div>

          {/* Фото URL */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="photo_before_url" className="block text-sm font-medium text-gray-700 mb-1">
                Фото "ДО" (URL)
              </label>
              <input
                type="url"
                id="photo_before_url"
                name="photo_before_url"
                value={formData.photo_before_url}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                placeholder="https://example.com/photo-before.jpg"
              />
            </div>
            <div>
              <label htmlFor="photo_after_url" className="block text-sm font-medium text-gray-700 mb-1">
                Фото "ПІСЛЯ" (URL) *
              </label>
              <input
                type="url"
                id="photo_after_url"
                name="photo_after_url"
                value={formData.photo_after_url}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                placeholder="https://example.com/photo-after.jpg"
              />
            </div>
          </div>

          <div>
            <label htmlFor="source_url" className="block text-sm font-medium text-gray-700 mb-1">
              Посилання на джерело верифікації *
            </label>
            <input
              type="url"
              id="source_url"
              name="source_url"
              value={formData.source_url}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
              placeholder="https://mkip.gov.ua/article/..."
            />
            <p className="text-xs text-gray-500 mt-1">
              Надайте посилання на офіційне джерело (Мінкульт, ЗМІ, тощо)
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-ukr-blue text-white py-3 rounded-lg font-semibold hover:bg-ukr-blue/90 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Відправлення...' : 'Надіслати звіт'}
          </button>

          {message && (
            <p className={`text-center mt-3 text-sm ${
              message.includes('✅') ? 'text-green-600' : 'text-red-600'
            }`}>
              {message}
            </p>
          )}

        </form>
      </div>
    </div>
  )
}

export default FormModal
