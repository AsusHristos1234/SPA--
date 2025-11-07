import type { Metadata } from 'next'
import Link from 'next/link'
import './globals.css'
import { ArrowUpRight, Menu, ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Product Catalog App',
  description: 'A modern product catalog with favorites and filtering',
}

type RootLayoutProps = {
  children: React.ReactNode
}

type FooterColumn = {
  title: string
  links?: { label: string; href: string }[]
  details?: string[]
}

const footerColumns: FooterColumn[] = [
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
      'Viber: +38 (093) 443-78-45',
      'WhatsApp & Telegram: +38 (067) 923-52-19',
      'Тел.: +38 (044) 451-75-87',
    ],
  },
]

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru" className="scroll-smooth">
      <body
        id="top"
        className="relative flex min-h-screen flex-col bg-slate-950 text-slate-100 antialiased"
      >
        <div className="pointer-events-none fixed inset-0 -z-10">
          <div className="absolute inset-x-0 top-[-10%] h-[500px] bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.25),_rgba(15,23,42,0.75))]" />
          <div className="absolute bottom-[-20%] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-gradient-to-br from-purple-500/20 via-blue-500/10 to-transparent blur-3xl" />
        </div>

        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

function Header() {
  const navigation = [
    { label: 'Каталог', href: '/products' },
    { label: 'Создать товар', href: '/create-product' },
    { label: 'Решения', href: '#' },
    { label: 'Тарифы', href: '#' },
  ]

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-4">
        <Link href="/" className="flex items-center gap-3 text-white">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 text-lg font-semibold">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">market law</span>
            <span className="text-xl font-bold">Marketplace Vision</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-white/70 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="transition-colors hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <button className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white/80 transition-colors hover:border-white/40 hover:text-white">
            Вход для продавцов
          </button>
          <Link
            href="/create-product"
            className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-500 via-sky-500 to-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition-transform hover:translate-y-[-2px] hover:shadow-[0_20px_40px_-20px_rgba(56,189,248,0.8)]"
          >
            Стать партнёром
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </Link>
        </div>

        <button className="inline-flex items-center justify-center rounded-xl border border-white/15 p-2 text-white/70 transition-colors hover:text-white lg:hidden" aria-label="Открыть меню">
          <Menu className="h-5 w-5" />
        </button>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-[#050505] text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-start">
        <Link
          href="#"
          className="inline-flex select-none items-center justify-center rounded-full border border-[#f7931e] bg-[#f7931e] px-10 py-3 text-xs font-semibold uppercase tracking-[0.5em] text-black transition-colors hover:bg-transparent hover:text-[#f7931e] lg:hidden"
        >
          Оставить заявку
        </Link>

        <Link
          href="#"
          className="hidden select-none items-center justify-center rounded-full border border-[#f7931e] bg-[#f7931e] px-3 py-8 text-xs font-semibold uppercase tracking-[0.5em] text-black transition-colors hover:bg-transparent hover:text-[#f7931e] lg:flex [writing-mode:vertical-rl] lg:rotate-180"
        >
          Оставить заявку
        </Link>

        <div className="flex flex-1 flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-[#f7931e]">mobios.school</p>
            <p className="max-w-xs text-sm text-white/70">
              Современная школа дизайна и медиа, где практикующие наставники помогают создавать проекты с первого занятия.
            </p>
          </div>

          <div className="grid flex-1 gap-10 text-sm text-white/70 sm:grid-cols-2 lg:grid-cols-4">
            {footerColumns.map((column) => (
              <div key={column.title} className="space-y-4">
                <h3 className="text-sm font-semibold uppercase tracking-[0.35em] text-[#f7931e]">
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
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© mobios.school 2013–2021 | Все права защищены.</p>
          <p>Разработка и продвижение mobios.ua</p>
        </div>
      </div>
    </footer>
  )
}