// src/components/AdminLogin.jsx
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [email, setEmail] = useState('admin@heritage.ua')
  const [password, setPassword] = useState('12345678')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    // Спочатку пробуємо увійти
    let { error } = await supabase.auth.signInWithPassword({ email, password })

    // Якщо користувача немає — реєструємо автоматично
    if (error && error.message.includes('Invalid login credentials')) {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin }
      })

      if (signUpError) {
        setMessage('Помилка: ' + signUpError.message)
        setLoading(false)
        return
      }

      setMessage('Адмін створено! Входимо...')
      // Тепер входимо
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) {
        setMessage('Помилка входу: ' + loginError.message)
        setLoading(false)
        return
      }
    }

    if (error) {
      setMessage('Помилка: ' + error.message)
    } else {
      setMessage('Успішно! Переходимо в адмінку...')
      setTimeout(() => navigate('/admin'), 800)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 w-full max-w-md">
        <h1 className="text-4xl font-bold text-ukr-blue dark:text-ukr-yellow text-center mb-8">
          Адмін-панель
        </h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-4 border-2 border-gray-300 rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:border-ukr-blue outline-none transition"
          />
          <input
            type="password"
            placeholder="Пароль (мін. 8 символів)"
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
            {loading ? 'Зачекайте...' : 'Увійти як адмін'}
          </button>
        </form>
        {message && (
          <p className={`mt-6 text-center font-medium ${message.includes('Успішно') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </p>
        )}
        <p className="text-center text-sm text-gray-500 mt-6">
          Перший вхід = автоматична реєстрація<br />
          Email: <code className="bg-gray-200 px-2 rounded">admin@heritage.ua</code>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin