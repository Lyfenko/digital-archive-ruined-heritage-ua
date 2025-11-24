// src/components/FormModal.jsx
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
      const coordsMatch = formData.coordinates.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/)
      if (!coordsMatch) {
        throw new Error('Некоректний формат координат. Використовуйте "широта, довгота" (наприклад, 50.45, 30.52).')
      }

      const [, lat, lng] = coordsMatch
      const objectData = {
        ...formData,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) }
      }

      const result = await onSubmit(objectData)

      if (result.success) {
        setMessage('Об\'єкт успішно додано! Очікуйте модерацію.')
        setTimeout(() => {
          handleClose()
        }, 2000)
      } else {
        setMessage(result.message || 'Помилка при відправці')
      }
    } catch (err) {
      setMessage(err.message || 'Щось пішло не так')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Якщо модалка закрита — нічого не рендеримо
  if (!isOpen) return null

  return (
    <>
      {/* Темний фон + блокування скролу */}
      <div className="fixed inset-0 bg-black bg-opacity-70 z-[9998] backdrop-blur-sm" onClick={handleClose} />

      {/* Сама модалка — висока z-index, відступ зверху */}
      <div className="fixed inset-x-4 top-20 bottom-8 z-[9999] flex items-start justify-center overflow-y-auto py-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl mx-auto my-8 animate-in fade-in slide-in-from-top-4 duration-300">
          {/* Заголовок + кнопка закриття */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold text-ukr-blue dark:text-ukr-yellow">
              Додати об'єкт культурної спадщини
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-3xl leading-none"
              aria-label="Закрити"
            >
              ×
            </button>
          </div>

          {/* Форма */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Назва об'єкта *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                  placeholder="Наприклад: Церква Різдва Пресвятої Богородиці"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Координати (широта, довгота) *</label>
                <input
                  type="text"
                  name="coordinates"
                  value={formData.coordinates}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue font-mono text-sm"
                  placeholder="50.4501, 30.5234"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Область *</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                  placeholder="Київська область"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Місто / Село *</label>
                <input
                  type="text"
                  name="city_or_settlement"
                  value={formData.city_or_settlement}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                  placeholder="Ірпінь"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категорія *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                >
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ступінь пошкодження *</label>
                <select
                  name="damage_level"
                  value={formData.damage_level}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-ukr-blue"
                >
                  {damageLevels.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Дата пошкодження (приблизно)</label>
                <input
                  type="date"
                  name="damage_date"
                  value={formData.damage_date}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Опис (не обов'язково)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                  placeholder="Додаткова інформація про об'єкт..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Фото "ДО" (URL) *</label>
                <input
                  type="url"
                  name="photo_before_url"
                  value={formData.photo_before_url}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                  placeholder="https://example.com/photo-before.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Фото "ПІСЛЯ" (URL) *</label>
                <input
                  type="url"
                  name="photo_after_url"
                  value={formData.photo_after_url}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                  placeholder="https://example.com/photo-after.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Джерело інформації (посилання) *</label>
                <input
                  type="url"
                  name="source_url"
                  value={formData.source_url}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                  placeholder="https://mkip.gov.ua/... або стаття в ЗМІ"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-ukr-blue hover:bg-ukr-blue/90 text-white font-bold py-4 rounded-xl transition transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg text-lg"
              >
                {isSubmitting ? 'Відправляємо...' : 'Надіслати звіт'}
              </button>
              <button
                type="button"
                onClick={handleClose}
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-semibold transition"
              >
                Скасувати
              </button>
            </div>

            {message && (
              <p className={`text-center text-lg font-semibold mt-4 ${message.includes('успішно') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        </div>
      </div>
    </>
  )
}

export default FormModal