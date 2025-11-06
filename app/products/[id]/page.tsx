'use client'

import { useParams, useRouter } from 'next/navigation'
import { useProductStore } from '@/stores/useProductStore'
import { ArrowLeft, Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

export default function ProductDetail() {
  const params = useParams()
  const router = useRouter()
  const { products, toggleLike } = useProductStore()
  const [product, setProduct] = useState<any>(null)

  useEffect(() => {
    const foundProduct = products.find(p => p.id === Number(params.id))
    setProduct(foundProduct)
  }, [params.id, products])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-600">Product not found</div>
          <button 
            onClick={() => router.push('/products')}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Back to products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => router.push('/products')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to products
          </button>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="md:flex">
              <div className="md:flex-1">
                <img
                  src={product.url || product.thumbnailUrl}
                  alt={product.title}
                  className="w-full h-96 object-cover"
                />
              </div>
              
              <div className="md:flex-1 p-8">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
                  <button
                    onClick={() => toggleLike(product.id)}
                    className={`p-2 rounded-full ${
                      product.isLiked 
                        ? 'bg-red-500 text-white' 
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    }`}
                  >
                    <Heart size={24} fill={product.isLiked ? 'currentColor' : 'none'} />
                  </button>
                </div>

                {product.price && (
                  <div className="text-4xl font-bold text-green-600 mb-4">
                    ${product.price}
                  </div>
                )}

                {product.category && (
                  <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                    {product.category}
                  </span>
                )}

                <div className="prose max-w-none mb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {product.description || 'No description available for this product.'}
                  </p>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div>Product ID: {product.id}</div>
                  <div>Status: <span className="text-green-600">In Stock</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}