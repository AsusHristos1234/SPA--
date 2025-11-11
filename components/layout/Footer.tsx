'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import SearchFilter from '@/components/SearchFilter'
import { useProductStore } from '@/stores/useProductStore'

const footerColumns = [
  {
    title: 'О школе',
    links: [
      { label: 'О процессе обучения', href: '#' },
      { label: 'Договор и соглашения', href: '#' },
      { label: 'Отзывы студентов', href: '#' },
      { label: 'Сертификаты и партнёры', href: '#' },
    ],
  },
  {
    title: 'Курсы',
    links: [
      { label: 'UI/UX Web-дизайн', href: '#' },
      { label: 'Front-End', href: '#' },
      { label: 'Дизайн интерьера', href: '#' },
      { label: 'Видеомонтаж & MOTION design', href: '#' },
      { label: 'Графический дизайн', href: '#' },
    ],
  },
  {
    title: 'Время работы',
    details: [
      'Пн – Пт: с 09:00 до 18:00 (GMT +3)',
      'Сб – Вс: консультации по заявке',
    ],
  },
  {
    title: 'Контакты',
    details: [
      'Viber: +8 (888)-888-88-88',
      'WhatsApp & Telegram: +8 (888)-888-88-88',
      'Тел.: +8 (888)-888-88-88',
    ],
  },
] as const

export default function Footer() {
  const setSearchQuery = useProductStore((state) => state.setSearchQuery)
  const setFilters = useProductStore((state) => state.setFilters)

  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const scrollDifference = currentScrollY - lastScrollY

      if (Math.abs(scrollDifference) < 8) {
        return
      }

      if (currentScrollY > lastScrollY && currentScrollY > 120) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      lastScrollY = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4 sm:px-6">
      <footer
        className={`pointer-events-auto w-full max-w-6xl overflow-hidden rounded-3xl border border-white/15 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-out ${
          isVisible ? 'translate-y-0' : 'translate-y-[calc(100%+1.5rem)]'
        }`}
      >
        <div className="flex flex-col gap-8 p-6 lg:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.45em] text-cyan-200/70">
                Поиск по каталогу
              </p>
              <p className="text-sm text-white/60">
                Настройте фильтры и находите нужные товары прямо из футера. Панель автоматически скрывается при прокрутке вниз и возвращается при прокрутке вверх.
              </p>
            </div>

            <Link
              href="https://www.canva.com/ru_ru/obuchenie/shapka-sajta/"
              className="inline-flex select-none items-center justify-center rounded-full border border-[#f7931e] bg-[#f7931e] px-8 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-black transition-colors hover:bg-transparent hover:text-[#f7931e]"
            >
              Оставить заявку
            </Link>
          </div>

          <SearchFilter
            onSearch={setSearchQuery}
            onFilterChange={setFilters}
            className="rounded-3xl border border-white/10 bg-white/5 p-6"
          />

          <div className="grid gap-10 text-sm text-white/70 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.35em] text-[#f7931e]">
                  {column.title}
                </h3>

                {column.links ? (
                  <ul className="space-y-3">
                    {column.links.map(({ href, label }) => (
                      <li key={label}>
                        <a
                          href={href}
                          className="transition-colors hover:text-white"
                        >
                          {label}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {column.details ? (
                  <ul className="space-y-3">
                    {column.details.map((line) => (
                      <li key={line} className="text-white/80">
                        {line}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="flex flex-col gap-4 px-6 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>©2013–2025 | Все права защищены.</p>
            <p>Разработка и продвижение</p>
          </div>
        </div>
      </footer>
    </div>
  )
}