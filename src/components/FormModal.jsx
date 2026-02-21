import { useState } from 'react'
import { heritageAPI } from '../lib/supabase' // Імпортуємо наше API для фото

const FormModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '', coordinates: '', region: '', city_or_settlement: '',
    category: 'culture_house', damage_level: 'destroyed', damage_date: '',
    description: '', photo_before_url: '', photo_after_url: '', source_url: ''
  })

  // Додаємо стейт для самих файлів
  const [files, setFiles] = useState({
    before: null,
    after: null
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
    { value: 'destroyed', label: 'Повністю зруйновано' },
    { value: 'heavy', label: 'Сильно пошкоджено' },
    { value: 'partial', label: 'Частково пошкоджено' },
  ]

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleFileChange = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      setFiles(prev => ({ ...prev, [type]: file }))
    }
  }

  const handleClose = () => {
    setFormData({ title: '', coordinates: '', region: '', city_or_settlement: '', category: 'culture_house', damage_level: 'destroyed', damage_date: '', description: '', photo_before_url: '', photo_after_url: '', source_url: '' })
    setFiles({ before: null, after: null })
    setMessage('')
    onClose()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const coordsMatch = formData.coordinates.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/)
      if (!coordsMatch) throw new Error('Формат координат: широта, довгота (напр. 50.45, 30.52)')

      // Перевіряємо, чи є хоча б фото або посилання
      if (!files.before && !formData.photo_before_url) throw new Error('Додайте фото "ДО" (файл або посилання)')
      if (!files.after && !formData.photo_after_url) throw new Error('Додайте фото "ПІСЛЯ" (файл або посилання)')

      let finalBeforeUrl = formData.photo_before_url
      let finalAfterUrl = formData.photo_after_url

      setMessage('Завантаження фотографій...')

      // Якщо користувач вибрав файли — завантажуємо їх у Storage
      if (files.before) {
        finalBeforeUrl = await heritageAPI.uploadImage(files.before)
      }
      if (files.after) {
        finalAfterUrl = await heritageAPI.uploadImage(files.after)
      }

      setMessage('Збереження даних об\'єкта...')

      const objectData = {
        ...formData,
        photo_before_url: finalBeforeUrl,
        photo_after_url: finalAfterUrl,
        coordinates: { lat: parseFloat(coordsMatch[1]), lng: parseFloat(coordsMatch[2]) }
      }

      const result = await onSubmit(objectData)

      if (result.success) {
        setMessage('✓ Об\'єкт успішно додано! Очікуйте модерацію.')
        setTimeout(handleClose, 2000)
      } else {
        setMessage(result.message || 'Помилка при відправці')
      }
    } catch (err) {
      setMessage(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-ukr-blue/20 focus:border-ukr-blue transition-all shadow-sm text-sm outline-none"
  const labelClass = "block text-xs font-bold uppercase tracking-wide text-slate-500 mb-1.5 ml-1"

  return (
    <>
      <div className="fixed inset-0 bg-slate-900/60 z-[9998] backdrop-blur-sm transition-opacity" onClick={handleClose} />

      <div className="fixed inset-x-4 top-10 bottom-8 z-[9999] flex items-start justify-center overflow-y-auto custom-scrollbar py-6">
        <div className="bg-white rounded-[2rem] shadow-[0_20px_40px_rgb(0,0,0,0.1)] border border-slate-100 w-full max-w-3xl mx-auto my-auto animate-in fade-in zoom-in-95 duration-300">

          <div className="flex justify-between items-center p-8 border-b border-slate-100">
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Новий об'єкт</h2>
              <p className="text-sm text-slate-500 mt-1">Додайте інформацію про зруйновану пам'ятку</p>
            </div>
            <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div><label className={labelClass}>Назва об'єкта *</label><input type="text" name="title" value={formData.title} onChange={handleChange} required className={inputClass} placeholder="Церква Різдва Богородиці" /></div>
              <div><label className={labelClass}>Координати *</label><input type="text" name="coordinates" value={formData.coordinates} onChange={handleChange} required className={`${inputClass} font-mono`} placeholder="50.4501, 30.5234" /></div>
              <div><label className={labelClass}>Область *</label><input type="text" name="region" value={formData.region} onChange={handleChange} required className={inputClass} placeholder="Київська область" /></div>
              <div><label className={labelClass}>Місто / Село *</label><input type="text" name="city_or_settlement" value={formData.city_or_settlement} onChange={handleChange} required className={inputClass} placeholder="Ірпінь" /></div>

              <div>
                <label className={labelClass}>Категорія *</label>
                <select name="category" value={formData.category} onChange={handleChange} required className={inputClass}>
                  {categories.map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
              </div>

              <div>
                <label className={labelClass}>Ступінь пошкодження *</label>
                <select name="damage_level" value={formData.damage_level} onChange={handleChange} required className={inputClass}>
                  {damageLevels.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

              <div className="md:col-span-2"><label className={labelClass}>Дата пошкодження</label><input type="date" name="damage_date" value={formData.damage_date} onChange={handleChange} className={inputClass} /></div>
              <div className="md:col-span-2"><label className={labelClass}>Опис</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3" className={inputClass} placeholder="Коротка інформація про об'єкт та обставини руйнування..." /></div>

              {/* БЛОК ФОТО "ДО" */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className={labelClass}>Фото "ДО"</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'before')}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-ukr-blue file:text-white hover:file:bg-ukr-blue/90 cursor-pointer mb-3"
                />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-300"></div></div>
                  <div className="relative flex justify-center"><span className="bg-slate-50 px-2 text-[10px] uppercase font-bold text-slate-400">АБО ПОСИЛАННЯ</span></div>
                </div>
                <input type="url" name="photo_before_url" value={formData.photo_before_url} onChange={handleChange} disabled={!!files.before} className={`${inputClass} mt-3 ${files.before ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="https://..." />
              </div>

              {/* БЛОК ФОТО "ПІСЛЯ" */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <label className={labelClass}>Фото "ПІСЛЯ"</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'after')}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-red-500 file:text-white hover:file:bg-red-600 cursor-pointer mb-3"
                />
                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true"><div className="w-full border-t border-slate-300"></div></div>
                  <div className="relative flex justify-center"><span className="bg-slate-50 px-2 text-[10px] uppercase font-bold text-slate-400">АБО ПОСИЛАННЯ</span></div>
                </div>
                <input type="url" name="photo_after_url" value={formData.photo_after_url} onChange={handleChange} disabled={!!files.after} className={`${inputClass} mt-3 ${files.after ? 'opacity-50 cursor-not-allowed' : ''}`} placeholder="https://..." />
              </div>

              <div className="md:col-span-2"><label className={labelClass}>Офіційне джерело (URL) *</label><input type="url" name="source_url" value={formData.source_url} onChange={handleChange} required className={inputClass} placeholder="Посилання на новину чи звіт" /></div>
            </div>

            {message && <p className={`text-center text-sm font-bold p-4 rounded-xl border ${message.includes('✓') ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : message.includes('Завантаження') ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-red-50 text-red-700 border-red-200'}`}>{message}</p>}

            <div className="flex gap-4 pt-4 border-t border-slate-100">
              <button type="button" onClick={handleClose} className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl font-bold transition-colors">
                Скасувати
              </button>
              <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition shadow-md hover:shadow-lg disabled:opacity-50">
                {isSubmitting ? 'Опрацювання...' : 'Надіслати звіт'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default FormModal