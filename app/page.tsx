'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import TourSections from '@/components/TourSections'
import Features from '@/components/Features'
import CTABanner from '@/components/CTABanner'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-secondary via-primary to-accent flex items-center justify-center z-50"
        exit={{ opacity: 0 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-white border-t-transparent rounded-full"
        />
      </motion.div>
    )
  }

  return (
    <>
      <Header />
      <Hero />
      <TourSections />
      <Features />
      <CTABanner />
      <Contact />
      <Footer />
    </>
  )
}
