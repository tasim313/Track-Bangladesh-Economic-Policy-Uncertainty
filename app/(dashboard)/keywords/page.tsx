'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KeywordTable } from '@/components/keywords/keyword-table'
import { KeywordForm } from '@/components/keywords/keyword-form'
import { CategoryFilter } from '@/components/keywords/category-filter'
import { generateMockKeywords } from '@/lib/mock-data'
import { KeywordCategory, Keyword } from '@/lib/types'
import { Plus, Search, Upload, Download } from 'lucide-react'

export default function KeywordsPage() {
  const mockKeywords = useMemo(() => generateMockKeywords(), [])
  const [keywords, setKeywords] = useState<Keyword[]>(mockKeywords)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<KeywordCategory | null>(null)
  const [isAddingKeyword, setIsAddingKeyword] = useState(false)

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

  const handleAddKeyword = (text: string, category: KeywordCategory) => {
    const newKeyword: Keyword = {
      id: `kw-${Date.now()}`,
      text,
      category,
      createdAt: new Date().toISOString(),
      frequency: 0,
    }
    setKeywords((prev) => [newKeyword, ...prev])
    setIsAddingKeyword(false)
  }

  const handleDeleteKeyword = (id: string) => {
    setKeywords((prev) => prev.filter((kw) => kw.id !== id))
  }

  const handleEditKeyword = (id: string, text: string, category: KeywordCategory) => {
    setKeywords((prev) =>
      prev.map((kw) =>
        kw.id === id ? { ...kw, text, category } : kw
      )
    )
  }

  return (
    <div className="space-y-6 p-6">
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
            <KeywordTable
              keywords={filteredKeywords}
              onDelete={handleDeleteKeyword}
              onEdit={handleEditKeyword}
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
