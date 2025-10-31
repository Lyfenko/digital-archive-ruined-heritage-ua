import { Link, useLocation } from 'react-router-dom'

const Header = ({ onOpenForm }) => {
  const location = useLocation()

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  return (
    <header className="bg-white shadow-lg p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-extrabold text-ukr-blue hover:text-ukr-blue/80">
          <span className="text-ukr-yellow text-3xl mr-1">💥</span>
          Зруйнована Спадщина
        </Link>

        <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
          <Link
            to="/"
            className={`nav-button border-b-2 border-transparent transition duration-150 p-1 ${
              isActive('/')
                ? 'text-ukr-blue border-ukr-yellow'
                : 'text-gray-600 hover:border-ukr-yellow'
            }`}
          >
            Мапа
          </Link>
          <Link
            to="/gallery"
            className={`nav-button border-b-2 border-transparent transition duration-150 p-1 ${
              isActive('/gallery')
                ? 'text-ukr-blue border-ukr-yellow'
                : 'text-gray-600 hover:border-ukr-yellow'
            }`}
          >
            Каталог
          </Link>
          <Link
            to="/about"
            className={`nav-button border-b-2 border-transparent transition duration-150 p-1 ${
              isActive('/about')
                ? 'text-ukr-blue border-ukr-yellow'
                : 'text-gray-600 hover:border-ukr-yellow'
            }`}
          >
            Про проєкт
          </Link>
          <button
            onClick={onOpenForm}
            className="bg-ukr-blue text-white px-5 py-2 rounded-full hover:bg-ukr-blue/90 transition duration-150 shadow-md font-semibold"
          >
            Додати об'єкт
          </button>
        </nav>

        {/* Mobile Menu Button */}
        {/* Мобільне меню реалізовано тут не повністю, але кнопка присутня */}
        <button
            onClick={onOpenForm}
            className="md:hidden bg-ukr-blue text-white p-2 rounded-full shadow-md"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </button>
      </div>
    </header>
  )
}

export default Header
