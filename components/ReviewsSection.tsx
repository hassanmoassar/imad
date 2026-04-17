'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'

interface Review {
  id: string
  customer_name: string
  rating: number
  comment: string
  created_at: string
}

interface ReviewsSectionProps {
  programId: string
}

export default function ReviewsSection({ programId }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    comment: ''
  })

  const fetchReviews = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, customer_name, rating, comment, created_at')
        .eq('program_id', programId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }, [programId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.comment || !formData.email) return

    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('reviews').insert([{
        program_id: programId,
        customer_name: formData.name,
        customer_email: formData.email,
        rating,
        comment: formData.comment,
        status: 'pending' // Moderated by default
      }])

      if (error) throw error

      setSubmitSuccess(true)
      setFormData({ name: '', email: '', comment: '' })
      setRating(5)
      setTimeout(() => setSubmitSuccess(false), 5000)
    } catch (err) {
      console.error('Error submitting review:', err)
      alert('Failed to submit review. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  return (
    <section className="mt-20 border-t border-neutral-100 pt-16">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
        
        {/* Review Statistics & List */}
        <div className="lg:col-span-3 space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">Customer Reviews</h2>
              <div className="flex items-center gap-3">
                <div className="flex text-amber-500">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} size={18} fill={s <= Number(averageRating) ? 'currentColor' : 'none'} />
                  ))}
                </div>
                <span className="text-lg font-bold text-neutral-900">{averageRating}</span>
                <span className="text-neutral-400">({reviews.length} reviews)</span>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2].map(i => <div key={i} className="h-32 bg-neutral-50 rounded-2xl" />)}
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <MessageSquare className="w-10 h-10 mx-auto mb-3 text-neutral-300" />
                  <p className="text-neutral-500">No reviews yet. Be the first to share your experience!</p>
                </div>
              ) : (
                reviews.map((review) => (
                  <motion.div
                    key={review.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-6 bg-white border border-neutral-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-neutral-900">{review.customer_name}</h4>
                        <p className="text-xs text-neutral-400 capitalize">
                          {new Date(review.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} size={14} fill={s <= review.rating ? 'currentColor' : 'none'} />
                        ))}
                      </div>
                    </div>
                    <p className="text-neutral-600 leading-relaxed italic">&quot;{review.comment}&quot;</p>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Submit Review Form */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 bg-neutral-900 rounded-3xl p-8 text-white shadow-2xl">
            <h3 className="text-2xl font-bold mb-2">Write a Review</h3>
            <p className="text-neutral-400 text-sm mb-8">Your feedback helps us improve our Moroccan experiences.</p>

            <AnimatePresence mode="wait">
              {submitSuccess ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-10 text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h4 className="text-xl font-bold">Review Submitted!</h4>
                  <p className="text-neutral-400 text-sm">Thank you for your feedback. Our team will review and publish it shortly.</p>
                  <button 
                    onClick={() => setSubmitSuccess(false)}
                    className="text-primary text-sm font-bold border-b border-primary hover:border-transparent transition-all pt-4"
                  >
                    Submit another review
                  </button>
                </motion.div>
              ) : (
                <motion.form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Star Rating Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-3">Overall Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(s)}
                          className="transition-transform active:scale-90"
                        >
                          <Star 
                            size={28} 
                            className={`${(hoverRating || rating) >= s ? 'text-primary fill-primary' : 'text-neutral-700'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Display Name</label>
                      <input
                        required
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                        placeholder="e.g. Jean"
                        className="w-full bg-neutral-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-neutral-600"
                      />
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Email (private)</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                        placeholder="jean@example.com"
                        className="w-full bg-neutral-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-neutral-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">Your Experience</label>
                    <textarea
                      required
                      value={formData.comment}
                      onChange={e => setFormData(p => ({ ...p, comment: e.target.value }))}
                      placeholder="Tell us what you loved about this tour..."
                      rows={4}
                      className="w-full bg-neutral-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-neutral-600 resize-none"
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Sending...' : (
                      <>
                        <Send size={18} />
                        Submit Review
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
