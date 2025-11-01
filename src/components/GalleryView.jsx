import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const GalleryView = ({ objects, loading }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    damage: 'all'
  })

  const filteredObjects = useMemo(() => {
    return objects.filter(obj => {
      const matchesSearch = filters.search === '' ||
        obj.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        obj.region.toLowerCase().includes(filters.search.toLowerCase())

      const matchesCategory = filters.category === 'all' || obj.category === filters.category
      const matchesDamage = filters.damage === 'all' || obj.damage_level === filters.damage

      return matchesSearch && matchesCategory && matchesDamage
    })
  }, [objects, filters])

  const getDamageColor = (damage) => {
    const colors = {
      // Використовуємо Tailwind кольори для узгодженості
      'destroyed': '#E53E3E', // Red-600
      'heavy': '#F6AD55',     // Orange-400
      'partial': '#3182CE',    // Blue-600
    }
    return colors[damage] || '#9ca3af'
  }

  const getDamageText = (damage) => {
    const texts = {
      'destroyed': 'ЗРУЙНОВАНО',
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

  // Об'єкти для фільтрів (для випадаючих списків)
  const availableCategories = useMemo(() => {
      const cats = objects.map(o => o.category).filter(Boolean)
      return [...new Set(cats)]
  }, [objects])

  const availableDamageLevels = useMemo(() => {
      const levels = objects.map(o => o.damage_level).filter(Boolean)
      return [...new Set(levels)]
  }, [objects])


  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-ukr-blue">Каталог зруйнованої спадщини</h1>

      {/* Фільтри */}
      <div className="flex flex-wrap gap-4 mb-8 p-4 bg-gray-50 rounded-xl shadow-inner border border-gray-200">
        <input
          type="text"
          placeholder="Пошук (Назва, Регіон)"
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="p-2 border border-gray-300 rounded-lg focus:ring-ukr-yellow focus:border-ukr-yellow flex-grow min-w-[200px]"
        />

        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="p-2 border border-gray-300 rounded-lg focus:ring-ukr-yellow focus:border-ukr-yellow"
        >
          <option value="all">Усі категорії</option>
          {availableCategories.map(cat => (
            <option key={cat} value={cat}>{getCategoryText(cat)}</option>
          ))}
        </select>

        <select
          value={filters.damage}
          onChange={(e) => setFilters(prev => ({ ...prev, damage: e.target.value }))}
          className="p-2 border border-gray-300 rounded-lg focus:ring-ukr-yellow focus:border-ukr-yellow"
        >
          <option value="all">Усі ступені руйнувань</option>
          {availableDamageLevels.map(dmg => (
            <option key={dmg} value={dmg}>{getDamageText(dmg)}</option>
          ))}
        </select>
        <div className="text-sm font-semibold p-2 flex items-center">
            Показано об'єктів: {filteredObjects.length}
        </div>
      </div>


      {loading ? (
        <div className="text-center p-10 text-gray-500">Завантаження...</div>
      ) : filteredObjects.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          <p className="text-xl font-semibold mb-2">Об'єктів за вашими критеріями не знайдено.</p>
          <p>Спробуйте змінити фільтри або пошуковий запит.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredObjects.map(obj => {
            const damageColor = getDamageColor(obj.damage_level)

            return (
              <Link
                to={`/object/${obj.id}`}
                key={obj.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden transition duration-300 hover:shadow-2xl border-t-4"
                style={{ borderTopColor: damageColor }}
              >
                <img
                  src={obj.photo_after_url}
                  alt={`Руйнації ${obj.title}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300/e53e3e/ffffff?text=ФОТО+НЕ+ДОСТУПНЕ'
                  }}
                />
                <div className="p-5">
                  <h4 className="font-extrabold text-lg mb-2 text-gray-800 line-clamp-2">
                    {obj.title}
                  </h4>
                  <p className="text-sm text-gray-500 mb-3">
                    {getCategoryText(obj.category)}, {obj.region}
                  </p>
                  <p
                    className="text-xs font-semibold p-2 inline-block rounded"
                    style={{
                      backgroundColor: `${damageColor}20`,
                      color: damageColor,
                      border: `1px solid ${damageColor}50`
                    }}
                  >
                    {getDamageText(obj.damage_level)}
                  </p>
                  <p className={`text-xs mt-3 ${obj.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {obj.is_verified ? '✅ Верифіковано' : '⚠️ На модерації'}
                  </p>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default GalleryView
