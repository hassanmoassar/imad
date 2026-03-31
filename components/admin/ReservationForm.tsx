'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter, useParams } from 'next/navigation'

type Program = {
    id: string
    title: string
    price_per_person: number
}

interface ReservationFormProps {
    viewOnly?: boolean
}

export default function ReservationForm({ viewOnly = false }: ReservationFormProps) {
    const router = useRouter()
    const params = useParams()
    const isEdit = params?.id && params.id !== 'create'

    const [programs, setPrograms] = useState<Program[]>([])
    const [formData, setFormData] = useState({
        program_id: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        number_of_persons: 1,
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const fetchPrograms = async () => {
            try {
                const { data } = await supabase
                    .from('programs')
                    .select('id, title, price_per_person')
                setPrograms(data || [])
            } catch (err) {
                console.error('[Admin] Failed to fetch programs:', err)
            }
        }

        fetchPrograms()

        if (isEdit) {
            const fetchReservation = async () => {
                try {
                    const { data, error: fetchError } = await supabase
                        .from('reservations')
                        .select('*')
                        .eq('id', params.id)
                        .single()

                    if (fetchError) throw fetchError

                    if (data) {
                        setFormData({
                            program_id: data.program_id,
                            customer_name: data.customer_name,
                            customer_email: data.customer_email,
                            customer_phone: data.customer_phone,
                            number_of_persons: data.number_of_persons,
                        })
                    }
                } catch (err) {
                    console.error('[Admin] Failed to fetch reservation:', err)
                    setError('Failed to load reservation')
                }
            }
            fetchReservation()
        }
    }, [isEdit, params?.id])

    const selectedProgram = programs.find(p => p.id === formData.program_id)
    const totalPrice = selectedProgram
        ? selectedProgram.price_per_person * formData.number_of_persons
        : 0

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (viewOnly) return

        setError('')
        setLoading(true)

        try {
            // Validate form
            if (!formData.program_id) {
                throw new Error('Please select a program')
            }
            if (!formData.customer_name.trim()) {
                throw new Error('Customer name is required')
            }
            if (!formData.customer_email.trim()) {
                throw new Error('Customer email is required')
            }
            if (!formData.customer_phone.trim()) {
                throw new Error('Customer phone is required')
            }
            if (formData.number_of_persons < 1) {
                throw new Error('Number of persons must be at least 1')
            }

            const programTitle = selectedProgram?.title || ''

            if (isEdit) {
                console.log('[ReservationForm] Updating reservation:', params.id)
                const { error: updateError } = await supabase
                    .from('reservations')
                    .update({
                        program_id: formData.program_id,
                        program_title: programTitle,
                        customer_name: formData.customer_name,
                        customer_email: formData.customer_email,
                        customer_phone: formData.customer_phone,
                        number_of_persons: formData.number_of_persons,
                        total_price: totalPrice,
                    })
                    .eq('id', params.id)

                if (updateError) {
                    console.error('[ReservationForm] Update error:', updateError)
                    throw updateError
                }
                console.log('[ReservationForm] Reservation updated successfully')
            } else {
                console.log('[ReservationForm] Creating new reservation')
                const { data, error: insertError } = await supabase
                    .from('reservations')
                    .insert([
                        {
                            program_id: formData.program_id,
                            program_title: programTitle,
                            customer_name: formData.customer_name,
                            customer_email: formData.customer_email,
                            customer_phone: formData.customer_phone,
                            number_of_persons: formData.number_of_persons,
                            total_price: totalPrice,
                            status: 'pending',
                        },
                    ])
                    .select()

                if (insertError) {
                    console.error('[ReservationForm] Insert error:', insertError)
                    throw insertError
                }
                console.log('[ReservationForm] Reservation created:', data)
            }

            alert(isEdit ? 'Reservation updated successfully!' : 'Reservation created successfully!')
            router.push('/admin/reservations')
        } catch (err: any) {
            const errorMsg = err.message || 'An error occurred'
            console.error('[ReservationForm] Error:', errorMsg)
            setError(errorMsg)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6 max-w-2xl bg-white rounded-xl shadow-sm border border-slate-200">
            <h1 className="text-3xl font-bold mb-6 text-slate-900">
                {viewOnly ? 'Reservation Details' : isEdit ? 'Edit Reservation' : 'New Reservation'}
            </h1>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    <p className="font-semibold mb-1">Error</p>
                    <p>{error}</p>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Program */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Program *</label>
                    <select
                        value={formData.program_id}
                        onChange={(e) => setFormData({ ...formData, program_id: e.target.value })}
                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                        disabled={viewOnly || loading}
                        required
                    >
                        <option value="">Select a program</option>
                        {programs.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.title} - ${p.price_per_person}/person
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Name */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name *</label>
                        <input
                            type="text"
                            value={formData.customer_name}
                            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                            className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                            placeholder="John Doe"
                            disabled={viewOnly || loading}
                            required
                        />
                    </div>

                    {/* Customer Phone */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone *</label>
                        <input
                            type="tel"
                            value={formData.customer_phone}
                            onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                            className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                            placeholder="+212 ..."
                            disabled={viewOnly || loading}
                            required
                        />
                    </div>
                </div>

                {/* Customer Email */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Email address *</label>
                    <input
                        type="email"
                        value={formData.customer_email}
                        onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                        placeholder="customer@example.com"
                        disabled={viewOnly || loading}
                        required
                    />
                </div>

                {/* Number of Persons */}
                <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">Number of Persons *</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.number_of_persons}
                        onChange={(e) => setFormData({ ...formData, number_of_persons: parseInt(e.target.value) })}
                        className="w-full border border-slate-200 p-2.5 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all disabled:bg-slate-50 disabled:text-slate-500"
                        disabled={viewOnly || loading}
                        required
                    />
                </div>

                {/* Price Summary */}
                {selectedProgram && (
                    <div className="p-5 bg-amber-50 rounded-xl border border-amber-100">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-slate-600">Price per person:</span>
                            <span className="font-semibold text-slate-900">${selectedProgram.price_per_person}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-sm text-slate-600">Number of persons:</span>
                            <span className="font-semibold text-slate-900">{formData.number_of_persons}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-amber-200">
                            <span className="font-bold text-slate-900 text-lg">Total Price:</span>
                            <span className="font-bold text-amber-600 text-2xl">${totalPrice.toFixed(2)}</span>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    {!viewOnly && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-2.5 bg-slate-900 text-white font-semibold rounded-lg disabled:opacity-50 hover:bg-slate-800 transition-colors shadow-sm"
                        >
                            {loading ? 'Saving...' : isEdit ? 'Update Reservation' : 'Create Reservation'}
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className={`px-6 py-2.5 font-semibold rounded-lg transition-colors shadow-sm ${viewOnly
                                ? 'bg-slate-900 text-white hover:bg-slate-800 w-full'
                                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                            }`}
                    >
                        {viewOnly ? 'Back to Reservations' : 'Cancel'}
                    </button>
                </div>
            </form>
        </div>
    )
}
