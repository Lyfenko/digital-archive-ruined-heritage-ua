import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLocalizedData } from '../hooks/useLocalizedData'

const AdminPanel = () => {
  const [user, setUser] = useState(null)
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const navigate = useNavigate()

  // Підключення i18n
  const { t, i18n } = useTranslation()
  const { getField } = useLocalizedData()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user || user.email !== 'd.lyfenko@gmail.com') { // Твій адмінський email
      await supabase.auth.signOut()
      navigate('/admin-login')
      return
    }

    setUser(user)
    setIsCheckingAuth(false)
    loadObjects()
  }

  const loadObjects = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('objects')
      .select('*')
      .order('created_at', { ascending: false })
    setObjects(data || [])
    setLoading(false)
  }

  const toggleVerified = async (id, current) => {
    await supabase
      .from('objects')
      .update({ is_verified: !current })
      .eq('id', id)
    loadObjects()
  }

  const deleteObject = async (id) => {
    if (!confirm(t('admin.confirm_del', 'Ви впевнені, що хочете видалити цей об\'єкт назавжди?'))) return
    await supabase.from('objects').delete().eq('id', id)
    loadObjects()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-ukr-blue"></div>
      </div>
    )
  }

  const locale = i18n.language.startsWith('en') ? 'en-US' : 'uk-UA'

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Шапка адмінки */}
        <div className="glass-panel bg-white/80 p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('admin.panel', 'Панель модерації')}</h1>
            <p className="text-sm text-slate-500 mt-1">{t('admin.desc', 'Керування базою даних та верифікація звітів')}</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-slate-400 uppercase">{t('admin.admin_role', 'Адміністратор')}</p>
              <p className="text-sm font-medium text-slate-800">{user.email}</p>
            </div>
            <button
              onClick={signOut}
              className="bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 px-5 py-2.5 rounded-xl font-bold transition-colors"
            >
              {t('admin.logout', 'Вийти')}
            </button>
          </div>
        </div>

        {/* Статистика / Фільтри (Опціонально) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">{t('admin.total', 'Всього записів')}</p>
            <p className="text-2xl font-black text-slate-900">{objects.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 font-bold uppercase mb-1">{t('admin.pending', 'Очікують перевірки')}</p>
            <p className="text-2xl font-black text-amber-500">{objects.filter(o => !o.is_verified).length}</p>
          </div>
        </div>

        {/* Список об'єктів */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-400"></div>
          </div>
        ) : (
          <div className="grid gap-4">
            {objects.map((obj) => (
              <div key={obj.id} className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">

                <div className="w-full md:w-auto flex-grow">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-800">{getField(obj, 'title')}</h3>
                    {!obj.is_verified && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {t('admin.new', 'Новий')}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">
                    {getField(obj, 'region')} • {t('admin.added', 'Додано:')} {new Date(obj.created_at).toLocaleDateString(locale)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto shrink-0 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button
                    onClick={() => toggleVerified(obj.id, obj.is_verified)}
                    className={`flex-1 md:flex-none px-4 py-2 rounded-xl text-sm font-bold transition-colors ${
                      obj.is_verified
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-white text-amber-600 border border-amber-200 shadow-sm hover:bg-amber-50'
                    }`}
                  >
                    {obj.is_verified ? t('admin.unapprove', '✓ Зняти статус') : t('admin.approve', 'Підтвердити')}
                  </button>

                  <button
                    onClick={() => navigate(`/object/${obj.id}`)}
                    className="flex-1 md:flex-none text-center bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                  >
                    {t('admin.view', 'Огляд')}
                  </button>

                  <button
                    onClick={() => deleteObject(obj.id)}
                    className="flex-1 md:flex-none text-center bg-white hover:bg-red-50 border border-slate-200 text-red-600 px-4 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm"
                  >
                    {t('admin.delete', 'Видалити')}
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel