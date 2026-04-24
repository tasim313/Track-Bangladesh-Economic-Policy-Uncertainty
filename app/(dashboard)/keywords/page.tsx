'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KeywordTable } from '@/components/keywords/keyword-table'
import { KeywordForm } from '@/components/keywords/keyword-form'
import { CategoryFilter } from '@/components/keywords/category-filter'
import { createKeywordCategory, fetchKeywordCategories, flattenKeywords, updateKeywordCategory } from '@/lib/backend-data'
import { KeywordCategory, Keyword } from '@/lib/types'
import { Plus, Search, Upload, Download } from 'lucide-react'

type KeywordCategoryPayload = {
  id: number
  name: string
  language: string
  keywords: string[]
  updated_at: string
}

export default function KeywordsPage() {
  const [categories, setCategories] = useState<KeywordCategoryPayload[]>([])
  const [keywords, setKeywords] = useState<Keyword[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<KeywordCategory | null>(null)
  const [isAddingKeyword, setIsAddingKeyword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const DEFAULT_KEYWORD_CATEGORIES: Array<{
    name: string
    language: 'en' | 'bn'
    keywords: string[]
  }> = [
    {
      name: 'Economy',
      language: 'en',
      keywords: ['economy', 'economic', 'gdp', 'growth', 'inflation', 'fiscal', 'monetary', 'trade', 'export', 'import', 'revenue', 'budget'],
    },
    {
      name: 'Economy',
      language: 'bn',
      keywords: ['অর্থনীতি', 'আর্থিক', 'কর', 'বাজেট', 'রাজস্ব', 'বাণিজ্য'],
    },
    {
      name: 'Policy',
      language: 'en',
      keywords: ['policy', 'regulation', 'government', 'parliament', 'central bank', 'bangladesh bank', 'minister', 'legislation', 'law', 'reform', 'tariff'],
    },
    {
      name: 'Policy',
      language: 'bn',
      keywords: ['সরকার', 'নীতি', 'বাংলাদেশ ব্যাংক', 'মন্ত্রী', 'সরকারি', 'আইন', 'সংসদ'],
    },
    {
      name: 'Uncertainty',
      language: 'en',
      keywords: ['uncertain', 'uncertainty', 'unclear', 'unpredictable', 'ambiguous', 'risk', 'volatile', 'unstable', 'concern', 'fear', 'doubt'],
    },
    {
      name: 'Uncertainty',
      language: 'bn',
      keywords: ['অনিশ্চয়তা', 'সন্দেহ', 'ঝুঁকি', 'অস্থিতিশীল', 'ভয়', 'শঙ্কা'],
    },
  ]

  const bootstrapDefaultCategories = async () => {
    for (const category of DEFAULT_KEYWORD_CATEGORIES) {
      try {
        await createKeywordCategory(category)
      } catch {
        // Ignore duplicates/races; categories are unique by name+language.
      }
    }
  }

  const loadKeywords = async () => {
    try {
      setError(null)
      let rows = await fetchKeywordCategories()
      if (rows.length === 0) {
        await bootstrapDefaultCategories()
        rows = await fetchKeywordCategories()
      }
      setCategories(rows)
      setKeywords(flattenKeywords(rows))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load keywords.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadKeywords()
  }, [])

  // Filter keywords
  const filteredKeywords = useMemo(() => {
    return keywords.filter((kw) => {
      const matchesSearch = kw.text.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || kw.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [keywords, searchTerm, selectedCategory])

  // Count by category
  const categoryCounts = useMemo(() => {
    return {
      [KeywordCategory.ECONOMIC]: keywords.filter((k) => k.category === KeywordCategory.ECONOMIC).length,
      [KeywordCategory.POLITICAL]: keywords.filter((k) => k.category === KeywordCategory.POLITICAL).length,
      [KeywordCategory.UNCERTAINTY]: keywords.filter((k) => k.category === KeywordCategory.UNCERTAINTY).length,
    }
  }, [keywords])

  const resolveBackendCategoryName = (category: KeywordCategory) => {
    if (category === KeywordCategory.ECONOMIC) return 'economy'
    if (category === KeywordCategory.POLITICAL) return 'policy'
    return 'uncertainty'
  }

  const isSameCategory = (backendName: string, selected: KeywordCategory) => {
    const normalized = backendName.toLowerCase()
    const expected = resolveBackendCategoryName(selected)
    return normalized === expected || normalized.startsWith(expected)
  }

  const handleAddKeyword = async (text: string, category: KeywordCategory) => {
    try {
      const target = categories.find(
        (item) => isSameCategory(item.name, category),
      )
      if (!target) {
        setError('Keyword category is missing on backend.')
        return
      }

      const nextKeywords = Array.from(new Set([text, ...target.keywords]))
      await updateKeywordCategory(target.id, nextKeywords)
      await loadKeywords()
      setIsAddingKeyword(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add keyword.')
    }
  }

  const handleDeleteKeyword = async (id: string) => {
    try {
      const [categoryId, index] = id.split(':').map(Number)
      const target = categories.find((item) => item.id === categoryId)
      if (!target || Number.isNaN(index)) return

      const nextKeywords = target.keywords.filter((_, idx) => idx !== index)
      await updateKeywordCategory(target.id, nextKeywords)
      await loadKeywords()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete keyword.')
    }
  }

  const handleEditKeyword = async (id: string, text: string, category: KeywordCategory) => {
    try {
      const [categoryId, index] = id.split(':').map(Number)
      const target = categories.find((item) => item.id === categoryId)
      if (!target || Number.isNaN(index)) return

      const updatedInPlace = target.keywords.map((item, idx) => (idx === index ? text : item))

      if (category === keywords.find((kw) => kw.id === id)?.category) {
        await updateKeywordCategory(target.id, updatedInPlace)
        await loadKeywords()
        return
      }

      const destination = categories.find(
        (item) => isSameCategory(item.name, category),
      )
      if (!destination) {
        setError('Destination category is missing on backend.')
        return
      }

      await updateKeywordCategory(target.id, target.keywords.filter((_, idx) => idx !== index))
      await updateKeywordCategory(destination.id, Array.from(new Set([text, ...destination.keywords])))
      await loadKeywords()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update keyword.')
    }
  }

  return (
    <div className="space-y-6 p-6">
      {error && (
        <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </Card>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Keyword Manager</h1>
          <p className="text-muted-foreground">Manage economic, political, and uncertainty keywords</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-border text-foreground hover:bg-card/50 gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
          <Button variant="outline" className="border-border text-foreground hover:bg-card/50 gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Category Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-emerald-500/10 border border-emerald-500/20 p-6">
          <p className="text-xs text-muted-foreground mb-2">Economic Keywords</p>
          <p className="text-3xl font-bold text-emerald-400">{categoryCounts[KeywordCategory.ECONOMIC]}</p>
        </Card>
        <Card className="bg-orange-500/10 border border-orange-500/20 p-6">
          <p className="text-xs text-muted-foreground mb-2">Political Keywords</p>
          <p className="text-3xl font-bold text-orange-400">{categoryCounts[KeywordCategory.POLITICAL]}</p>
        </Card>
        <Card className="bg-red-500/10 border border-red-500/20 p-6">
          <p className="text-xs text-muted-foreground mb-2">Uncertainty Keywords</p>
          <p className="text-3xl font-bold text-red-400">{categoryCounts[KeywordCategory.UNCERTAINTY]}</p>
        </Card>
      </div>

      {/* Add Keyword Form */}
      {isAddingKeyword && (
        <KeywordForm
          onSubmit={handleAddKeyword}
          onCancel={() => setIsAddingKeyword(false)}
        />
      )}

      {!isAddingKeyword && (
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={() => setIsAddingKeyword(true)}
        >
          <Plus className="w-4 h-4" />
          Add Keyword
        </Button>
      )}

      {/* Search and Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <CategoryFilter
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          counts={categoryCounts}
        />

        {/* Keywords Table */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-border overflow-hidden">
            {/* Search */}
            <div className="px-6 py-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Search keywords..."
                  className="pl-10 bg-secondary/50 border-border text-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Results Info */}
            <div className="px-6 py-3 border-b border-border text-sm text-muted-foreground">
              Showing {filteredKeywords.length} of {keywords.length} keywords
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-muted-foreground">Loading keywords...</p>
              </div>
            ) : (
              <KeywordTable
                keywords={filteredKeywords}
                onDelete={handleDeleteKeyword}
                onEdit={handleEditKeyword}
              />
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
