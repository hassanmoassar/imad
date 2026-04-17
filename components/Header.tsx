'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { MenuIcon } from './Icons'

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const menuItems = [
    { href: '/programs', label: 'Programs' },
    { href: '/#experiences', label: 'Experiences' },
    { href: '/about', label: 'About' },
    { href: '/#contact', label: 'Contact' },
  ]

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-neutral-200'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer"
            >
              <h1 className={`text-xl sm:text-2xl font-bold transition-colors duration-200 ${
                isScrolled ? 'text-neutral-900' : 'text-white'
              }`}>
                Morocco Voyages
              </h1>
            </motion.div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <motion.span
                  whileHover={{ color: '#C9A961' }}
                  className={`text-sm font-medium transition-colors duration-200 cursor-pointer ${
                    isScrolled
                      ? 'text-neutral-600 hover:text-neutral-900'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </motion.span>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors duration-200"
            >
              Book Now
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors duration-200 ${
              isScrolled
                ? 'text-neutral-900 hover:bg-neutral-100'
                : 'text-white hover:bg-white/10'
            }`}
            aria-label="Toggle menu"
          >
            <MenuIcon />
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden bg-white border-t border-neutral-100 shadow-xl rounded-b-2xl overflow-hidden"
            >
              <div className="px-6 py-6 space-y-4">
                {menuItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <motion.span
                      onClick={() => setIsMobileMenuOpen(false)}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className="block px-4 py-3 text-base font-semibold text-neutral-800 hover:text-primary hover:bg-neutral-50 rounded-xl transition-all cursor-pointer"
                    >
                      {item.label}
                    </motion.span>
                  </Link>
                ))}
                <div className="pt-4 border-t border-neutral-100">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-4 bg-neutral-900 text-white text-base font-bold rounded-xl hover:bg-neutral-800 transition-all shadow-lg"
                  >
                    Book Now
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  )
}
