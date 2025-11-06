'use client'

import { useRouter } from 'next/navigation'
import { useProductStore } from '@/stores/useProductStore'
import ProductForm from '@/components/ProductForm'
import { ProductFormData } from '@/types/product'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function CreateProduct() {
  const router = useRouter()
  const { addProduct } = useProductStore()

  const handleSubmit = (data: ProductFormData) => {
    addProduct(data)
    router.push('/products')
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4"> {/* 👈 Убрал container, добавил max-w-2xl */}
        <Link 
          href="/products"
          className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to products
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Product</h1>
          <p className="text-gray-600 mb-8">Fill in the details to create a new product</p>
          
          <ProductForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}