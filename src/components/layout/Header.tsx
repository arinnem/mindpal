'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navigation = [
  { name: 'Trang chủ', href: '/' },
  { name: 'Tâm sự mỏng', href: '/tam-su-mong' },
  { name: 'Hình dáng tôi', href: '/hinh-dang-toi' },
  { name: 'Khám phá', href: '/kham-pha' },
  { name: 'Hỗ trợ', href: '/ho-tro' },
]

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-warm-linen/80 backdrop-blur-sm border-b border-accent-warm-light/20">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Global">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-be-vietnam font-semibold text-warm-charcoal">
                Bạn thương
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`text-sm font-medium transition-colors duration-200
                  ${pathname === item.href
                    ? 'text-soft-clay'
                    : 'text-warm-charcoal hover:text-accent-warm'
                  }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-warm-charcoal hover:text-accent-warm focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent-warm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Mở menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <div className="space-y-1 px-4 pb-3 pt-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block rounded-md px-3 py-2 text-base font-medium
                    ${pathname === item.href
                      ? 'bg-accent-warm-light text-warm-charcoal'
                      : 'text-warm-charcoal hover:bg-accent-warm-light/50'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
} 