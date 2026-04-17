'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Trash2, MessageSquare, Star, Globe } from 'lucide-react'
import { supabase } from '@/lib/supabaseClient'
import { Card, CardContent } from '@/components/admin/Card'
import { Button } from '@/components/admin/Button'
import { Toast } from '@/components/admin/Toast'
import { Badge } from '@/components/admin/Badge'

interface Review {
  id: string
  program_id: string
  customer_name: string
  customer_email: string
  rating: number
  comment: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  programs?: {
    title: string
  }
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, programs(title)')
        .order('created_at', { ascending: false })

      if (error) throw error
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', id)

      if (error) throw error
      
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      setToast({ type: 'success', message: `Review ${status} successfully` })
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to update review status' })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return

    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      setReviews(prev => prev.filter(r => r.id !== id))
      setToast({ type: 'success', message: 'Review deleted successfully' })
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete review' })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.length === 0 ? (
          <div className="col-span-full py-20 text-center bg-white rounded-2xl border border-slate-100 italic text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
            No reviews found yet.
          </div>
        ) : (
          reviews.map((review) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 group border-slate-100 overflow-hidden">
                <CardContent className="p-0">
                  {/* Status Ribbon */}
                  <div className={`h-1.5 w-full ${
                    review.status === 'approved' ? 'bg-emerald-500' : 
                    review.status === 'pending' ? 'bg-amber-500' : 'bg-rose-500'
                  }`} />
                  
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center font-bold text-slate-400 border border-slate-100">
                          {review.customer_name[0]}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 leading-tight">{review.customer_name}</h3>
                          <p className="text-xs text-slate-400">{review.customer_email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span className="text-xs font-bold text-amber-700">{review.rating}</span>
                      </div>
                    </div>

                    <div className="mb-4 bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe className="w-3 h-3 text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
                          {review.programs?.title || 'Unknown Tour'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 italic line-clamp-3">
                        &quot;{review.comment}&quot;
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                      
                      <div className="flex gap-2">
                        {review.status !== 'approved' && (
                          <button
                            onClick={() => handleStatusChange(review.id, 'approved')}
                            className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl transition-all"
                            title="Approve"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {review.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(review.id, 'rejected')}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 bg-slate-50 text-slate-400 hover:bg-slate-900 hover:text-white rounded-xl transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-[100]">
          <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />
        </div>
      )}
    </div>
  )
}
