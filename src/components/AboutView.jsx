const AboutView = () => {
  return (
    <div className="max-w-4xl mx-auto p-4 md:p-10 bg-white rounded-xl shadow-lg border-t-8 border-ukr-yellow">
      <h1 className="text-3xl font-extrabold mb-6 text-ukr-blue">
        Про проєкт "Зруйнована Спадщина України"
      </h1>

      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          Цей цифровий архів є частиною дипломної роботи (Master of Science in Computer Science),
          спрямованої на вирішення проблеми централізованої фіксації культурних втрат внаслідок
          військової агресії.
        </p>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Ключові цілі:</h2>
          <ul className="list-disc list-inside ml-4 space-y-3">
            <li>
              <strong>Меморіалізація:</strong> Збереження пам'яті про втрачені об'єкти культурної
              спадщини для майбутніх поколінь.
            </li>
            <li>
              <strong>Інформаційна прозорість:</strong> Надання верифікованих даних міжнародним
              організаціям, дослідникам та громадськості.
            </li>
            <li>
              <strong>Візуалізація втрат:</strong> Створення інтерактивної мапи для кращого
              розуміння масштабів руйнувань.
            </li>
            <li>
              <strong>Цифровий туризм:</strong> Створення основи для AR/VR-маршрутів та
              віртуальних відновлень у майбутньому.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Технології:</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-ukr-blue mb-2">Фронтенд:</h3>
              <ul className="list-disc list-inside ml-4 text-sm">
                <li>React.js - сучасна бібліотека для користувацьких інтерфейсів</li>
                <li>Leaflet - інтерактивні карти з відкритим кодом</li>
                <li>Tailwind CSS - утилітарний CSS фреймворк</li>
                <li>React Router - навігація між сторінками</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-ukr-blue mb-2">Бекенд:</h3>
              <ul className="list-disc list-inside ml-4 text-sm">
                <li>Supabase - Backend-as-a-Service платформа</li>
                <li>PostgreSQL - реляційна база даних</li>
                <li>PostGIS - розширення для геопросторових даних</li>
                <li>REST API - програмний інтерфейс для доступу до даних</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-ukr-blue mb-2">Принципи роботи:</h3>
          <ul className="list-disc list-inside ml-4 text-sm space-y-1">
            <li>Всі дані проходять верифікацію перед публікацією</li>
            <li>Відкритий код проєкту доступний на GitHub</li>
            <li>Застосунок адаптований для мобільних пристроїв</li>
            <li>Підтримується українська та англійська мови</li>
          </ul>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          <strong>Технічна реалізація:</strong> React.js, Leaflet, Supabase, PostgreSQL, PostGIS
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Студент:</strong> Лифенко Дмитро Миколайович
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Науковий керівник:</strong> проф. Олена Іванько
        </p>
        <p className="text-sm text-gray-500 mt-4">
          Neoversity • Master of Science in Computer Science • 2025
        </p>
      </div>
    </div>
  )
}

export default AboutView