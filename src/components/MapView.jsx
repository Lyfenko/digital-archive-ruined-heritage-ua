// src/components/MapView.jsx
import { useState, useMemo, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'

// Фікс іконок Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapVisibilityController = ({ isModalOpen }) => {
  const map = useMap()
  useEffect(() => {
    if (!map) return
    if (isModalOpen) {
      map.getContainer().style.visibility = 'hidden'
      map.getContainer().style.pointerEvents = 'none'
    } else {
      map.getContainer().style.visibility = 'visible'
      map.getContainer().style.pointerEvents = 'auto'
      map.invalidateSize()
    }
  }, [isModalOpen, map])
  return null
}

const MapView = ({ objects, loading, onRefresh, isFormModalOpen = false }) => {
  const [filters, setFilters] = useState({ search: '', category: 'all', damage: 'all' })
  const [map, setMap] = useState(null)

  const filteredObjects = useMemo(() => {
    return objects.filter(obj => {
      const matchesSearch = filters.search === '' ||
        obj.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        obj.region?.toLowerCase().includes(filters.search.toLowerCase())
      const matchesCategory = filters.category === 'all' || obj.category === filters.category
      const matchesDamage = filters.damage === 'all' || obj.damage_level === filters.damage
      return matchesSearch && matchesCategory && matchesDamage
    })
  }, [objects, filters])

  const getDamageColor = (damage) => {
    const colors = { 'destroyed': '#ef4444', 'heavy': '#eab308', 'partial': '#3b82f6' }
    return colors[damage] || '#94a3b8'
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

  const createCustomIcon = (damage) => {
    const color = getDamageColor(damage)
    const iconHtml = `
      <div class="w-6 h-6 rounded-full border-3 shadow-lg flex items-center justify-center"
           style="background-color: ${color}; border: 3px solid #fff; box-shadow: 0 0 6px rgba(0,0,0,0.4);">
        <span class="text-white text-xs font-bold" style="text-shadow: 0 0 2px #000;">!</span>
      </div>
    `
    return L.divIcon({ className: 'custom-icon', html: iconHtml, iconSize: [24, 24], iconAnchor: [12, 12] })
  }

  useEffect(() => {
    if (map) {
      setTimeout(() => map.invalidateSize(), 100)
    }
  }, [map, filters])

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
    <div className="h-full flex flex-col lg:flex-row gap-0 lg:gap-6 p-4 lg:p-6">

      {/* === ФІЛЬТРИ + СПИСОК (УЛЬТРА-КОМПАКТНО) === */}
      <div className="w-full lg:w-[380px] glass-panel p-4 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] lg:h-[calc(100vh-7rem)] flex flex-col order-2 lg:order-1 border-white/50 relative z-10">
        <div className="mb-2">
          <h2 className="text-lg font-black mb-0 text-slate-800 tracking-tight leading-none">Навігація</h2>
        </div>

        {/* Фільтри (Зменшено відступи та висоту полів) */}
        <div className="space-y-1.5 mb-2 shrink-0">
          <input type="text" placeholder="Пошук (назва, регіон)..." value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-ukr-blue/20 focus:border-ukr-blue transition-all shadow-sm text-xs" />

          <div className="flex gap-1.5">
            <select value={filters.category} onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-1/2 px-2 py-1.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ukr-blue/20 focus:border-ukr-blue rounded-xl shadow-sm text-[11px] cursor-pointer appearance-none truncate">
              <option value="all">Усі категорії</option>
              <option value="church">Церкви / Храми</option>
              <option value="museum">Музеї / Галереї</option>
              <option value="castle">Замки / Фортеці</option>
              <option value="culture_house">Культура</option>
              <option value="monument">Пам'ятники</option>
            </select>

            <select value={filters.damage} onChange={(e) => setFilters(prev => ({ ...prev, damage: e.target.value }))}
              className="w-1/2 px-2 py-1.5 bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-ukr-blue/20 focus:border-ukr-blue rounded-xl shadow-sm text-[11px] cursor-pointer appearance-none truncate">
              <option value="all">Усі руйнації</option>
              <option value="destroyed">Знищено</option>
              <option value="heavy">Сильно пошк.</option>
              <option value="partial">Частково пошк.</option>
            </select>
          </div>

          <button onClick={onRefresh}
            className="w-full bg-slate-900 text-white py-1.5 rounded-xl font-bold hover:bg-slate-800 transition-all duration-300 shadow-md hover:shadow-lg mt-0.5 text-xs">
            Оновити
          </button>
        </div>

        <div className="flex justify-between items-center mb-1.5 shrink-0 border-b border-slate-200/60 pb-1.5">
          <h3 className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
            Знайдено: {filteredObjects.length}
          </h3>
        </div>

        {/* Список об'єктів (Щільні картки) */}
        <div className="space-y-1.5 overflow-y-auto pr-1 pb-2 -mr-1 custom-scrollbar flex-grow">
          {filteredObjects.length === 0 ? (
            <div className="text-center p-3 border-2 border-dashed border-slate-200 rounded-xl">
              <p className="text-slate-400 font-medium text-xs">Нічого не знайдено</p>
            </div>
          ) : (
            filteredObjects.map(obj => (
              <div key={obj.id} className="group bg-white p-2 rounded-xl border border-slate-100 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-200 cursor-pointer relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 transition-all duration-300 group-hover:w-1.5" style={{ backgroundColor: getDamageColor(obj.damage_level) }}></div>
                <Link to={`/object/${obj.id}`} className="block pl-2.5">
                  <h4 className="font-bold text-[12px] leading-tight text-slate-800 mb-0.5 group-hover:text-ukr-blue transition-colors line-clamp-1">{obj.title}</h4>
                  <p className="text-[10px] leading-tight text-slate-500 mb-1">{obj.region} • {getDamageText(obj.damage_level)}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded ${obj.is_verified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {obj.is_verified ? 'Верифіковано' : 'Модерація'}
                    </span>
                  </div>
                </Link>
              </div>
            ))
          )}
        </div>
      </div>

      {/* === КАРТА === */}
      <div className="flex-1 relative order-1 lg:order-2">
        <div className="w-full h-96 lg:h-[calc(100vh-7rem)] lg:min-h-[500px] rounded-3xl shadow-2xl overflow-hidden border border-slate-200/50">
          <MapContainer center={[49.0, 31.5]} zoom={6} style={{ height: '100%', width: '100%' }} ref={setMap}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors' />
            <MapVisibilityController isModalOpen={isFormModalOpen} />

            {filteredObjects.map(obj => {
              if (!obj.coordinates || obj.coordinates.lat == null || obj.coordinates.lng == null) return null
              return (
                <Marker key={obj.id} position={[obj.coordinates.lat, obj.coordinates.lng]} icon={createCustomIcon(obj.damage_level)}>
                  <Popup>
                    <div className="p-1 w-[160px]">
                      <h3 className="font-bold text-sm mb-1 leading-tight">{obj.title}</h3>
                      <p className="text-[11px] text-slate-500 mb-1">{obj.region}</p>
                      <p className="text-[10px] text-slate-600 mb-2 leading-tight">
                        {getCategoryText(obj.category)} • {getDamageText(obj.damage_level)}
                      </p>
                      <Link to={`/object/${obj.id}`}
                        className="text-ukr-blue hover:text-ukr-blue/80 text-[11px] font-bold uppercase tracking-wider block text-center bg-slate-50 py-1 rounded">
                        Детальніше
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              )
            })}
          </MapContainer>

          {/* МАЛЕНЬКА ЛЕГЕНДА НА МОБІЛЦІ */}
          <div className="lg:hidden absolute bottom-4 right-4 bg-white/98 backdrop-blur-md rounded-xl shadow-xl p-2 z-[1000] border border-slate-200 text-[10px] transition-opacity">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-red-500 border border-white shadow-sm"></div><span>Знищено</span></div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-yellow-500 border border-white shadow-sm"></div><span>Сильно</span></div>
              <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-full bg-blue-500 border border-white shadow-sm"></div><span>Частково</span></div>
            </div>
          </div>

          {/* ВЕЛИКА ЛЕГЕНДА — ТІЛЬКИ НА ДЕСКТОПІ ТА ПЛАНШЕТАХ */}
          <div className={`
            hidden lg:block absolute bottom-6 left-6 bg-white/95 backdrop-blur-md
            rounded-2xl shadow-xl p-4 z-[1000] border border-slate-200
            transition-all duration-500 ease-out
            ${isFormModalOpen ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'}
          `}>
            <h3 className="font-bold text-sm text-slate-800 mb-3 tracking-wide uppercase">
              Ступінь руйнування
            </h3>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md"></div>
                <div>
                  <p className="font-bold text-xs text-slate-900 leading-none">Повністю знищено</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Втрачено архітектуру</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-white shadow-md"></div>
                <div>
                  <p className="font-bold text-xs text-slate-900 leading-none">Сильно пошкоджено</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Критичний стан</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-md"></div>
                <div>
                  <p className="font-bold text-xs text-slate-900 leading-none">Частково пошкоджено</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Потребує реставрації</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MapView