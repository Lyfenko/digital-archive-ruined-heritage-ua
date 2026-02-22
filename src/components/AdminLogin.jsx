import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AdminLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  // Підключення i18n
  const { t } = useTranslation()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Тільки логін, ніякого signUp
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setMessage(t('admin.login_error', 'Помилка входу: перевірте email та пароль'))
      setLoading(false)
      return
    }

    setMessage(t('admin.login_success', 'Успішний вхід!'))
    navigate('/admin')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border-t-8 border-ukr-blue">
        <h2 className="text-3xl font-black mb-8 text-center text-gray-900 dark:text-white">
          {t('admin.login_title', 'Вхід для адміністратора')}
        </h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder={t('admin.email', 'Email')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 border-2 border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:border-ukr-blue outline-none transition"
          />
          <input
            type="password"
            placeholder={t('admin.password', 'Пароль')}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 border-2 border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:border-ukr-blue outline-none transition"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ukr-blue hover:bg-ukr-blue/90 text-white py-4 rounded-xl font-bold text-lg shadow-lg disabled:opacity-50 transition transform hover:scale-105"
          >
            {loading ? t('admin.wait', 'Зачекайте...') : t('admin.enter', 'Увійти')}
          </button>
        </form>

        {message && (
          <p className={`mt-6 text-center font-medium ${message === t('admin.login_success', 'Успішний вхід!') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  )
}

export default AdminLogin