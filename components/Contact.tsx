'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { AlertCircle } from 'lucide-react'
import { LocationIcon, PhoneIcon, EmailIcon, ClockIcon, CheckIcon, LoadingIcon } from './Icons'
import { containerFade, itemFadeUp } from '@/lib/animations'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (submitError) setSubmitError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      // Simulate form submission
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setSubmitSuccess(true)
      setFormData({ name: '', email: '', phone: '', message: '' })
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (error) {
      setSubmitError('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: <LocationIcon />,
      title: 'Location',
      details: 'Marrakech, Morocco',
    },
    {
      icon: <PhoneIcon />,
      title: 'Phone',
      details: '+212 123 456 789',
    },
    {
      icon: <EmailIcon />,
      title: 'Email',
      details: 'info@moroccovoayges.com',
    },
    {
      icon: <ClockIcon />,
      title: 'Hours',
      details: '24/7 Available',
    },
  ]

  return (
    <section id="contact" className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
            Get In Touch
          </motion.h2>
          <motion.p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            Ready to start your Moroccan adventure? Contact us today and let's plan your perfect journey.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info Cards */}
          <motion.div
            variants={containerFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={index}
                variants={itemFadeUp}
                whileHover={{ x: 4 }}
                className="flex gap-4 p-6 rounded-lg bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-shrink-0 text-neutral-900 w-6 h-6">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600">{item.details}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.form
            variants={containerFade}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            onSubmit={handleSubmit}
            className="p-8 rounded-xl bg-white border border-neutral-200 shadow-sm"
          >
            {/* Name Field */}
            <motion.div variants={itemFadeUp} className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Full Name
              </label>
              <motion.input
                whileFocus={{ boxShadow: '0 0 0 3px rgba(201, 169, 97, 0.1)' }}
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors duration-200"
                placeholder="Your name"
                required
                disabled={isSubmitting}
              />
            </motion.div>

            {/* Email Field */}
            <motion.div variants={itemFadeUp} className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Email Address
              </label>
              <motion.input
                whileFocus={{ boxShadow: '0 0 0 3px rgba(201, 169, 97, 0.1)' }}
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors duration-200"
                placeholder="your@email.com"
                required
                disabled={isSubmitting}
              />
            </motion.div>

            {/* Phone Field */}
            <motion.div variants={itemFadeUp} className="mb-6">
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Phone Number (Optional)
              </label>
              <motion.input
                whileFocus={{ boxShadow: '0 0 0 3px rgba(201, 169, 97, 0.1)' }}
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors duration-200"
                placeholder="+212 ..."
                disabled={isSubmitting}
              />
            </motion.div>

            {/* Message Field */}
            <motion.div variants={itemFadeUp} className="mb-8">
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                Message
              </label>
              <motion.textarea
                whileFocus={{ boxShadow: '0 0 0 3px rgba(201, 169, 97, 0.1)' }}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full px-4 py-3 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-neutral-500 transition-colors duration-200 resize-none"
                placeholder="Tell us about your dream vacation"
                rows={4}
                required
                disabled={isSubmitting}
              />
            </motion.div>

            {/* Error Message */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 mb-6 rounded-lg bg-red-50 text-red-700 text-sm flex items-start gap-3"
              >
                <AlertCircle size={20} className="flex-shrink-0" />
                <span>{submitError}</span>
              </motion.div>
            )}

            {/* Success Message */}
            {submitSuccess && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 mb-6 rounded-lg bg-green-50 text-green-700 text-sm flex items-start gap-3"
              >
                <CheckIcon />
                <span>Message sent successfully! We'll get back to you soon.</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <motion.button
              variants={itemFadeUp}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={isSubmitting}
              className="w-full px-6 py-3 bg-neutral-900 text-white text-sm font-semibold rounded-lg hover:bg-neutral-800 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <LoadingIcon />
                  <span>Sending...</span>
                </>
              ) : (
                'Send Message'
              )}
            </motion.button>
          </motion.form>
        </div>
      </div>
    </section>
  )
}
