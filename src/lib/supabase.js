import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Створення клієнта Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Функція для трансформації координат з PostGIS або GeoJSON
export const transformCoordinates = (obj) => {
  if (!obj || !obj.coordinates) return obj

  if (obj.coordinates.lat !== undefined && obj.coordinates.lng !== undefined) {
    return obj
  }

  if (obj.coordinates.x !== undefined && obj.coordinates.y !== undefined) {
    return {
      ...obj,
      coordinates: {
        lat: obj.coordinates.y,
        lng: obj.coordinates.x
      }
    }
  }

  if (obj.coordinates.coordinates && Array.isArray(obj.coordinates.coordinates)) {
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

  // НОВА ФУНКЦІЯ ДЛЯ ЗАВАНТАЖЕННЯ ФОТО
  async uploadImage(file) {
    // Генеруємо унікальне ім'я файлу, щоб вони не перезаписували один одного
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('heritage-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Помилка завантаження фото:', uploadError)
      throw new Error('Не вдалося завантажити фотографію у сховище.')
    }

    // Отримуємо публічне посилання на завантажений файл
    const { data } = supabase.storage
      .from('heritage-images')
      .getPublicUrl(filePath)

    return data.publicUrl
  },

  async addObject(objectData) {
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
      throw error
    }

    return { success: true, data }
  },
}