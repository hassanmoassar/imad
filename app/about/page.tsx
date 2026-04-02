'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { containerFade, itemFadeUp } from '@/lib/animations'

const images = [
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.58.jpeg', alt: 'Moroccan Landscape' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59 (1).jpeg', alt: 'Luxury Vehicle Interior' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59 (2).jpeg', alt: 'Coastal View' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59 (3).jpeg', alt: 'Mountain Pass' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59 (4).jpeg', alt: 'Desert Dunes' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.19.02.jpeg', alt: 'Traditional Architecture' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.23.07.jpeg', alt: 'Our Fleet' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 14.19.34 (1).jpeg', alt: 'Moroccan Sunset' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 14.19.34 (2).jpeg', alt: 'City Life' },
]

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        {/* <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/about images/WhatsApp Video 2026-03-30 at 20.19.02.mp4" type="video/mp4" />
        </video> */}
        <div className="absolute inset-0 bg-black/50 z-10" />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6"
          >
            Excellence in <span className="text-amber-500">Every Mile</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-white/90 font-medium"
          >
            Discover the heart of Morocco through premium travel experiences tailored to your desires.
          </motion.p>
        </div>
      </section>

      {/* Our Legacy Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full uppercase tracking-wider">
              Our Legacy
            </div>
            <h2 className="text-4xl font-bold text-neutral-900 leading-tight">
              A Passion for authentic <br /> Moroccan Hospitality
            </h2>
            <p className="text-lg text-neutral-600 leading-relaxed">
              Founded on the principles of integrity and excellence, Morocco Voyages was born from a desire to showcase the hidden gems of our beautiful country. We believe that travel is not just about the destination, but the stories woven along the way.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6">
              <div>
                <h4 className="text-3xl font-bold text-amber-600">10+</h4>
                <p className="text-sm font-medium text-neutral-500 uppercase">Years of Experience</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold text-amber-600">5k+</h4>
                <p className="text-sm font-medium text-neutral-500 uppercase">Happy Travelers</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl"
          >
            <Image 
              src="/about images/WhatsApp Image 2026-03-30 at 20.23.07.jpeg"
              alt="Our Fleet"
              fill
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Visual Journey Section */}
      <section className="py-24 bg-neutral-50 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">A Visual Journey</h2>
          <p className="text-neutral-600 max-w-2xl mx-auto">Take a glimpse into the breathtaking landscapes and premium services that define our work.</p>
        </div>

        <motion.div 
          variants={containerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {images.slice(0, 6).map((img, idx) => (
            <motion.div 
              key={idx}
              variants={itemFadeUp}
              className={`relative rounded-2xl overflow-hidden shadow-lg group ${idx % 3 === 1 ? 'lg:translate-y-12' : ''}`}
            >
              <div className="relative h-80 w-full overflow-hidden">
                <Image 
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <p className="text-white font-medium">{img.alt}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Our Values */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-neutral-900 mb-4">Our Core Values</h2>
          <p className="text-neutral-600">The foundation of everything we do.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { 
              title: "Integrity", 
              desc: "Transparent pricing and honest communication in every interaction.",
              icon: "🤝"
            },
            { 
              title: "Excellence", 
              desc: "From our premium fleet to our expert guides, we never settle for less.",
              icon: "✨"
            },
            { 
              title: "Hospitality", 
              desc: "Experience the warmth of Moroccan culture through our dedicated team.",
              icon: "🍵"
            }
          ].map((value, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="p-8 rounded-3xl bg-neutral-50 border border-neutral-100 hover:shadow-xl transition-shadow"
            >
              <div className="text-4xl mb-6">{value.icon}</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">{value.title}</h3>
              <p className="text-neutral-600 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
