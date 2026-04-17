'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface Testimonial {
  id: string
  customer_name: string
  rating: number
  comment: string
}

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from('reviews')
        .select('id, customer_name, rating, comment')
        .eq('status', 'approved')
        .order('rating', { ascending: false })
        .limit(5)
      
      if (data && data.length > 0) {
        setTestimonials(data)
      } else {
        // Fallback sample data if no reviews approved
        setTestimonials([
          { id: 's1', customer_name: 'Sarah Johnson', rating: 5, comment: 'The Sahara tour was absolutely life-changing. Everything from the camels to the luxury camp was perfect.' },
          { id: 's2', customer_name: 'Jean Dupont', rating: 5, comment: 'Excellent transfer service. The driver was punctual and the car was very comfortable.' },
          { id: 's3', customer_name: 'Maria Garcia', rating: 4, comment: 'Ouzoud waterfalls excursion was beautiful. Our guide was very knowledgeable.' }
        ])
      }
    }
    fetch()
  }, [])

  const next = () => setActiveIndex((prev) => (prev + 1) % testimonials.length)
  const prev = () => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  if (testimonials.length === 0) return null

  return (
    <section className="py-24 bg-neutral-900 overflow-hidden relative">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] -ml-48 -mb-48" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Guests Say</h2>
          <div className="flex justify-center gap-1 mb-4">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-5 h-5 text-amber-500 fill-amber-500" />
            ))}
          </div>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Real stories from travelers who explored the magic of Morocco with us.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Slider */}
          <div className="overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 p-8 md:p-16 rounded-[2rem] shadow-2xl">
            <Quote className="w-12 h-12 text-primary mb-8" />
            
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              <p className="text-xl md:text-2xl text-white font-medium italic leading-relaxed">
                &quot;{testimonials[activeIndex].comment}&quot;
              </p>
              
              <div className="pt-6 border-t border-white/10">
                <h4 className="text-lg font-bold text-white mb-1">{testimonials[activeIndex].customer_name}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-primary font-bold uppercase tracking-widest">Verified Traveler</span>
                  <div className="flex text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} size={12} fill={s <= testimonials[activeIndex].rating ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={next}
              className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-full border border-white/10 transition-all"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 transition-all rounded-full ${i === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-white/20'}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
