'use client'

import { motion } from 'framer-motion'
import { Trophy, ShieldCheck, Headphones, Star, Users } from 'lucide-react'
import { containerFade, itemFadeUp } from '@/lib/animations'

const features = [
  {
    icon: <ShieldCheck className="w-8 h-8" />,
    title: 'No Deposit Required',
    description: "Book with zero upfront cost — pay when you're ready to travel.",
  },
  {
    icon: <Headphones className="w-8 h-8" />,
    title: '24/7 Support',
    description: 'Round-the-clock customer support in English, French, and Arabic.',
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: '4.9 Star Rated',
    description: 'Over 500 verified reviews — travellers consistently rate us excellent.',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Expert Local Guides',
    description: 'Knowledgeable, licensed local guides passionate about Moroccan culture.',
  },
]

export default function Features() {
  return (
    <section id="about" className="py-24 bg-neutral-900 text-white relative overflow-hidden">
      {/* Subtle background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 text-white/80 rounded-full text-sm font-semibold uppercase tracking-wide mb-4">
            <Trophy className="w-4 h-4 text-primary" /> Why Choose Us
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Morocco Voyages?
          </h2>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Experience Morocco with the leading luxury travel company
          </p>
        </motion.div>

        {/* Features 4-column grid */}
        <motion.div
          variants={containerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemFadeUp}
              whileHover={{ scale: 1.03, y: -4 }}
              className="p-8 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 hover:border-primary/40 transition-all duration-300 group flex flex-col items-center text-center"
            >
              {/* Icon */}
              <div className="text-primary mb-5 p-3 bg-white/10 rounded-xl group-hover:bg-primary/20 transition-colors duration-300">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-black uppercase tracking-wider mb-3 text-white">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-400 text-sm leading-relaxed group-hover:text-neutral-300 transition-colors">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
