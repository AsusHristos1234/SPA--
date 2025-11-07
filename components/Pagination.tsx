import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const showPages = 5

    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)

    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <nav className="mt-12 flex justify-center" aria-label="Pagination">
      <ul className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/70 px-2 py-2 shadow-[0_20px_40px_-35px_rgba(56,189,248,0.6)] backdrop-blur">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Предыдущая страница"
          >
            <ChevronLeft size={18} />
          </button>
        </li>

        {getPageNumbers().map((page) => (
          <li key={page}>
            <button
              type="button"
              onClick={() => onPageChange(page)}
              className={`relative inline-flex h-10 min-w-[2.5rem] items-center justify-center rounded-full px-4 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                currentPage === page
                  ? 'bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 text-slate-950 shadow-[0_20px_45px_-30px_rgba(56,189,248,0.7)]'
                  : 'text-white/70 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white'
              }`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Следующая страница"
          >
            <ChevronRight size={18} />
          </button>
        </li>
      </ul>
    </nav>
  )
}