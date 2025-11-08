import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const AdminPanel = () => {
  const [user, setUser] = useState(null)
  const [objects, setObjects] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      navigate('/admin-login')
      return
    }
    setUser(user)
    loadObjects()
  }

  const loadObjects = async () => {
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
    if (!confirm('Видалити назавжди?')) return
    await supabase.from('objects').delete().eq('id', id)
    loadObjects()
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-ukr-blue dark:text-ukr-yellow">Адмін-панель</h1>
            <p className="text-gray-600 dark:text-gray-400">Вітаємо, {user.email}</p>
          </div>
          <button onClick={signOut} className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
            Вийти
          </button>
        </div>

        {loading ? (
          <p>Завантаження...</p>
        ) : (
          <div className="grid gap-4">
            {objects.map(obj => (
              <div key={obj.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{obj.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {obj.region} • {new Date(obj.created_at).toLocaleDateString('uk')}
                  </p>
                  <p className="text-xs mt-1">
                    Автор: {obj.reporter_id ? 'користувач' : 'ти (SQL)'}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleVerified(obj.id, obj.is_verified)}
                    className={`px-4 py-2 rounded-lg font-semibold transition ${
                      obj.is_verified
                        ? 'bg-green-600 text-white'
                        : 'bg-yellow-500 text-black hover:bg-yellow-600'
                    }`}
                  >
                    {obj.is_verified ? 'Верифіковано' : 'На модерації'}
                  </button>

                  <button
                    onClick={() => navigate(`/object/${obj.id}`)}
                    className="text-ukr-blue hover:underline"
                  >
                    Переглянути
                  </button>

                  <button
                    onClick={() => deleteObject(obj.id)}
                    className="text-red-600 hover:text-red-800 font-bold"
                  >
                    Видалити
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