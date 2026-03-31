'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabaseClient'

type Program = {
  id: string
  title: string
  summary?: string
  price?: string
  city?: string
}

export default function AdminPrograms() {
  const [items, setItems] = useState<Program[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const limit = 10

  useEffect(() => {
    load()
  }, [page, search])

  async function load() {
    setLoading(true)
    try {
      const from = (page - 1) * limit
      const to = from + limit - 1
      let query = supabase.from('programs').select('*').range(from, to).order('id', { ascending: true })
      if (search) query = query.ilike('title', `%${search}%`)
      const { data, error } = await query
      if (!error && data) setItems(data as Program[])
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete program?')) return
    await supabase.from('programs').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Programs</h1>
        <Link href="/admin/programs/create" className="px-4 py-2 bg-primary text-white rounded">New Program</Link>
      </div>

      <div className="mb-4 flex gap-2">
        <input className="border p-2 rounded flex-1" placeholder="Search title..." value={search} onChange={(e) => setSearch(e.target.value)} />
        <button onClick={() => { setPage(1); load() }} className="px-3 py-2 border rounded">Search</button>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Title</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Price</th>
              <th className="text-left p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3">{p.title}</td>
                <td className="p-3">{p.city}</td>
                <td className="p-3">{p.price}</td>
                <td className="p-3">
                  <Link href={`/admin/programs/${p.id}`} className="mr-2 text-accent">Edit</Link>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-3 py-1 border rounded">Prev</button>
        <div>Page {page}</div>
        <button onClick={() => setPage((p) => p + 1)} className="px-3 py-1 border rounded">Next</button>
      </div>
    </div>
  )
}
