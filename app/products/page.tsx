'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'

import ProductList from '@/components/ProductList'
import Pagination from '@/components/Pagination'
import { useProductStore } from '@/stores/useProductStore'
import type { Product } from '@/types/product'

export default function ProductsPage() {
  const { initializeProducts } = useProductStore()
  const favoritesCount = useProductStore((state) => state.favorites?.length ?? 0)
  const filteredProducts = useProductStore((state) => state.getFilteredProducts())
  const totalFiltered = filteredProducts.length

  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const productsPerPage = 12

  useEffect(() => {
    const controller = new AbortController()
    let isMounted = true

    const fetchProducts = async () => {
      const existingProducts = useProductStore.getState().products

      if (existingProducts.length > 0) {
        if (isMounted) {
          setIsLoading(false)
        }
        return
      }

      if (isMounted) {
        setIsLoading(true)
        setError(null)
      }

      try {
        const response = await fetch('/api/products', { signal: controller.signal })

        if (!response.ok) {
          throw new Error('Failed to load products')
        }

        const data: Product[] = await response.json()

        if (isMounted) {
          initializeProducts(data)
        }
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') {
          return
        }

        console.error('Error fetching products', err)

        if (isMounted) {
          setError('Не удалось загрузить товары. Попробуйте обновить страницу позже.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
      controller.abort()
    }
  }, [initializeProducts])

  const totalPages = Math.max(1, Math.ceil(totalFiltered / productsPerPage))

  useEffect(() => {
    setCurrentPage((prev) => (prev > totalPages ? totalPages : prev))
  }, [totalPages])

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage
    return filteredProducts.slice(start, start + productsPerPage)
  }, [currentPage, filteredProducts, productsPerPage])

  return (
    <div className="flex-1 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.12),_rgba(2,6,23,0.95))] pb-20">
      <div className="relative mx-auto max-w-6xl px-6 pt-16">
        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-8 backdrop-blur xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200/70">Каталог</p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">Управляйте товарами и продавайте по новым стандартам маркетплейса</h1>
            <p className="text-sm text-slate-300">
              Синхронизируйте ассортимент, запускайте кампании и отслеживайте показатели. Каталог обновляется в реальном времени и соответствует требованиям закона о маркетплейсах.
            </p>
          </div>
          <Link
            href="/create-product"
            className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-[0_20px_45px_-25px_rgba(56,189,248,0.8)] transition-transform hover:translate-y-[-2px]"
          >
            Добавить продукт
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          </Link>
        </div>

        <div className="flex flex-col gap-10">
          {isLoading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-3xl border border-white/10 bg-slate-900/60 p-6"
                >
                  <div className="mb-4 h-40 rounded-2xl bg-slate-700/60" />
                  <div className="mb-2 h-4 rounded-full bg-slate-700/60" />
                  <div className="h-4 w-2/3 rounded-full bg-slate-700/60" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-8 text-center text-sm text-rose-100">
              <p>{error}</p>
            </div>
          ) : (
            <>
              <div className="flex flex-col gap-6 rounded-3xl border border-white/5 bg-white/5 p-6 text-sm text-white/70 backdrop-blur-lg sm:flex-row sm:items-center sm:justify-between">
                <div>
                  Найдено {totalFiltered} товаров · страница {currentPage} из {totalPages}
                </div>
                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white">
                    Все товары
                  </button>
                  <Link
                    href="/favorites"
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/30 hover:text-white"
                  >
                    Избранное
                    {favoritesCount > 0 && (
                      <span className="rounded-full bg-gradient-to-r from-rose-500 to-orange-400 px-2 py-0.5 text-[0.65rem] font-semibold text-slate-950">
                        {favoritesCount}
                      </span>
                    )}
                  </Link>
                  <button className="rounded-full border border-white/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-white/60 transition-colors hover:border-white/30 hover:text-white">
                    Новинки
                  </button>
                </div>
              </div>

              {totalFiltered === 0 ? (
                <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/20 bg-white/5 p-10 text-center text-white/60">
                  <span className="text-5xl">🔍</span>
                  <p className="text-base font-semibold text-white/80">По вашему запросу ничего не найдено</p>
                  <p className="max-w-md text-sm text-white/60">
                    Попробуйте изменить условия поиска или сбросить фильтры в плавающем футере, чтобы увидеть все доступные товары каталога.
                  </p>
                </div>
              ) : (
                <ProductList products={paginatedProducts} />
              )}

              {totalFiltered > 0 && totalPages > 1 && (
                <div className="flex justify-center">
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
    </div>
  )
}