import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Створення клієнта Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Функція для трансформації координат з PostGIS або GeoJSON
export const transformCoordinates = (obj) => {
  if (!obj || !obj.coordinates) return obj

  // Перевірка: Якщо координати вже в фінальному форматі {lat, lng}
  if (obj.coordinates.lat !== undefined && obj.coordinates.lng !== undefined) {
    return obj
  }

  // Перевірка: Якщо координати у форматі PostGIS (GeoJSON) - {x: lng, y: lat}
  // Supabase часто повертає геометрію у вигляді GeoJSON об'єкта або об'єкта з полями x/y
  if (obj.coordinates.x !== undefined && obj.coordinates.y !== undefined) {
    // В PostGIS x = довгота (lng), y = широта (lat)
    return {
      ...obj,
      coordinates: {
        lat: obj.coordinates.y,
        lng: obj.coordinates.x
      }
    }
  }

  // Якщо об'єкт є GeoJSON Point, але повернутий як рядок або незвичайний об'єкт
  if (Array.isArray(obj.coordinates.coordinates)) {
    // GeoJSON Point: [longitude, latitude]
    return {
      ...obj,
      coordinates: {
        lat: obj.coordinates.coordinates[1],
        lng: obj.coordinates.coordinates[0],
      }
    }
  }

  return obj
}

// Функції для роботи з даними
export const heritageAPI = {
  async getAllObjects() {
    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Трансформуємо координати для кожного об'єкта
    return data.map(transformCoordinates)
  },

  async getObjectById(id) {
    const { data, error } = await supabase
      .from('objects')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error
    return transformCoordinates(data)
  },

  async addObject(objectData) {
    // Форматуємо координати для запису в PostGIS: POINT(lng lat)
    const geoPoint = `POINT(${objectData.coordinates.lng} ${objectData.coordinates.lat})`

    const { coordinates, ...rest } = objectData

    const { data, error } = await supabase
      .from('objects')
      .insert({
        ...rest,
        coordinates: geoPoint,
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase Insert Error:', error.message)
      throw error // Прокидаємо помилку для обробки в App.jsx
    }

    return { success: true, data }
  },
}
