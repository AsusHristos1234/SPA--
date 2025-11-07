"use client";

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
    <div className="flex-1 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_rgba(2,6,23,0.96))] pb-20 pt-12">
      <div className="mx-auto max-w-3xl px-6">
        <Link
          href="/products"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft size={18} />
          Вернуться в каталог
        </Link>

        <div className="space-y-5">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">Новый товар</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Создайте карточку продукта, соответствующую закону маркетплейса</h1>
            <p className="text-sm text-white/60">
              Заполните обязательные поля — мы проверим карточку на соответствие юридическим требованиям, автоматизируем выгрузку и подготовим витрину под продвижение.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-950/70 p-8 shadow-[0_35px_60px_-35px_rgba(8,47,73,0.95)] backdrop-blur">
            <ProductForm onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </div>
  )
}