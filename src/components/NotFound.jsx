import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-ukr-blue dark:text-ukr-yellow">404</h1>
        <p className="text-2xl mt-4 text-gray-700 dark:text-gray-300">
          {t('notfound.title', 'Сторінку не знайдено')}
        </p>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          {t('notfound.desc', "Можливо, об'єкт ще не додано або видалено.")}
        </p>
        <Link to="/" className="mt-8 inline-block bg-ukr-blue text-white px-8 py-3 rounded-full hover:bg-ukr-blue/90 transition">
          {t('notfound.btn', 'Повернутися на мапу')}
        </Link>
      </div>
    </div>
  )
}

export default NotFound