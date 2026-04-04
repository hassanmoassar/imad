'use client'

import { motion } from 'framer-motion'
import { FacebookIcon, InstagramIcon, TwitterIcon, LinkedinIcon } from './Icons'
import { containerFade, itemFadeUp } from '@/lib/animations'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  const footerSections = [
    {
      title: 'About',
      links: ['Our Story', 'Team', 'Careers', 'Blog'],
    },
    {
      title: 'Programs',
      links: ['Transfers', 'Tours', 'Accommodations', 'Dining'],
    },
    {
      title: 'Legal',
      links: ['Privacy', 'Terms', 'Cookies', 'Security'],
    },
  ]

  const socialLinks = [
    { icon: FacebookIcon, label: 'Facebook' },
    { icon: InstagramIcon, label: 'Instagram' },
    { icon: TwitterIcon, label: 'Twitter' },
    { icon: LinkedinIcon, label: 'Linkedin' },
  ]

  return (
    <footer className="bg-neutral-900 text-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div
            variants={itemFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold mb-3">Morocco Voyages</h2>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your gateway to unforgettable Moroccan adventures and luxury travel experiences.
            </p>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            variants={containerFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-8"
          >
            {footerSections.map((section) => (
              <motion.div key={section.title} variants={itemFadeUp}>
                <h3 className="text-sm font-semibold text-neutral-100 mb-4 uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemFadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h3 className="text-sm font-semibold text-neutral-100 mb-4 uppercase tracking-wider">
              Follow Us
            </h3>
            <div className="flex gap-4">
              {socialLinks.map(({ icon: Icon, label }) => (
                <motion.a
                  key={label}
                  href="#"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-100 transition-colors duration-200"
                  aria-label={label}
                >
                  <Icon />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="h-px bg-neutral-800"
        />

        {/* Bottom Footer */}
        <motion.div
          variants={containerFade}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-neutral-400"
        >
          <motion.p variants={itemFadeUp}>
            © {currentYear} Morocco Voyages. All rights reserved.
          </motion.p>
          <motion.div variants={itemFadeUp} className="flex gap-6">
            <a href="#" className="hover:text-neutral-100 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-100 transition-colors">
              Terms of Service
            </a>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  )
}
