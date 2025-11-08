import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Header = ({ onOpenForm }) => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true
    if (path !== '/' && location.pathname.startsWith(path)) return true
    return false
  }

  const navLinks = [
    { to: '/', label: 'Мапа' },
    { to: '/gallery', label: 'Каталог' },
    { to: '/about', label: 'Про проєкт' },
  ]

  return (
    <header className="bg-white shadow-lg p-4 sticky top-0 z-[1000]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl md:text-2xl font-extrabold text-ukr-blue hover:text-ukr-blue/80">
          <span className="text-ukr-yellow text-2xl md:text-3xl mr-1">💥</span>
          Зруйнована Спадщина
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium items-center">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-button border-b-2 border-transparent transition duration-150 p-1 ${
                isActive(link.to)
                  ? 'text-ukr-blue border-ukr-yellow font-bold'
                  : 'text-gray-600 hover:border-ukr-yellow hover:text-ukr-blue'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button
            onClick={onOpenForm}
            className="bg-ukr-blue text-white px-4 py-2 rounded-full hover:bg-ukr-blue/90 transition duration-150 shadow-md font-semibold text-sm"
          >
            Додати об'єкт
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
            <button
                onClick={onOpenForm}
                className="bg-ukr-blue text-white p-2 rounded-full shadow-md text-sm font-semibold"
            >
                + Об'єкт
            </button>
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-ukr-blue p-2 rounded-md hover:bg-gray-100 transition"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}></path>
                </svg>
            </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute left-0 right-0 mt-4 bg-white shadow-xl border-t border-gray-100 z-50">
          <div className="flex flex-col space-y-2 p-4">
            {navLinks.map(link => (
                <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block py-2 text-base font-medium rounded-lg text-center ${
                        isActive(link.to)
                        ? 'bg-ukr-yellow/30 text-ukr-blue'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                >
                    {link.label}
                </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header