// src/components/Footer.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const navigate = useNavigate()
  const [showSalute, setShowSalute] = useState(false)
  const { t } = useTranslation();

  const handleLogoClick = (e) => {
    e.preventDefault()
    if (window.location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      navigate('/')
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100)
    }
  }

  const triggerSalute = () => {
    setShowSalute(true)
    setTimeout(() => setShowSalute(false), 4500) // 4.5 секунди анімації
  }

  return (
    <>
      {/* ЕПІЧНИЙ САЛЮТ ПРИ КЛІКУ */}
      {showSalute && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          {/* Фоновий спалах */}
          <div className="absolute inset-0 bg-white/10 animate-ping"></div>

          {/* Синьо-жовті феєрверки */}
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 rounded-full animate-ping ${
                i % 2 === 0 ? 'bg-ukr-yellow' : 'bg-ukr-blue'
              } shadow-2xl`}
              style={{
                top: `${10 + Math.random() * 80}%`,
                left: `${5 + Math.random() * 90}%`,
                animationDelay: `${i * 0.1}s`,
                boxShadow: i % 2 === 0
                  ? '0 0 30px 10px #FFD700'
                  : '0 0 30px 10px #0057B8',
              }}
            />
          ))}

          {/* Великі зірки-спалахи */}
          {[...Array(6)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute text-ukr-yellow text-6xl font-black animate-bounce"
              style={{
                top: `${20 + i * 15}%`,
                left: `${10 + i * 15}%`,
                animationDelay: `${0.3 + i * 0.2}s`,
                filter: 'drop-shadow(0 0 20px #FFD700)',
              }}
            >
            </div>
          ))}

          {/* Напис "Слава Україні!" */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-6xl md:text-8xl font-black text-ukr-yellow drop-shadow-2xl animate-pulse">
                {t('footer.glory', 'Слава Україні!')}
              </p>
              <p className="text-4xl md:text-6xl font-black text-white mt-4 animate-pulse animation-delay-500">
                {t('footer.heroes', 'Героям слава!')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ФУТЕР */}
      <footer className="bg-ukr-blue text-white mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">

            {/* 1. Про проєкт */}
            <div>
              <button onClick={handleLogoClick} className="group text-left block focus:outline-none">
                <h3 className="text-2xl font-black tracking-tight mb-2 group-hover:text-ukr-yellow transition">
                  {t('header.heritage')}
                </h3>
              </button>

              <p className="text-white/80 text-sm leading-relaxed">
                {t('footer.desc')}
              </p>

              <div className="mt-6">
                <a
                  href="https://github.com/Lyfenko/digital-archive-ruined-heritage-ua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-white/70 hover:text-ukr-yellow transition text-sm"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span>{t('footer.github', 'GitHub проєкту')}</span>
                </a>
              </div>
            </div>

            {/* 2. Розробник → LinkedIn */}
            <div className="flex flex-col items-center md:items-start">
              <p className="text-xs uppercase tracking-widest text-white/60 mb-3">
                {t('footer.dev')}
              </p>
              <a
                href="https://www.linkedin.com/in/dmytro-lyfenko"
                target="_blank"
                rel="noopener noreferrer"
                // Збільшено ширину до 300px
                className="block group w-full max-w-[300px]"
              >
                {/* Зменшено padding до px-6 */}
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-5 border border-white/20 shadow-xl text-center md:text-left transition-all group-hover:bg-white/20 group-hover:scale-105">
                  {/* Додано клас whitespace-nowrap */}
                  <p className="text-2xl font-black text-ukr-yellow group-hover:drop-shadow-lg transition whitespace-nowrap">
                    Дмитро Лифенко
                  </p>
                  <p className="text-white/90 text-sm mt-1">
                    Neoversity Woolf
                  </p>
                </div>
              </a>

              {/* ДОДАНА КНОПКА ПІДТРИМКИ */}
              <a
                href="https://send.monobank.ua/jar/3CkgiNtqFv"
                target="_blank"
                rel="noopener noreferrer"
                // Також збільшено ширину кнопки
                className="mt-4 w-full max-w-[300px] bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:border-ukr-yellow/50 text-white text-center py-2.5 rounded-2xl text-sm font-semibold transition-all hover:scale-105 shadow-md flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-ukr-yellow animate-pulse"></span>
                {t('footer.support')}
              </a>
            </div>

            {/* 3. Україна переможе → САЛЮТ! */}
            <div className="text-center md:text-right">
              <button
                onClick={triggerSalute}
                className="text-3xl font-black text-ukr-yellow mb-3 hover:scale-110 transition-transform inline-block cursor-pointer"
              >
                {t('footer.win')}
              </button>

              <p className="text-xs text-white/70">
                © {new Date().getFullYear()} {t('header.heritage')}<br />
                {t('footer.rights')}
              </p>
              <p className="text-xs text-white/60 mt-6 italic">
                {t('footer.love_1', 'З любов’ю до України')}<br />
                {t('footer.love_2', 'та вірою в її відновлення')}
              </p>
            </div>
          </div>

          <div className="mt-10 h-1 bg-gradient-to-r from-ukr-blue via-ukr-yellow to-ukr-blue rounded-full opacity-80"></div>
        </div>
      </footer>
    </>
  )
}