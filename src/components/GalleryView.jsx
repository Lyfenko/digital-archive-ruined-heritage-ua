import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'

const GalleryView = ({ objects, loading }) => {
  const [page, setPage] = useState(1)
  const PER_PAGE = 12

  const filteredObjects = useMemo(() => objects, [objects])
  const totalPages = Math.ceil(filteredObjects.length / PER_PAGE)
  const paginated = filteredObjects.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const shareObject = (obj) => {
    const text = `Зруйнована спадщина: ${obj.title} — ${window.location.origin}/object/${obj.id}`
    if (navigator.share) {
      navigator.share({ title: obj.title, text, url: `${window.location.origin}/object/${obj.id}` })
    } else {
      navigator.clipboard.writeText(text)
      alert('Посилання скопійовано!')
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-extrabold mb-6 text-ukr-blue dark:text-ukr-yellow">Каталог</h1>

      {loading ? (
        <div className="text-center p-10">Завантаження...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginated.map(obj => (
              <div key={obj.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border-t-4"
                   style={{ borderTopColor: obj.damage_level === 'destroyed' ? '#E53E3E' : obj.damage_level === 'heavy' ? '#F6AD55' : '#3182CE' }}>
                <Link to={`/object/${obj.id}`}>
                  <div className="relative group">
                    <img src={obj.photo_after_url} alt={obj.title}
                         className="w-full h-64 object-cover group-hover:scale-105 transition"/>
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-lg font-bold">Переглянути</span>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <h4 className="font-bold text-lg line-clamp-2 dark:text-white">{obj.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{obj.region}</p>
                  <button onClick={() => shareObject(obj)}
                          className="mt-2 text-ukr-blue text-sm hover:underline">
                    Поділитися
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Пагінація */}
          <div className="flex justify-center gap-2 mt-10">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i+1} onClick={() => setPage(i+1)}
                      className={`px-4 py-2 rounded-lg ${page === i+1 ? 'bg-ukr-blue text-white' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {i+1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
export default GalleryView