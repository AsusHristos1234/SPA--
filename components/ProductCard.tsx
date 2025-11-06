'use client'

import { useRouter } from 'next/navigation'
import { useProductStore } from '@/stores/useProductStore'
import { Heart, Trash2, Edit, Star } from 'lucide-react'
import { Product } from '@/types/product'
import { useState } from 'react'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { toggleLike, deleteProduct } = useProductStore()
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleCardClick = () => {
    router.push(`/products/${product.id}`)
  }

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleLike(product.id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/products/${product.id}`)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this product?')) {
      deleteProduct(product.id)
    }
  }

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      electronics: 'bg-blue-100 text-blue-800',
      clothing: 'bg-purple-100 text-purple-800',
      books: 'bg-green-100 text-green-800',
      home: 'bg-orange-100 text-orange-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div 
      className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 flex flex-col h-full border border-gray-100 overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="relative flex-1">
        <div className="relative h-56 overflow-hidden">
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse"></div>
          )}
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleLike}
            className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
              product.isLiked 
                ? 'bg-red-500 text-white shadow-lg' 
                : 'bg-white/90 text-gray-600 hover:bg-white hover:shadow-lg'
            }`}
          >
            <Heart size={18} fill={product.isLiked ? 'currentColor' : 'none'} />
          </button>
          
          <button
            onClick={handleEdit}
            className="p-2 rounded-full backdrop-blur-sm bg-white/90 text-gray-600 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <Edit size={18} />
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 rounded-full backdrop-blur-sm bg-white/90 text-gray-600 hover:bg-white hover:shadow-lg transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="absolute top-4 left-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-sm font-medium">
            <Star size={14} className="text-yellow-500 fill-current" />
            <span className="text-gray-700">{(Math.random() * 2 + 3).toFixed(1)}</span>
          </div>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1 pr-2 group-hover:text-blue-600 transition-colors">
            {product.title}
          </h3>
          
          {product.price && (
            <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
              ${product.price}
            </div>
          )}
        </div>
        
        <div className="mt-auto space-y-3">
          {product.category && (
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          )}
          
          <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
            {product.description || 'No description available for this amazing product.'}
          </p>
          
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors">
              View Details →
            </button>
            <div className="text-xs text-gray-500">
              ID: {product.id}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}