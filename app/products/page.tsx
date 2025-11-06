'use client'

import { useEffect, useState } from 'react'
import { useProductStore } from '@/stores/useProductStore'
import ProductList from '@/components/ProductList'
import SearchFilter from '@/components/SearchFilter'
import Pagination from '@/components/Pagination'
import Link from 'next/link'

export default function ProductsPage() {
  const { 
    initializeProducts, 
    getPaginatedProducts,
    setSearchQuery,
    setFilters 
  } = useProductStore()
  
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const productsPerPage = 12

  useEffect(() => {
    setIsLoading(true)
    fetch('https://jsonplaceholder.typicode.com/photos?_limit=50')
      .then(res => res.json())
      .then(data => {
        initializeProducts(data)
        setIsLoading(false)
      })
  }, [initializeProducts])

  const products = getPaginatedProducts(currentPage, productsPerPage)
  const totalPages = Math.ceil(useProductStore.getState().getFilteredProducts().length / productsPerPage)

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
              <p className="text-gray-600 text-sm">Discover amazing products</p>
            </div>
            <Link 
              href="/create-product"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <SearchFilter 
          onSearch={setSearchQuery}
          onFilterChange={setFilters}
        />
        
        {isLoading ? (
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md p-4 animate-pulse w-80">
                  <div className="bg-gray-300 h-48 rounded-xl mb-4"></div>
                  <div className="bg-gray-300 h-4 rounded mb-2"></div>
                  <div className="bg-gray-300 h-4 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                Showing {products.length} of {useProductStore.getState().getFilteredProducts().length} products
              </div>
              <div className="flex gap-2 text-sm">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  All Products
                </button>
                <button className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full font-medium hover:bg-gray-200">
                  Favorites
                </button>
              </div>
            </div>
            
            <ProductList products={products} />
            
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}