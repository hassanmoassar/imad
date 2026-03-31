'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { CarIcon, DesertIcon, PalaceIcon } from './Icons'
import { containerFade, itemFadeUp } from '@/lib/animations'

const services = [
  {
    id: 1,
    icon: <CarIcon />,
    category: 'Transfers',
    title: 'Premium Transfers',
    description: 'Luxury vehicle transfers with professional drivers for seamless door-to-door transportation between airports, hotels, and cities.',
    slug: 'transfers',
    color: 'from-amber-50 to-orange-50',
    accent: 'text-amber-600',
    border: 'border-amber-200',
    hoverBorder: 'hover:border-amber-400',
    iconBg: 'bg-amber-100',
  },
  {
    id: 2,
    icon: <DesertIcon />,
    category: 'Excursions',
    title: 'Desert Excursions',
    description: 'Unforgettable day trips and guided desert experiences with camel trekking, dune rides, and authentic Berber night camps.',
    slug: 'excursions',
    color: 'from-rose-50 to-red-50',
    accent: 'text-rose-600',
    border: 'border-rose-200',
    hoverBorder: 'hover:border-rose-400',
    iconBg: 'bg-rose-100',
  },
  {
    id: 3,
    icon: <PalaceIcon />,
    category: 'Circuits',
    title: 'Tour Circuits',
    description: 'Multi-day curated circuits across Morocco — exploring historic medinas, imperial palaces, and authentic Moroccan heritage.',
    slug: 'tour-circuits',
    color: 'from-blue-50 to-cyan-50',
    accent: 'text-blue-600',
    border: 'border-blue-200',
    hoverBorder: 'hover:border-blue-400',
    iconBg: 'bg-blue-100',
  },
]

export default function Services() {
  return (
    <section id="services" className="py-24 bg-gradient-to-b from-white to-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            ✨ Our Offerings
          </span>
          <h2 className="text-5xl md:text-6xl font-bold text-neutral-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Tailored travel solutions designed to make your Moroccan journey seamless and truly memorable.
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          variants={containerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10"
        >
          {services.map((service) => (
            <Link key={service.id} href={`/services/${service.slug}`} className="block h-full group">
              <motion.div
                variants={itemFadeUp}
                whileHover={{ y: -12, boxShadow: '0 24px 48px rgba(0, 0, 0, 0.12)' }}
                className={`h-full p-8 lg:p-10 bg-gradient-to-br ${service.color} rounded-2xl border ${service.border} ${service.hoverBorder} transition-all duration-300 flex flex-col`}
              >
                {/* Category tag */}
                <span className={`self-start text-xs font-bold uppercase tracking-widest ${service.accent} mb-4`}>
                  {service.category}
                </span>

                {/* Icon */}
                <div className={`w-14 h-14 mb-6 rounded-xl ${service.iconBg} flex items-center justify-center ${service.accent} group-hover:scale-110 transition-transform duration-300`}>
                  {service.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold text-neutral-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed mb-8 flex-grow">
                  {service.description}
                </p>

                {/* Arrow link */}
                <div className={`inline-flex items-center gap-2 ${service.accent} font-semibold group-hover:gap-3 transition-all duration-300`}>
                  <span>View All</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
