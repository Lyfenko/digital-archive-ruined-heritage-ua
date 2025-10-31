import { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'

// Фікс для іконок у React-Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapView = ({ objects, loading, onRefresh }) => {
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    damage: 'all'
  })

  const [map, setMap] = useState(null)

  // Фільтрація об'єктів
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

  // Функції для кольорів та тексту
  const getDamageColor = (damage) => {
    const colors = {
      'destroyed': '#0057B8', // ukr-blue
      'heavy': '#FFD700',     // ukr-yellow
      'partial': '#f87171',   // red-400
    }
    return colors[damage] || '#9ca3af'
  }

  const getDamageText = (damage) => {
    const texts = {
      'destroyed': 'Повністю ЗРУЙНОВАНО',
      'heavy': 'Сильно ПОШКОДЖЕНО',
      'partial': 'Частково ПОШКОДЖЕНО',
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

  // Кастомна іконка для маркера
  const createCustomIcon = (damage) => {
    const color = getDamageColor(damage)

    const iconHtml = `
      <div class="w-6 h-6 rounded-full border-3 shadow-lg flex items-center justify-center"
           style="background-color: ${color}; border: 3px solid #fff; box-shadow: 0 0 6px rgba(0,0,0,0.4);">
        <span class="text-white text-xs font-bold" style="text-shadow: 0 0 2px #000;">!</span>
      </div>
    `

    return L.divIcon({
      className: 'custom-icon',
      html: iconHtml,
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })
  }

  // Оновлення мапи при зміні фільтрів
  useEffect(() => {
    if (map) {
      setTimeout(() => {
        map.invalidateSize()
      }, 100)
    }
  }, [filters, map])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ukr-blue mx-auto"></div>
          <p className="mt-4 text-gray-600">Завантаження даних...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="lg:grid lg:grid-cols-3 xl:grid-cols-4 lg:gap-8 h-full p-4 lg:p-8">
        {/* Ліва колонка: Фільтри та список */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg mb-6 lg:mb-0 lg:h-[calc(100vh-8rem)] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-ukr-blue">Фільтри</h2>

          <div className="space-y-4 mb-6">
            <input
              type="text"
              placeholder="Пошук за назвою або регіоном..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-ukr-blue focus:border-ukr-blue transition"
            />

            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ukr-blue focus:border-ukr-blue rounded-lg"
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
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-ukr-blue focus:border-ukr-blue rounded-lg"
            >
              <option value="all">Руйнація: Усі</option>
              <option value="destroyed">Повністю зруйновано</option>
              <option value="heavy">Сильно пошкоджено</option>
              <option value="partial">Частково пошкоджено</option>
            </select>

            <button
              onClick={onRefresh}
              className="w-full bg-ukr-blue text-white py-2 rounded-lg font-semibold hover:bg-ukr-blue/90 transition duration-150 shadow-md"
            >
              Оновити дані
            </button>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-3 text-ukr-blue">
            Об'єкти на мапі ({filteredObjects.length})
          </h3>

          <div className="space-y-3">
            {filteredObjects.length === 0 ? (
              <p className="text-center text-gray-500 p-4 border rounded-lg">
                Об'єктів не знайдено
              </p>
            ) : (
              filteredObjects.map(obj => (
                <div
                  key={obj.id}
                  className="bg-gray-50 p-3 rounded-lg border-l-4 shadow-sm transition hover:shadow-md cursor-pointer"
                  style={{ borderLeftColor: getDamageColor(obj.damage_level) }}
                >
                  <Link to={`/object/${obj.id}`} className="block">
                    <h4 className="font-semibold text-sm truncate">{obj.title}</h4>
                    <p className="text-xs text-gray-600">
                      {obj.region} | {getDamageText(obj.damage_level)}
                    </p>
                    <p className={`text-xs ${obj.is_verified ? 'text-green-600' : 'text-yellow-600'}`}>
                      {obj.is_verified ? '✅ Верифіковано' : '⚠️ На модерації'}
                    </p>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Права колонка: Мапа */}
        <div className="lg:col-span-2 xl:col-span-3 h-96 lg:h-[calc(100vh-8rem)]">
          <div className="w-full h-full rounded-xl relative shadow-2xl">
            <MapContainer
              center={[49.0, 31.5]}
              zoom={6}
              style={{ height: '100%', width: '100%', borderRadius: '0.75rem' }}
              ref={setMap}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {filteredObjects.map(obj => {
  // Перевіряємо, чи є координати
  if (!obj.coordinates || obj.coordinates.lat == null || obj.coordinates.lng == null) {
    console.warn('Пропускаємо обʼєкт без координат:', obj.title, obj.coordinates)
    return null
  }

  return (
    <Marker
      key={obj.id}
      position={[obj.coordinates.lat, obj.coordinates.lng]}
      icon={createCustomIcon(obj.damage_level)}
    >
      <Popup>
        <div className="p-2 w-[180px]">
          <h3 className="font-bold text-base mb-1">{obj.title}</h3>
          <p className="text-xs text-gray-500 mb-2">{obj.region}</p>
          <p className="text-xs text-gray-600 mb-3">
            {getCategoryText(obj.category)} • {getDamageText(obj.damage_level)}
          </p>
          <Link
            to={`/object/${obj.id}`}
            className="text-ukr-blue hover:text-ukr-blue/80 text-sm font-medium underline block text-center"
          >
            Детальніше →
          </Link>
        </div>
      </Popup>
    </Marker>
  )
})}
            </MapContainer>

            {/* Легенда мапи */}
            <div className="absolute bottom-4 left-4 bg-white p-3 rounded-xl shadow-lg z-[1000] text-sm border-2 border-gray-100">
              <p className="font-bold mb-2 text-ukr-blue">Легенда:</p>
              <div className="flex items-center space-x-2 mb-1">
                <span className="block w-3 h-3 rounded-full bg-ukr-blue"></span>
                <span>Зруйновано</span>
              </div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="block w-3 h-3 rounded-full bg-ukr-yellow"></span>
                <span>Сильно пошкоджено</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="block w-3 h-3 rounded-full bg-red-400"></span>
                <span>Частково пошкоджено</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView