import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  uk: {
    translation: {
      header: { map: "Мапа", gallery: "Каталог", about: "Про проєкт", support: "Підтримати", add_object: "Додати об'єкт", heritage: "ЗРУЙНОВАНА СПАДЩИНА" },
      footer: { desc: "Цифровий архів культурних пам’яток України, пошкоджених або знищених внаслідок російської агресії.", dev: "Розроблено з душею", rights: "Всі права захищено", win: "Україна переможе", support: "Підтримати проєкт", glory: "Слава Україні!", heroes: "Героям слава!", github: "GitHub проєкту", love_1: "З любов’ю до України", love_2: "та вірою в її відновлення" },
      map: { nav: "Навігація", search: "Пошук (назва, регіон)...", update: "Оновити", found: "Знайдено:", empty: "Нічого не знайдено", legend: "Ступінь руйнування", l_dest: "Втрачено архітектуру", l_heavy: "Критичний стан", l_part: "Потребує реставрації", more: "Детальніше" },
      gallery: { title: "Каталог об'єктів", subtitle: "Задокументовані втрати культурної спадщини", total: "Всього записів:", verified: "Верифіковано", moderation: "На модерації", copied: "Посилання скопійовано!" },
      detail: { back: "Повернутися", before: "До руйнування", after: "Після руйнування", date: "Дата фіксації:", history: "Історія об'єкта та опис втрат", source: "Офіційне джерело", verified: "Дані верифіковано", moderation: "Очікує модерації", space: "Віртуальний простір", model: "3D-модель (в розробці)", gps: "Координати GPS", not_found: "Об'єкт не знайдено." },

      // 👇 ОНОВЛЕНО СЕКЦІЮ ABOUT ТУТ (UK)
      about: {
        title: "Про проєкт",
        subtitle: "Зруйнована Спадщина України",
        p1: "Цей цифровий архів є частиною дипломної роботи (Master of Science in Computer Science), спрямованої на вирішення проблеми централізованої фіксації культурних втрат внаслідок військової агресії.",
        goals: "Ключові цілі",
        mem: "Меморіалізація",
        mem_d: "Збереження пам'яті про втрачені об'єкти культурної спадщини для майбутніх поколінь.",
        trans: "Прозорість",
        trans_d: "Надання верифікованих даних міжнародним організаціям, дослідникам та громадськості.",
        vis: "Візуалізація",
        vis_d: "Створення інтерактивної мапи для кращого розуміння масштабів руйнувань.",
        hum: "Гуманітаристика",
        hum_d: "Впровадження сучасних веб-технологій (GIS, React, Supabase) для соціальних завдань.",
        tech: "Технологічний стек",
        backend: "Бекенд та дані",
        student: "Студент-розробник",
        author: "Лифенко Дмитро Миколайович",
        advisor_title: "Науковий керівник",
        advisor: "проф. Тетяна Тарасович",
        data: "Дані",
        data_sources: "МКІП, ЮНЕСКО, відкриті медіа-джерела"
      },

      form: { title: "Новий об'єкт", subtitle: "Додайте інформацію про пам'ятку", cancel: "Скасувати", submit: "Надіслати звіт", processing: "Опрацювання...", labels: { title: "Назва об'єкта *", coords: "Координати *", region: "Область *", city: "Місто / Село *", cat: "Категорія *", dmg: "Ступінь пошкодження *", date: "Дата пошкодження", desc: "Опис", photo_b: "Фото 'ДО'", photo_a: "Фото 'ПІСЛЯ'", url: "АБО ПОСИЛАННЯ", source: "Офіційне джерело (URL) *" } },
      enums: {
        cat: { all: "Усі категорії", church: "Сакральна споруда", museum: "Музей / Галерея", culture_house: "Культура / Театр", monument: "Пам'ятка / Меморіал", castle: "Замок / Фортеця", other: "Інше" },
        dmg: { all: "Усі руйнації", destroyed: "Повністю знищено", heavy: "Сильно пошкоджено", partial: "Частково пошкоджено" }
      },
      admin: { login_title: "Вхід для адміністратора", wait: "Зачекайте...", enter: "Увійти", panel: "Панель модерації", desc: "Керування базою даних", logout: "Вийти", total: "Всього записів", pending: "Очікують перевірки", new: "Новий", added: "Додано:", approve: "Підтвердити", unapprove: "Зняти статус", view: "Огляд", delete: "Видалити", confirm_del: "Видалити назавжди?" },
      notfound: { title: "Сторінку не знайдено", desc: "Можливо, об'єкт ще не додано або видалено.", btn: "Повернутися на мапу" }
    }
  },
  en: {
    translation: {
      header: { map: "Map", gallery: "Catalog", about: "About", support: "Support", add_object: "Add Object", heritage: "RUINED HERITAGE" },
      footer: { desc: "Digital archive of cultural monuments of Ukraine damaged or destroyed as a result of Russian aggression.", dev: "Developed with soul", rights: "All rights reserved", win: "Ukraine will win", support: "Support Project", glory: "Glory to Ukraine!", heroes: "Glory to the Heroes!", github: "Project GitHub", love_1: "With love for Ukraine", love_2: "and faith in its restoration" },
      map: { nav: "Navigation", search: "Search (name, region)...", update: "Refresh", found: "Found:", empty: "Nothing found", legend: "Damage Level", l_dest: "Architecture lost", l_heavy: "Critical condition", l_part: "Needs restoration", more: "Details" },
      gallery: { title: "Objects Catalog", subtitle: "Documented cultural heritage losses", total: "Total records:", verified: "Verified", moderation: "Moderation", copied: "Link copied!" },
      detail: { back: "Go back", before: "Before destruction", after: "After destruction", date: "Recorded date:", history: "Object history & damage details", source: "Official source", verified: "Verified data", moderation: "Pending moderation", space: "Virtual Space", model: "3D model (in dev)", gps: "GPS Coordinates", not_found: "Object not found." },

      // 👇 ОНОВЛЕНО СЕКЦІЮ ABOUT ТУТ (EN)
      about: {
        title: "About Project",
        subtitle: "Ruined Heritage of Ukraine",
        p1: "This digital archive is part of a thesis (Master of Science in Computer Science) aimed at solving the problem of centralized registration of cultural losses due to military aggression.",
        goals: "Key Goals",
        mem: "Memorialization",
        mem_d: "Preserving the memory of lost cultural heritage objects for future generations.",
        trans: "Transparency",
        trans_d: "Providing verified data to international organizations, researchers, and the public.",
        vis: "Visualization",
        vis_d: "Creating an interactive map for a better understanding of the scale of destruction.",
        hum: "Humanities",
        hum_d: "Implementation of modern web technologies (GIS, React, Supabase) for social tasks.",
        tech: "Tech Stack",
        backend: "Backend & Data",
        student: "Student Developer",
        author: "Dmytro Lyfenko",
        advisor_title: "Scientific Advisor",
        advisor: "Prof. Tetiana Tarasovych",
        data: "Data Sources",
        data_sources: "MCIP, UNESCO, open media sources"
      },

      form: { title: "New Object", subtitle: "Add information about a monument", cancel: "Cancel", submit: "Submit report", processing: "Processing...", labels: { title: "Object Title *", coords: "Coordinates *", region: "Region *", city: "City / Village *", cat: "Category *", dmg: "Damage level *", date: "Damage date", desc: "Description", photo_b: "Photo 'BEFORE'", photo_a: "Photo 'AFTER'", url: "OR LINK", source: "Official source (URL) *" } },
      enums: {
        cat: { all: "All categories", church: "Sacred building", museum: "Museum / Gallery", culture_house: "Culture House", monument: "Monument", castle: "Castle", other: "Other" },
        dmg: { all: "All damages", destroyed: "Destroyed", heavy: "Heavily damaged", partial: "Partially damaged" }
      },
      admin: { login_title: "Admin Login", wait: "Please wait...", enter: "Login", panel: "Moderation Panel", desc: "Database management", logout: "Logout", total: "Total records", pending: "Pending verification", new: "New", added: "Added:", approve: "Approve", unapprove: "Revoke status", view: "View", delete: "Delete", confirm_del: "Delete permanently?" },
      notfound: { title: "Page not found", desc: "Perhaps the object has not been added yet or was deleted.", btn: "Return to map" }
    }
  }
};

i18n.use(LanguageDetector).use(initReactI18next).init({ resources, fallbackLng: 'uk', interpolation: { escapeValue: false } });
export default i18n;