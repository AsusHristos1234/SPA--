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
    <div className="mb-8 space-y-4">
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-gray-700 shadow-sm hover:shadow-md"
          />
        </div>
        
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="px-6 py-4 bg-white border border-gray-200 rounded-2xl hover:shadow-md transition-all duration-200 flex items-center gap-3 text-gray-700 font-medium"
        >
          <SlidersHorizontal size={20} />
          Filters
          {filters.category !== 'all' || filters.showLiked || filters.priceRange[1] < 1000 ? (
            <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
              !
            </span>
          ) : null}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 shadow-lg space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>
            <button
              onClick={clearFilters}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2 font-medium transition-colors"
            >
              <X size={16} />
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Category
              </label>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => handleFilterChange('category', cat.value)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${
                      filters.category === cat.value
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-transparent'
                    }`}
                  >
                    <span className="text-lg">{cat.emoji}</span>
                    <span className="font-medium">{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Price Range: <span className="text-blue-600">${filters.priceRange[0]} - ${filters.priceRange[1]}</span>
              </label>
              <div className="bg-gray-50 p-4 rounded-xl">
                <input
                  type="range"
                  min="0"
                  max="1000"
                  value={filters.priceRange[1]}
                  onChange={(e) => handleFilterChange('priceRange', [0, parseInt(e.target.value)])}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>$0</span>
                  <span>$1000</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <label className="flex items-center cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={filters.showLiked}
                    onChange={(e) => handleFilterChange('showLiked', e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-14 h-7 rounded-full transition-colors duration-200 ${
                    filters.showLiked ? 'bg-red-500' : 'bg-gray-300'
                  }`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-200 ${
                    filters.showLiked ? 'transform translate-x-7' : ''
                  }`}></div>
                </div>
                <span className="ml-3 text-gray-700 font-medium group-hover:text-gray-900 transition-colors">
                  Show liked only ❤️
                </span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}