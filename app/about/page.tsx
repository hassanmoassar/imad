'use client'

import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Sparkles, Coffee } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { containerFade, itemFadeUp } from '@/lib/animations'

const images = [
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.58.jpeg', alt: 'Golden Desert Dunes' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59 (1).jpeg', alt: 'Premium Travel Comfort' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59 (2).jpeg', alt: 'Coastal Serenity' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59 (3).jpeg', alt: 'High Atlas Pass' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59 (4).jpeg', alt: 'Sahara Magic' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.18.59.jpeg', alt: 'Sunset over Dunes' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.19.02.jpeg', alt: 'Arched Architecture' },
  { src: '/about images/WhatsApp Image 2026-03-30 at 20.23.07.jpeg', alt: 'Our Premium Fleet' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 14.19.34 (1).jpeg', alt: 'Vibrant Medina' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 14.19.34 (2).jpeg', alt: 'Blue City Charm' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 14.19.34.jpeg', alt: 'Majestic Mountains' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 14.19.35 (1).jpeg', alt: 'Traditional Textures' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 14.19.35.jpeg', alt: 'Golden Hour' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 15.53.15 (1).jpeg', alt: 'Luxury Journey' },
  { src: '/about images/WhatsApp Image 2026-03-31 at 15.53.15.jpeg', alt: 'Authentic Experiences' },
]

const values = [
  { 
    title: "Integrity", 
    desc: "Transparent pricing and honest communication in every interaction.",
    icon: ShieldCheck,
    color: "from-amber-500/20 to-transparent"
  },
  { 
    title: "Excellence", 
    desc: "From our premium fleet to our expert guides, we never settle for less.",
    icon: Sparkles,
    color: "from-blue-500/20 to-transparent"
  },
  { 
    title: "Hospitality", 
    desc: "Experience the warmth of Moroccan culture through our dedicated team.",
    icon: Coffee,
    color: "from-emerald-500/20 to-transparent"
  }
]

