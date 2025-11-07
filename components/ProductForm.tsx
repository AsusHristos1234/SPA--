'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ProductFormData } from '@/types/product'

const productSchema = z.object({
   
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  price: z.number().min(1, 'Price must be greater than 0'),
  category: z.string().min(1, 'Category is required'),
  url: z.string().url('Must be a valid URL'),
  thumbnailUrl: z.string().url('Must be a valid URL')
})

interface ProductFormProps {
  initialData?: Partial<ProductFormData>
  onSubmit: (data: ProductFormData) => void
  isEditing?: boolean
}

export default function ProductForm({ initialData, onSubmit, isEditing = false }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Название товара *
          </label>
          <input
            {...register('title')}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/60 focus:outline-none"
            placeholder="Например, Умная колонка MarketSound"
          />
          {errors.title && (
            <p className="text-xs text-rose-300">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Цена *
          </label>
          <input
            type="number"
            {...register('price', { valueAsNumber: true })}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/60 focus:outline-none"
            placeholder="Укажите стоимость"
          />
          {errors.price && (
            <p className="text-xs text-rose-300">{errors.price.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Описание *
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/60 focus:outline-none"
          placeholder="Опишите преимущества, материалы, логистику и гарантию"
        />
        {errors.description && (
          <p className="text-xs text-rose-300">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Категория *
          </label>
          <select
            {...register('category')}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-400/60 focus:outline-none"
          >
            <option value="" className="bg-slate-900 text-white">Выберите категорию</option>
            <option value="electronics" className="bg-slate-900 text-white">Электроника</option>
            <option value="clothing" className="bg-slate-900 text-white">Одежда</option>
            <option value="books" className="bg-slate-900 text-white">Книги</option>
            <option value="home" className="bg-slate-900 text-white">Дом и интерьер</option>
          </select>
          {errors.category && (
            <p className="text-xs text-rose-300">{errors.category.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
            Ссылка на изображение *
          </label>
          <input
            {...register('thumbnailUrl')}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/60 focus:outline-none"
            placeholder="https://"
          />
          {errors.thumbnailUrl && (
            <p className="text-xs text-rose-300">{errors.thumbnailUrl.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
          Публичная ссылка на товар *
        </label>
        <input
          {...register('url')}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-cyan-400/60 focus:outline-none"
          placeholder="https://"
        />
        {errors.url && (
          <p className="text-xs text-rose-300">{errors.url.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-1 hover:shadow-[0_25px_50px_-25px_rgba(56,189,248,0.8)] disabled:opacity-60"
      >
        {isSubmitting ? 'Сохраняем…' : isEditing ? 'Обновить продукт' : 'Создать продукт'}
      </button>
    </form>
  )
}