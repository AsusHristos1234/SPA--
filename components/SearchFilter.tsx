'use client'

import { useState, useEffect } from 'react'
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react'

interface SearchFilterProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: any) => void
}

export default function SearchFilter({ onSearch, onFilterChange }: SearchFilterProps) {
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: [0, 1000] as [number, number],
    showLiked: false
  })

  useEffect(() => {
    onSearch(search)
  }, [search, onSearch])

  const handleFilterChange = (key: string, value: any) => {
       const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const clearFilters = () => {
    const defaultFilters = {
      category: 'all',
      priceRange: [0, 1000] as [number, number],
      showLiked: false
    }
    setFilters(defaultFilters)
    setSearch('')
    onFilterChange(defaultFilters)
  }

  const categories = [
    { value: 'all', label: 'All Categories', emoji: '🛍️' },
    { value: 'electronics', label: 'Electronics', emoji: '📱' },
    { value: 'clothing', label: 'Clothing', emoji: '👕' },
    { value: 'books', label: 'Books', emoji: '📚' },
    { value: 'home', label: 'Home', emoji: '🏠' }
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Найдите товары по названию, категории или ID"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-12 py-4 text-sm text-white placeholder:text-white/40 shadow-[0_20px_40px_-30px_rgba(59,130,246,0.8)] backdrop-blur focus:border-cyan-400/60 focus:outline-none focus:ring-0"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-semibold text-white/70 transition-colors hover:border-white/30 hover:text-white"
        >
          <SlidersHorizontal size={20} />
          Расширенный фильтр
          {filters.category !== 'all' || filters.showLiked || filters.priceRange[1] < 1000 ? (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-sky-500 to-cyan-400 text-xs font-semibold text-slate-950">
              •
            </span>
          ) : null}
        </button>
      </div>

      {showFilters && (
        <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-[0_35px_60px_-45px_rgba(8,47,73,0.9)] backdrop-blur-lg">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-white">Настройте подборку</h3>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
            >
              <X size={16} />
              Сбросить
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                Категории
              </label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleFilterChange('category', cat.value)}
                    className={`group flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm transition-all ${
                      filters.category === cat.value
                        ? 'border-cyan-400/60 bg-cyan-500/10 text-white'
                        : 'border-white/5 bg-white/5 text-white/70 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
                Диапазон цены
              </label>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>${filters.priceRange[0]}</span>
                  <span>${filters.priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="mt-4 w-full appearance-none rounded-full bg-slate-800 accent-cyan-400 [@supports(color:color(display-p3_1_1_1))]:accent-[color(display-p3_0.2_0.8_1)]"
                />
                <div className="mt-3 text-xs text-white/50">Соответствует требованиям минимальной публичной оферты</div>
              </div>
            </div>

            <div className="flex items-center">
              <label className="group flex w-full cursor-pointer items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-5 py-6 transition-colors hover:border-white/30">
                <div className="relative h-8 w-14">
                  <input
                    type="checkbox"
                    checked={filters.showLiked}
                    onChange={(e) => handleFilterChange('showLiked', e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="absolute inset-0 rounded-full bg-slate-800 transition-colors peer-checked:bg-gradient-to-r peer-checked:from-rose-500 peer-checked:to-orange-400" />
                  <div className="absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-transform peer-checked:translate-x-6" />
                </div>
                <span className="text-sm font-semibold text-white/70 group-hover:text-white">
                  Показывать избранные
                  <span className="mt-1 block text-xs font-normal text-white/40">Ускоряйте продажи топовых SKU</span>
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}