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

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      // Перетворення координат
      const coordsMatch = formData.coordinates.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/)
      if (!coordsMatch) {
        throw new Error('Некоректний формат координат. Використовуйте "широта, довгота"')
      }

      const [, lat, lng] = coordsMatch
      const objectData = {
        ...formData,
        coordinates: { lat: parseFloat(lat), lng: parseFloat(lng) }
      }

      const result = await onSubmit(objectData)

      if (result.success) {
        setMessage('✅ Дані успішно надіслано на модерацію! Дякуємо за ваш внесок.')
        // Очищення форми
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
        // Закриття модального вікна через 3 секунди
        setTimeout(() => {
          onClose()
          setMessage('')
        }, 3000)
      } else {
        throw new Error(result.error || 'Помилка відправлення даних')
      }
    } catch (error) {
      setMessage(`❌ Помилка: ${error.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-ukr-blue text-2xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold mb-6 text-ukr-blue">Повідомити про руйнування</h2>
        <p className="mb-6 text-sm text-gray-600">
          Ваша інформація буде надіслана на модерацію та верифікацію.
          Будь ласка, надавайте тільки точні та перевірені дані.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="Наприклад: Будинок культури в Ірпені"
            />
          </div>

          <div>
            <label htmlFor="coordinates" className="block text-sm font-medium text-gray-700 mb-1">
              GPS-координати (широта, довгота) *
            </label>
            <input
              type="text"
              id="coordinates"
              name="coordinates"
              value={formData.coordinates}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
              placeholder="Наприклад: 50.518, 30.222"
            />
            <p className="text-xs text-gray-500 mt-1">
              Формат: широта, довгота (можна знайти в Google Maps)
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
                placeholder="Наприклад: Київська область"
              />
            </div>
            <div>
              <label htmlFor="city_or_settlement" className="block text-sm font-medium text-gray-700 mb-1">
                Місто/селище
              </label>
              <input
                type="text"
                id="city_or_settlement"
                name="city_or_settlement"
                value={formData.city_or_settlement}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
                placeholder="Наприклад: Ірпінь"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
                <option value="culture_house">Будинок культури</option>
                <option value="church">Церква / Храм</option>
                <option value="museum">Музей / Галерея</option>
                <option value="castle">Замок / Фортеця</option>
                <option value="monument">Пам'ятник / Меморіал</option>
                <option value="other">Інше</option>
              </select>
            </div>
            <div>
              <label htmlFor="damage_level" className="block text-sm font-medium text-gray-700 mb-1">
                Ступінь пошкодження *
              </label>
              <select
                id="damage_level"
                name="damage_level"
                value={formData.damage_level}
                onChange={handleChange}
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
              >
                <option value="destroyed">Повністю зруйновано</option>
                <option value="heavy">Сильно пошкоджено</option>
                <option value="partial">Частково пошкоджено</option>
                <option value="unknown">Невідомо</option>
              </select>
            </div>
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

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Опис та джерело інформації *
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
              placeholder="Опишіть об'єкт, характер пошкоджень та надайте посилання на джерело інформації..."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="photo_before_url" className="block text-sm font-medium text-gray-700 mb-1">
                Фото "До" (URL)
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
                Фото "Після" (URL) *
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