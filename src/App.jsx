import { Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import MapView from './components/MapView'
import DetailView from './components/DetailView'
import GalleryView from './components/GalleryView'
import AboutView from './components/AboutView'
import FormModal from './components/FormModal'
import AdminPanel from './components/AdminPanel'
import AdminLogin from './components/AdminLogin'
import NotFound from './components/NotFound'
import { heritageAPI, transformCoordinates } from './lib/supabase' // Імпорт transformCoordinates для мок-даних

/**
 * Генерик-функція для імітації даних, якщо Supabase недоступний
 */
const getMockData = () => {
  return [
    {
      id: '1',
      title: 'Будинок культури, Ірпінь',
      coordinates: { lat: 50.518, lng: 30.222 }, // Широта, Довгота
      region: 'Київська область',
      city_or_settlement: 'Ірпінь',
      category: 'culture_house',
      damage_level: 'destroyed',
      description: "Знакова будівля міста, центр громадського життя, повністю зруйнована прямим влучанням ракети у березні 2022 року. Була архітектурною пам'яткою місцевого значення.",
      damage_date: '2022-03-01',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/e53e3e/ffffff?text=ПІСЛЯ+РУЙНАЦІЇ',
      source_url: 'https://mkip.gov.ua',
      is_verified: true,
      created_at: '2023-01-01T10:00:00Z'
    },
    {
      id: '2',
      title: 'Свято-Георгіївський храм, с.Лукашівка',
      coordinates: { lat: 51.488, lng: 31.066 },
      region: 'Чернігівська область',
      city_or_settlement: 'с.Лукашівка',
      category: 'church',
      damage_level: 'heavy',
      description: 'Церква XVIII століття, серйозно пошкоджена артилерійськими обстрілами.',
      damage_date: '2022-03-15',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПІСЛЯ+ОБСТРІЛУ',
      source_url: 'https://example.com',
      is_verified: false,
      created_at: '2023-01-20T14:30:00Z'
    },
    {
      id: '3',
      title: 'Музей Сковороди, Сковородинівка',
      coordinates: { lat: 49.95, lng: 35.533 },
      region: 'Харківська область',
      city_or_settlement: 'Сковородинівка',
      category: 'museum',
      damage_level: 'destroyed',
      description: 'Національний літературно-меморіальний музей Григорія Сковороди. Зруйнований прямим ракетним ударом вночі.',
      damage_date: '2022-05-01',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/e53e3e/ffffff?text=ПІСЛЯ+РУЙНАЦІЇ',
      source_url: 'https://unesco.org',
      is_verified: true,
      created_at: '2023-02-15T11:00:00Z'
    },
    {
      id: '4',
      title: 'Драмтеатр, Маріуполь',
      coordinates: { lat: 47.096, lng: 37.545 },
      region: 'Донецька область',
      city_or_settlement: 'Маріуполь',
      category: 'culture_house',
      damage_level: 'destroyed',
      description: 'Драматичний театр. Місце, де ховалися сотні мирних жителів. Зруйнований авіабомбою. Символ трагедії міста.',
      damage_date: '2022-03-01',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/e53e3e/ffffff?text=ПІСЛЯ+ТРАГЕДІЇ',
      source_url: 'https://amnesty.org',
      is_verified: true,
      created_at: '2023-03-01T15:00:00Z'
    },
    {
      id: '5',
      title: 'Житловий будинок, Бородянка',
      coordinates: { lat: 50.627, lng: 29.932 },
      region: 'Київська область',
      city_or_settlement: 'Бородянка',
      category: 'monument',
      damage_level: 'partial',
      description: 'Сильно пошкоджений житловий будинок. Має графіті Бенксі, що підвищує його культурну цінність.',
      damage_date: '2022-04-01',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ГРАФІТІ',
      source_url: 'https://cnn.com',
      is_verified: true,
      created_at: '2023-04-01T18:00:00Z'
    },
    {
      id: '6',
      title: 'Музей народного побуту, Охтирка',
      coordinates: { lat: 50.301, lng: 34.896 },
      region: 'Сумська область',
      city_or_settlement: 'Охтирка',
      category: 'museum',
      damage_level: 'heavy',
      description: 'Частково зруйнована експозиція, пошкодження даху від обстрілу.',
      damage_date: '2022-03-05',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПОШКОДЖЕНО',
      source_url: 'https://suspilne.media/sumy',
      is_verified: true,
      created_at: '2023-05-10T09:30:00Z'
    },
    {
      id: '7',
      title: 'Центральна бібліотека, Чернігів',
      coordinates: { lat: 51.493, lng: 31.303 },
      region: 'Чернігівська область',
      city_or_settlement: 'Чернігів',
      category: 'culture_house',
      damage_level: 'heavy',
      description: 'Пошкодження фасаду та книгосховища через авіаудар.',
      damage_date: '2022-03-01',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=РУЙНАЦІЇ',
      source_url: 'https://chernihiv.gov.ua',
      is_verified: true,
      created_at: '2023-06-05T12:00:00Z'
    },
    {
      id: '8',
      title: 'Костел Святого Йосипа, Миколаїв',
      coordinates: { lat: 46.965, lng: 31.996 },
      region: 'Миколаївська область',
      city_or_settlement: 'Миколаїв',
      category: 'church',
      damage_level: 'partial',
      description: 'Вибуховою хвилею вибито вікна та пошкоджено дах.',
      damage_date: '2023-01-15',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПОШКОДЖЕННЯ',
      source_url: 'https://mykolaiv.church.ua',
      is_verified: false,
      created_at: '2023-07-25T16:45:00Z'
    },
    {
      id: '9',
      title: 'Старовинна забудова, Харків (Салтівка)',
      coordinates: { lat: 50.007, lng: 36.230 },
      region: 'Харківська область',
      city_or_settlement: 'Харків',
      category: 'monument',
      damage_level: 'destroyed',
      description: 'Повністю знищені історичні житлові будинки внаслідок масованих обстрілів.',
      damage_date: '2022-03-10',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/e53e3e/ffffff?text=ЗРУЙНОВАНО',
      source_url: 'https://city.kharkiv.ua',
      is_verified: true,
      created_at: '2023-08-01T10:00:00Z'
    },
    {
      id: '10',
      title: 'Музей-садиба Репіна, Чугуїв',
      coordinates: { lat: 49.832, lng: 36.685 },
      region: 'Харківська область',
      city_or_settlement: 'Чугуїв',
      category: 'museum',
      damage_level: 'partial',
      description: 'Пошкоджено територію садиби та допоміжні споруди.',
      damage_date: '2022-03-15',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПОШКОДЖЕННЯ',
      source_url: 'https://repinsky-muzei.com.ua',
      is_verified: false,
      created_at: '2023-09-12T14:30:00Z'
    },
    {
      id: '11',
      title: 'Палац культури "Хімік", Сєвєродонецьк',
      coordinates: { lat: 48.948, lng: 38.487 },
      region: 'Луганська область',
      city_or_settlement: 'Сєвєродонецьк',
      category: 'culture_house',
      damage_level: 'destroyed',
      description: 'Один із найбільших палаців культури в області, повністю знищений в ході бойових дій.',
      damage_date: '2022-05-20',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/e53e3e/ffffff?text=ЗРУЙНОВАНО',
      source_url: 'https://donetsk.ua',
      is_verified: true,
      created_at: '2023-10-01T11:00:00Z'
    },
    {
      id: '12',
      title: 'Свято-Успенський собор, Ізюм',
      coordinates: { lat: 49.215, lng: 37.265 },
      region: 'Харківська область',
      city_or_settlement: 'Ізюм',
      category: 'church',
      damage_level: 'heavy',
      description: 'Пошкоджено центральний купол та дзвіницю.',
      damage_date: '2022-04-10',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПОШКОДЖЕННЯ',
      source_url: 'https://izyum.info',
      is_verified: true,
      created_at: '2023-11-15T15:00:00Z'
    },
    {
      id: '13',
      title: 'Художній музей, Херсон',
      coordinates: { lat: 46.635, lng: 32.618 },
      region: 'Херсонська область',
      city_or_settlement: 'Херсон',
      category: 'museum',
      damage_level: 'heavy',
      description: 'Викрадення колекцій та руйнування частини будівлі.',
      damage_date: '2022-11-01',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=РУЙНАЦІЇ',
      source_url: 'https://herson.online',
      is_verified: true,
      created_at: '2023-12-01T18:00:00Z'
    },
    {
      id: '14',
      title: 'Меморіал Голокосту, Дробицький Яр',
      coordinates: { lat: 49.951, lng: 36.291 },
      region: 'Харківська область',
      city_or_settlement: 'Харків',
      category: 'monument',
      damage_level: 'partial',
      description: 'Пошкоджено меморіальні стели внаслідок обстрілу.',
      damage_date: '2022-03-26',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПОШКОДЖЕНО',
      source_url: 'https://ukrinform.ua',
      is_verified: true,
      created_at: '2024-01-20T10:00:00Z'
    },
    {
      id: '15',
      title: 'Кіноконцертний зал "Ювілейний", Херсон',
      coordinates: { lat: 46.638, lng: 32.628 },
      region: 'Херсонська область',
      city_or_settlement: 'Херсон',
      category: 'culture_house',
      damage_level: 'heavy',
      description: 'Значні пошкодження даху та інтер"єру.',
      damage_date: '2022-12-05',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПОШКОДЖЕНО',
      source_url: 'https://herson.gov.ua',
      is_verified: false,
      created_at: '2024-02-15T12:00:00Z'
    },
    {
      id: '16',
      title: 'Церква Різдва Богородиці, с. Приморське',
      coordinates: { lat: 46.593, lng: 31.902 },
      region: 'Миколаївська область',
      city_or_settlement: 'с. Приморське',
      category: 'church',
      damage_level: 'destroyed',
      description: 'Повністю знищена внаслідок прямого влучання.',
      damage_date: '2022-04-05',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/e53e3e/ffffff?text=ЗРУЙНОВАНО',
      source_url: 'https://mkip.gov.ua',
      is_verified: true,
      created_at: '2024-03-01T14:30:00Z'
    },
    {
      id: '17',
      title: 'Національний музей, Київ',
      coordinates: { lat: 50.45, lng: 30.523 },
      region: 'Київська область',
      city_or_settlement: 'Київ',
      category: 'museum',
      damage_level: 'partial',
      description: 'Пошкодження вікон та фасаду вибуховою хвилею.',
      damage_date: '2022-03-02',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПОШКОДЖЕННЯ',
      source_url: 'https://history.kyiv.ua',
      is_verified: true,
      created_at: '2024-04-01T16:00:00Z'
    },
    {
      id: '18',
      title: 'Палац культури "Азовсталь", Маріуполь',
      coordinates: { lat: 47.114, lng: 37.595 },
      region: 'Донецька область',
      city_or_settlement: 'Маріуполь',
      category: 'culture_house',
      damage_level: 'destroyed',
      description: 'Повністю знищений під час боїв за "Азовсталь".',
      damage_date: '2022-04-01',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/e53e3e/ffffff?text=ЗРУЙНОВАНО',
      source_url: 'https://mariupol.news',
      is_verified: true,
      created_at: '2024-05-10T10:30:00Z'
    },
    {
      id: '19',
      title: 'Памятник "Батьківщина-Мати", Київ',
      coordinates: { lat: 50.422, lng: 30.563 },
      region: 'Київська область',
      city_or_settlement: 'Київ',
      category: 'monument',
      damage_level: 'partial',
      description: 'Технічно неушкоджений, але є потреба в демонтажі радянської символіки.',
      damage_date: '2023-08-01',
      photo_before_url: 'https://placehold.co/600x400/3182ce/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=ПЕРЕОСМИСЛЕННЯ',
      source_url: 'https://mkip.gov.ua',
      is_verified: true,
      created_at: '2024-06-05T13:00:00Z'
    },
    {
      id: '20',
      title: 'Меморіал жертвам Голодомору, Одеса',
      coordinates: { lat: 46.486, lng: 30.732 },
      region: 'Одеська область',
      city_or_settlement: 'Одеса',
      category: 'monument',
      damage_level: 'partial',
      description: 'Пошкоджено уламками ракети. Потребує реставрації.',
      damage_date: '2023-07-23',
      photo_before_url: 'https://placehold.co/600x400/38a169/ffffff?text=ДО+ВІЙНИ',
      photo_after_url: 'https://placehold.co/600x400/f6ad55/ffffff?text=РЕСТАВРАЦІЯ',
      source_url: 'https://odesa.gov.ua',
      is_verified: false,
      created_at: '2024-07-25T17:00:00Z'
    }
  ]
}

function App() {
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadObjects()
  }, [])

  const loadObjects = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('Завантаження даних з Supabase...')

      const data = await heritageAPI.getAllObjects()
      console.log('Отримані дані:', data)

      // Трансформація тут вже відбувається в heritageAPI.getAllObjects()

      setObjects(data)
    } catch (error) {
      console.error('Помилка завантаження даних:', error)
      setError('Не вдалося завантажити дані. Перевірте підключення до Supabase або RLS-політики.')
      // Mock Data проходить через ту саму логіку трансформації
      // як і реальні дані, щоб гарантувати єдиний формат {lat, lng}
      // Викликаємо transformCoordinates на мок-даних для гарантії формату
      const transformedMockData = getMockData().map(transformCoordinates)
      setObjects(transformedMockData)
    } finally {
      setLoading(false)
    }
  }

  const addNewObject = async (objectData) => {
    try {
      const result = await heritageAPI.addObject({
        ...objectData,
        is_verified: false, // Завжди false для нових об'єктів з форми
      })

      if (result.success) {
        // Оновлюємо список об'єктів після успішного додавання
        await loadObjects()
        return { success: true }
      }
      return { success: false, message: 'Невідома помилка при додаванні.' }

    } catch (error) {
      console.error('Помилка додавання обʼєкта:', error)
      // Обробка помилок RLS або бази даних
      const errorMessage = error.message.includes('Row-level security policy')
        ? '⚠️ Помилка RLS. Перевірте, чи дозволено роль "anon" додавати об\'єкти у Supabase.'
        : `Помилка: ${error.message}`

      return { success: false, message: errorMessage }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header onOpenForm={() => setIsFormModalOpen(true)} />

      <main className="flex-grow">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 m-4 rounded">
            <strong>Помилка підключення:</strong> {error}
            <p className="text-sm mt-1">
                Для демонстрації використовуються імітовані дані. Перевірте console.log для деталей.
            </p>
          </div>
        )}

        <Routes>
          <Route path="/" element={
            <MapView
                objects={objects}
                loading={loading}
                onRefresh={loadObjects}
                isFormModalOpen={isFormModalOpen}
            />
          } />
          <Route path="/object/:id" element={
            <DetailView objects={objects} />
          } />
          <Route path="/gallery" element={
            <GalleryView
              objects={objects}
              loading={loading}
            />
          } />
          <Route path="/about" element={
            <AboutView />
          } />
      {/* АДМІНКА */}
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/admin-login" element={<AdminLogin />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <FormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={addNewObject}
      />

        <Footer />
    </div>
  )
}

export default App
