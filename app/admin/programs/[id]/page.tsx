'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'
import Image from 'next/image'

type Step = {
  id: string
  title: string
  description: string
}

const SERVICE_CATEGORIES = ['transfers', 'excursions', 'tour-circuits']

export default function EditProgram() {
  const { id } = useParams()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<string>('transfers')
  const [pricePerPerson, setPricePerPerson] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      loadProgram(id as string)
    }
  }, [id])

  async function loadProgram(programId: string) {
    try {
      const { data, error } = await supabase
        .from('programs')
        .select('*')
        .eq('id', programId)
        .single()

      if (error) {
        throw new Error(error.message)
      }

      if (data) {
        setTitle(data.title || '')
        setDescription(data.description || '')
        setCategory(data.category || 'transfers')
        setPricePerPerson(data.price_per_person ? data.price_per_person.toString() : '')
        setExistingImageUrl(data.image || null)
        
        if (data.steps && Array.isArray(data.steps)) {
          setSteps(
            data.steps.map((s: any) => ({
              id: s.id || Date.now().toString() + Math.random(),
              title: s.title || '',
              description: s.description || '',
            }))
          )
        }
      }
    } catch (err: any) {
      console.error('[Admin] Error loading program:', err)
      setError(err.message || 'Error loading program details.')
    } finally {
      setInitialLoading(false)
    }
  }

  const addStep = () => {
    setSteps([...steps, { id: Date.now().toString(), title: '', description: '' }])
  }

  const removeStep = (stepId: string) => {
    setSteps(steps.filter((s) => s.id !== stepId))
  }

  const updateStep = (stepId: string, field: 'title' | 'description', value: string) => {
    setSteps(steps.map((s) => (s.id === stepId ? { ...s, [field]: value } : s)))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      console.log('[Admin] Starting program update...')

      // Step 1: Verify authentication
      console.log('[Admin] Verifying authentication...')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        throw new Error(
          'Authentication failed: No user found. Please log in again.'
        )
      }
      console.log('[Admin] Authentication verified for user:', user.email)

      let imageUrl = existingImageUrl

      // Step 2: Upload new image if provided
      if (image) {
        console.log('[Admin] Uploading image to Supabase storage...', {
          filename: image.name,
          size: image.size,
          type: image.type,
        })

        // Sanitize filename: remove special characters, accents, spaces
        const sanitizeFilename = (name: string) => {
          return name
            .normalize('NFD') // Decompose accented characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
            .replace(/_{2,}/g, '_') // Replace multiple underscores with single
            .toLowerCase()
        }

        const ext = image.name.split('.').pop() || 'jpg'
        const sanitized = sanitizeFilename(image.name.replace(/\.[^/.]+$/, ''))
        const safeFilename = `${sanitized}.${ext}`

        const filename = `programs/${id}/${safeFilename}`
        console.log('[Admin] Sanitized filename:', { original: image.name, safe: safeFilename })

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('programs')
          .upload(filename, image, {
            upsert: true,
          })

        if (uploadError) {
          console.error('[Admin] Image upload failed:', uploadError)
          throw new Error(
            `Image upload failed: ${uploadError.message}. Make sure the 'programs' storage bucket exists and has public access configured.`
          )
        }

        console.log('[Admin] Image uploaded successfully', { path: uploadData?.path })

        const { data: publicUrl } = supabase.storage.from('programs').getPublicUrl(filename)
        imageUrl = publicUrl.publicUrl
        console.log('[Admin] Public image URL:', imageUrl)
      }

      // Step 3: Update program in database
      console.log('[Admin] Updating program in database...', {
        id,
        title,
        hasImage: !!imageUrl,
        stepsCount: steps.length,
      })

      const { error: updateError } = await supabase
        .from('programs')
        .update({
          title,
          description,
          category,
          price_per_person: parseFloat(pricePerPerson),
          image: imageUrl,
          steps: steps.map(({ id, ...rest }) => rest),
        })
        .eq('id', id)

      if (updateError) {
        console.error('[Admin] Database update failed:', updateError)
        throw new Error(
          `Failed to update program: ${updateError.message}.`
        )
      }

      console.log('[Admin] Program updated successfully!', { id })
      alert('Program updated successfully!')
      router.push('/admin/programs')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      console.error('[Admin] Error during program update:', {
        error: errorMsg,
        fullError: err,
      })
      setError(errorMsg)
      alert(`Error: ${errorMsg}`)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return <div className="p-6">Loading program details...</div>
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Program</h1>

      {/* Error Message Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded text-red-700">
          <p className="font-semibold">Error:</p>
          <p className="text-sm mt-1">{error}</p>
          <p className="text-xs mt-2 text-red-600">
            Check browser console (F12) for detailed debug logs starting with [Admin]
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {/* Program Title */}
        <div>
          <label className="block text-sm font-semibold mb-2">Program Title</label>
          <input
            className="w-full border p-2 rounded"
            placeholder="e.g., Marrakech Desert Adventure"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Service Category */}
        <div>
          <label className="block text-sm font-semibold mb-2">Service Category</label>
          <select
            className="w-full border p-2 rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {SERVICE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'transfers' ? 'Transfers' : cat === 'excursions' ? 'Excursions' : 'Tour Circuits'}
              </option>
            ))}
          </select>
        </div>

        {/* Price Per Person */}
        <div>
          <label className="block text-sm font-semibold mb-2">Price per Person (USD)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            className="w-full border p-2 rounded"
            placeholder="e.g., 99.99"
            value={pricePerPerson}
            onChange={(e) => setPricePerPerson(e.target.value)}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            className="w-full border p-2 rounded h-24"
            placeholder="Describe the program..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold mb-2">Program Image</label>
          {existingImageUrl && !image && (
            <div className="mb-3">
              <p className="text-sm text-gray-500 mb-2">Current Image:</p>
              <div className="relative w-48 h-32 rounded overflow-hidden">
                <Image src={existingImageUrl} alt={title} fill className="object-cover" />
              </div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            className="w-full border p-2 rounded"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          {image && <p className="text-sm text-gray-600 mt-1">New Selected: {image.name}</p>}
        </div>

        {/* Steps */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-semibold">Program Steps</label>
            <button
              type="button"
              onClick={addStep}
              className="px-3 py-1 bg-accent text-white rounded text-sm"
            >
              + Add Step
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((step, idx) => (
              <div key={step.id} className="border p-4 rounded bg-gray-50">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-semibold text-gray-600">Step {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeStep(step.id)}
                    className="px-2 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Remove
                  </button>
                </div>
                <input
                  className="w-full border p-2 rounded mb-2"
                  placeholder="Step Title"
                  value={step.title}
                  onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                />
                <textarea
                  className="w-full border p-2 rounded h-20"
                  placeholder="Step Description"
                  value={step.description}
                  onChange={(e) => updateStep(step.id, 'description', e.target.value)}
                />
              </div>
            ))}
            {steps.length === 0 && (
              <p className="text-sm text-gray-500 italic">No steps yet. Click "Add Step" to get started.</p>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Program'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
