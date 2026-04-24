'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createNewsSource, deleteNewsSource, fetchNewsSources, updateNewsSource } from '@/lib/backend-data'
import { NewsSource } from '@/lib/types'

type SourceForm = {
  name: string
  url: string
  country: string
  region: NewsSource['region']
  language: NewsSource['language']
  is_active: boolean
}

const initialForm: SourceForm = {
  name: '',
  url: '',
  country: '',
  region: 'worldwide',
  language: 'en',
  is_active: true,
}

const regionLabel: Record<NewsSource['region'], string> = {
  bangladesh: 'Bangladesh',
  usa: 'USA',
  uk: 'UK',
  australia: 'Australia',
  canada: 'Canada',
  new_zealand: 'New Zealand',
  worldwide: 'Worldwide',
}

export function NewsSources() {
  const [sources, setSources] = useState<NewsSource[]>([])
  const [form, setForm] = useState<SourceForm>(initialForm)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadSources = async () => {
    try {
      setError(null)
      const rows = await fetchNewsSources()
      setSources(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load news sources.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSources()
  }, [])

  const groupedCount = useMemo(() => {
    return sources.reduce<Record<string, number>>((acc, source) => {
      acc[source.country] = (acc[source.country] ?? 0) + 1
      return acc
    }, {})
  }, [sources])

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const submit = async () => {
    if (!form.name.trim() || !form.url.trim() || !form.country.trim()) {
      setError('Name, URL, and country are required.')
      return
    }

    try {
      setError(null)
      if (editingId) {
        await updateNewsSource(editingId, form)
      } else {
        await createNewsSource(form)
      }
      resetForm()
      await loadSources()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save source.')
    }
  }

  const startEdit = (source: NewsSource) => {
    setEditingId(source.id)
    setForm({
      name: source.name,
      url: source.url,
      country: source.country,
      region: source.region,
      language: source.language,
      is_active: source.is_active,
    })
  }

  const remove = async (id: number) => {
    try {
      setError(null)
      await deleteNewsSource(id)
      await loadSources()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete source.')
    }
  }

  return (
    <Card className="bg-card border-border p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">News Source Links</h3>
        <p className="text-sm text-muted-foreground">
          Add, update, or remove newspaper source links used for crawling.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Input
          placeholder="Source name"
          value={form.name}
          onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        />
        <Input
          placeholder="https://example.com"
          value={form.url}
          onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))}
        />
        <Input
          placeholder="Country"
          value={form.country}
          onChange={(e) => setForm((prev) => ({ ...prev, country: e.target.value }))}
        />
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={form.region}
          onChange={(e) => setForm((prev) => ({ ...prev, region: e.target.value as NewsSource['region'] }))}
        >
          {Object.entries(regionLabel).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          value={form.language}
          onChange={(e) => setForm((prev) => ({ ...prev, language: e.target.value as NewsSource['language'] }))}
        >
          <option value="en">English</option>
          <option value="bn">Bangla</option>
        </select>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
          />
          Active
        </label>
      </div>

      <div className="mt-4 flex gap-2">
        <Button onClick={submit}>{editingId ? 'Update Source' : 'Add Source'}</Button>
        {editingId && (
          <Button variant="outline" onClick={resetForm}>
            Cancel Edit
          </Button>
        )}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        {Object.entries(groupedCount)
          .map(([country, count]) => `${country}: ${count}`)
          .join(' | ')}
      </div>

      <div className="mt-4 overflow-x-auto">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading sources...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left">Name</th>
                <th className="py-2 text-left">Country</th>
                <th className="py-2 text-left">URL</th>
                <th className="py-2 text-left">Status</th>
                <th className="py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sources.map((source) => (
                <tr key={source.id} className="border-b border-border/70">
                  <td className="py-2">{source.name}</td>
                  <td className="py-2">{source.country}</td>
                  <td className="py-2">
                    <a className="text-blue-400 underline" href={source.url} target="_blank" rel="noreferrer">
                      {source.url}
                    </a>
                  </td>
                  <td className="py-2">{source.is_active ? 'Active' : 'Inactive'}</td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => startEdit(source)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => void updateNewsSource(source.id, { is_active: !source.is_active }).then(loadSources)}>
                        {source.is_active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button size="sm" variant="outline" className="text-red-400" onClick={() => remove(source.id)}>
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </Card>
  )
}