export default function AboutPage() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  })

  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 200])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const smoothHeroY = useSpring(heroY, { stiffness: 100, damping: 30 })

  return (
    <main ref={containerRef} className="min-h-screen bg-[#FAF8F5]">
      <Header />

      {/* Modern Immersive Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div 
          style={{ y: smoothHeroY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src={images[12].src}
            alt="Moroccan Landscape"
            fill
            className="object-cover brightness-[0.7]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#FAF8F5]" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 pt-20">
          <motion.div
            variants={containerFade}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div variants={itemFadeUp} className="mb-6 inline-flex items-center gap-3">
               <span className="h-[2px] w-12 bg-amber-500" />
               <span className="text-amber-500 font-semibold tracking-widest uppercase text-sm font-sans">Crafting Journeys Since 2014</span>
            </motion.div>
            <motion.h1 
              variants={itemFadeUp}
              className="text-6xl md:text-8xl font-bold text-white mb-8 leading-[1.1]"
            >
              Excellence in <br />
              <span className="italic font-serif text-amber-500">Every Mile</span>
            </motion.h1>
            <motion.p 
              variants={itemFadeUp}
              className="text-xl md:text-2xl text-white/90 max-w-2xl leading-relaxed font-light"
            >
              Discover the heart of Morocco through premium travel experiences tailored to your desires. We transform transportation into a seamless part of your adventure.
            </motion.p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/60"
        >
          <span className="text-xs uppercase tracking-[0.3em] font-medium font-sans">Discover More</span>
          <motion.div 
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* Asymmetrical Narrative Section */}
      <section className="py-32 px-6 overflow-hidden">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 relative space-y-12">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-4xl md:text-6xl font-bold text-neutral-900 leading-tight mb-8">
                  A Passion for <br /> Authentic Moroccan <br /> 
                  <span className="text-amber-600 italic font-serif">Hospitality</span>
                </h2>
                <div className="flex gap-8 mb-10">
                   <div className="space-y-1">
                      <span className="text-4xl font-bold text-neutral-900">10+</span>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold font-sans">Years Experience</p>
                   </div>
                   <div className="w-[1px] h-12 bg-neutral-200" />
                   <div className="space-y-1">
                      <span className="text-4xl font-bold text-neutral-900">5k+</span>
                      <p className="text-xs text-neutral-500 uppercase tracking-widest font-bold font-sans">Happy Clients</p>
                   </div>
                </div>
                <p className="text-lg text-neutral-600 leading-relaxed max-w-md">
                  Morocco Voyages was born from a desire to showcase the hidden gems of our beautiful country. We believe that travel is not just about the destination, but the stories woven along the way.
                </p>
              </motion.div>
            </div>

            <div className="lg:col-span-7 relative h-[600px]">
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="absolute top-0 right-0 w-[70%] h-[70%] rounded-[2rem] overflow-hidden shadow-2xl z-20"
              >
                <Image 
                  src={images[7].src}
                  alt={images[7].alt}
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 1.1, x: -50 }}
                whileInView={{ opacity: 1, scale: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="absolute bottom-0 left-0 w-[55%] h-[55%] rounded-[2rem] overflow-hidden shadow-2xl border-[10px] border-[#FAF8F5] z-30"
              >
                <Image 
                  src={images[6].src}
                  alt={images[6].alt}
                  fill
                  className="object-cover"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
                className="absolute top-[20%] left-[10%] w-[40%] h-[40%] rounded-[2rem] overflow-hidden shadow-2xl border-[8px] border-[#FAF8F5] z-10"
              >
                <Image 
                  src={images[14].src}
                  alt={images[14].alt}
                  fill
                  className="object-cover"
                />
              </motion.div>
              {/* Decorative element */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-amber-500/10 rounded-full -z-10 animate-spin-slow" />
            </div>
          </div>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-24">
             <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-amber-600 font-bold tracking-[.3em] uppercase text-sm mb-6 font-sans"
             >
               Our Philosophy
             </motion.p>
             <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="text-4xl md:text-5xl font-bold text-neutral-900 leading-tight"
             >
               Building foundations on trust, <br className="hidden md:block" /> beauty, and unparalleled service.
             </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, idx) => {
              const IconComponent = v.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className={`p-10 rounded-[2.5rem] bg-neutral-50/50 backdrop-blur-xl border border-neutral-100 hover:border-amber-200/50 transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className={`absolute -right-8 -top-8 w-32 h-32 rounded-full blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br ${v.color}`} />
                  <div className="mb-10 text-amber-600">
                    <IconComponent size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-4">{v.title}</h3>
                  <p className="text-neutral-600 leading-relaxed">{v.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Bento Grid Gallery 2.0 - Expanded */}
      <section className="py-32 bg-[#FAF8F5]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
             <div className="max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-6 font-serif italic text-primary">The Visual Journey</h2>
                <p className="text-neutral-600 text-lg">A curated collection of moments that define our vision of Morocco. From the golden dunes to the pulsing heart of the medinas.</p>
             </div>
             <Link href="/programs" className="group flex items-center gap-4 text-amber-600 font-bold uppercase tracking-widest text-sm hover:text-amber-700 transition-colors font-sans leading-none">
                Explore Destinations
                <motion.span 
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
             </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-6 md:auto-rows-[250px]">
             {/* Row 1 */}
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-3 md:row-span-2 relative rounded-[2.5rem] overflow-hidden group shadow-2xl">
               <Image src={images[0].src} alt={images[0].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
               <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
               <div className="absolute bottom-10 left-10 text-white z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                  <h4 className="text-3xl font-bold">{images[0].alt}</h4>
               </div>
             </motion.div>
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-3 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-xl">
               <Image src={images[1].src} alt={images[1].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             </motion.div>
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-1 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-xl">
               <Image src={images[2].src} alt={images[2].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             </motion.div>
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-2 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-xl">
               <Image src={images[3].src} alt={images[3].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             </motion.div>

             {/* Row 2 */}
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-2 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-xl">
               <Image src={images[4].src} alt={images[4].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             </motion.div>
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-2 md:row-span-2 relative rounded-[2.5rem] overflow-hidden group shadow-xl">
               <Image src={images[5].src} alt={images[5].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             </motion.div>
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-2 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-xl">
               <Image src={images[8].src} alt={images[8].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             </motion.div>
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-2 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-xl">
               <Image src={images[9].src} alt={images[9].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             </motion.div>
             <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="md:col-span-2 md:row-span-1 relative rounded-[2.5rem] overflow-hidden group shadow-xl">
               <Image src={images[13].src} alt={images[13].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
             </motion.div>
          </div>
        </div>
      </section>

      {/* Moments of Morocco Marquee */}
      <section className="py-20 bg-white overflow-hidden border-y border-neutral-100">
         <div className="flex flex-col items-center mb-16 text-center px-6">
            <h2 className="text-3xl font-bold text-neutral-900 mb-2 font-serif italic">Lasting Impressions</h2>
            <div className="w-12 h-1 bg-amber-500 rounded-full" />
         </div>
         <div className="relative flex overflow-x-hidden group">
            <div className="py-12 animate-marquee flex whitespace-nowrap gap-6 group-hover:pause">
               {[...images, ...images].map((img, i) => (
                  <div key={i} className="relative w-80 h-60 rounded-3xl overflow-hidden shadow-lg flex-shrink-0">
                     <Image src={img.src} alt={img.alt} fill className="object-cover brightness-95 group-hover:brightness-100 transition-all" />
                  </div>
               ))}
            </div>
         </div>
      </section>

      {/* Modern CTA */}
      <section className="py-32 relative overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 z-0">
           <Image 
             src={images[10].src} 
             alt="Moroccan City" 
             fill 
             className="object-cover opacity-20"
           />
        </div>
        <div className="container mx-auto px-6 relative z-10 text-center text-white">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-10 leading-tight">
              Ready to witness <br /> 
              <span className="text-amber-500 italic font-serif">The Magic?</span>
            </h2>
            <p className="text-xl md:text-2xl text-neutral-400 mb-12 max-w-2xl mx-auto leading-relaxed">
              Every journey begins with a single step. Let us take care of the miles in between.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/programs">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-10 py-5 bg-amber-500 text-white rounded-2xl font-bold hover:bg-amber-600 transition-all shadow-[0_20px_50px_rgba(212,184,150,0.3)] cursor-pointer"
                >
                  Plan Your Experience
                </motion.span>
              </Link>
              <Link href="/contact">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-block px-10 py-5 border-2 border-white/20 text-white rounded-2xl font-bold hover:bg-white hover:text-neutral-900 transition-all cursor-pointer whitespace-nowrap"
                >
                  Contact Our Concierge
                </motion.span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      
      {/* Custom Global Styles for this page */}
      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-spin-slow {
          animation: spin-slow 30s linear infinite;
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </main>
  )
}
