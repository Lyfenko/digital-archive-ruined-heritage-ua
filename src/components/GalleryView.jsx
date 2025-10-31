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
      'destroyed': '#0057B8',
      'heavy': '#FFD700',
      'partial': '#f87171',
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
      'church': 'Церква / Храм',
      'museum': 'Музей / Галерея',
      'castle': 'Замок / Фортеця',
      'culture_house': 'Будинок культури',
      'monument': "Пам'ятник / Меморіал",
    }
    return texts[category] || 'Інше'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ukr-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження галереї...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-ukr-blue">
        Каталог втраченої спадщини ({filteredObjects.length})
      </h1>

      {/* Фільтри галереї */}
      <div className="flex flex-wrap gap-4 mb-8 bg-white p-6 rounded-xl shadow-lg">
        <input
          type="text"
          placeholder="Пошук за назвою або регіоном..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          className="flex-grow min-w-[200px] p-3 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue transition"
        />

        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
          className="flex-grow min-w-[150px] pl-3 pr-10 py-3 border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
        >
          <option value="all">Категорія: Усі</option>
          <option value="church">Церкви / Храми</option>
          <option value="museum">Музеї / Галереї</option>
          <option value="castle">Замки / Фортеці</option>
          <option value="culture_house">Будинки культури</option>
          <option value="monument">Пам'ятники</option>
        </select>

        <select
          value={filters.damage}
          onChange={(e) => setFilters(prev => ({ ...prev, damage: e.target.value }))}
          className="flex-grow min-w-[150px] pl-3 pr-10 py-3 border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue"
        >
          <option value="all">Руйнація: Усі</option>
          <option value="destroyed">Зруйновано</option>
          <option value="heavy">Сильно пошкоджено</option>
          <option value="partial">Частково пошкоджено</option>
        </select>
      </div>

      {/* Сітка об'єктів */}
      {filteredObjects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">Об'єктів за цими критеріями не знайдено.</p>
          <p className="text-sm text-gray-400 mt-2">Спробуйте змінити фільтри.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredObjects.map(obj => {
            const damageColor = getDamageColor(obj.damage_level)
            return (
              <Link
                key={obj.id}
                to={`/object/${obj.id}`}
                className="bg-white rounded-xl shadow-lg overflow-hidden border-t-4 transition-transform hover:shadow-2xl hover:scale-[1.02] cursor-pointer block"
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