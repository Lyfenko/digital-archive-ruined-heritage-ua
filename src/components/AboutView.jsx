import React from 'react'

const AboutView = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 mb-12 mt-8">
      <div className="glass-panel bg-white/80 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-8 md:p-12 overflow-hidden relative">
        {/* Декоративний фон */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-ukr-yellow/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-ukr-blue/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-black mb-8 text-slate-900 tracking-tight leading-tight">
            Про проєкт <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-ukr-blue to-blue-600">Зруйнована Спадщина України</span>
          </h1>

          <div className="space-y-8 text-slate-600 leading-relaxed text-lg">
            <p className="font-medium text-slate-700 text-xl">
              Цей цифровий архів є частиною дипломної роботи (Master of Science in Computer Science),
              спрямованої на вирішення проблеми централізованої фіксації культурних втрат внаслідок
              військової агресії.
            </p>

            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-6 tracking-tight">Ключові цілі</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">🏛️ Меморіалізація</h3>
                  <p className="text-sm">Збереження пам'яті про втрачені об'єкти культурної спадщини для майбутніх поколінь.</p>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">🔍 Прозорість</h3>
                  <p className="text-sm">Надання верифікованих даних міжнародним організаціям, дослідникам та громадськості.</p>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">🗺️ Візуалізація</h3>
                  <p className="text-sm">Створення інтерактивної мапи для кращого розуміння масштабів руйнувань.</p>
                </div>
                <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-slate-900 mb-2">💻 Гуманітаристика</h3>
                  <p className="text-sm">Впровадження сучасних веб-технологій (GIS, React, Supabase) для соціальних завдань.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-black text-ukr-blue mb-4">Технологічний стек</h3>
                <ul className="space-y-3 text-sm font-medium">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-ukr-blue"></div> React.js (Frontend)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-ukr-blue"></div> Leaflet & GeoJSON (Картографія)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-ukr-blue"></div> Tailwind CSS (Стилізація)</li>
                </ul>
              </div>
              <div className="p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <h3 className="font-black text-slate-900 mb-4">Бекенд та дані</h3>
                <ul className="space-y-3 text-sm font-medium">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> Supabase (BaaS)</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> PostgreSQL & PostGIS</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div> REST API</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Студент-розробник</p>
              <p className="text-sm font-bold text-slate-900">Лифенко Дмитро Миколайович</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Науковий керівник</p>
              <p className="text-sm font-bold text-slate-900">проф. Тетяна Тарасович</p>
            </div>
            <div className="md:text-right">
              <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-1">Дані</p>
              <p className="text-sm font-medium text-slate-600 max-w-xs">МКІП, ЮНЕСКО, відкриті медіа-джерела</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutView