'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ArticleTable } from '@/components/explorer/article-table'
import { FilterPanel } from '@/components/explorer/filter-panel'
import { fetchArticles } from '@/lib/backend-data'
import { Article, KeywordCategory } from '@/lib/types'
import { Search, X } from 'lucide-react'

export default function ExplorerPage() {
  const [allArticles, setAllArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<KeywordCategory[]>([])
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const rows = await fetchArticles()
        if (mounted) {
          setAllArticles(rows)
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load articles.')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  // Filter articles based on search and filters
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      // Search filter
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch =
        article.title.toLowerCase().includes(searchLower) ||
        article.source.toLowerCase().includes(searchLower)

      if (!matchesSearch) return false

      // Category filter (E/P/U scores)
      if (selectedCategories.length > 0) {
        const hasCategory = selectedCategories.some((cat) => {
          if (cat === KeywordCategory.ECONOMIC) return article.e_score > 50
          if (cat === KeywordCategory.POLITICAL) return article.p_score > 50
          if (cat === KeywordCategory.UNCERTAINTY) return article.u_score > 50
          return false
        })
        if (!hasCategory) return false
      }

      // Date range filter
      if (dateRange.start || dateRange.end) {
        const pubDate = new Date(article.publishedDate).getTime()
        if (dateRange.start && pubDate < new Date(dateRange.start).getTime())
          return false
        if (dateRange.end && pubDate > new Date(dateRange.end).getTime())
          return false
      }

      return true
    })
  }, [searchTerm, selectedCategories, dateRange])

  // Pagination
  const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategories([])
    setDateRange({ start: '', end: '' })
    setCurrentPage(1)
  }

  const hasActiveFilters =
    searchTerm || selectedCategories.length > 0 || dateRange.start || dateRange.end

  return (
    <div className="space-y-6 p-6">
      {error && (
        <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </Card>
      )}

      {/* Header with Search */}
      <Card className="bg-card border-border p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">Search Articles</h2>

        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by title, source..."
              className="pl-10 bg-secondary/50 border-border text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          {hasActiveFilters && (
            <Button
              variant="outline"
              className="border-border text-muted-foreground hover:text-foreground"
              onClick={handleClearFilters}
            >
              <X className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          )}
        </div>
      </Card>

      {/* Filters and Table */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filter Panel */}
        <FilterPanel
          selectedCategories={selectedCategories}
          onCategoriesChange={setSelectedCategories}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Articles Table */}
        <div className="lg:col-span-3">
          <Card className="bg-card border-border overflow-hidden">
            {/* Results Info */}
            <div className="px-6 py-4 border-b border-border">
              <p className="text-sm text-muted-foreground">
                Showing{' '}
                <span className="font-semibold text-foreground">
                  {paginatedArticles.length > 0
                    ? (currentPage - 1) * itemsPerPage + 1
                    : 0}
                  -
                  {Math.min(currentPage * itemsPerPage, filteredArticles.length)}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-foreground">
                  {filteredArticles.length}
                </span>{' '}
                articles
              </p>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="px-6 py-12 text-center">
                <p className="text-muted-foreground">Loading articles...</p>
              </div>
            ) : (
              <ArticleTable articles={paginatedArticles} />
            )}

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-border flex items-center justify-between">
              <Button
                variant="outline"
                className="border-border"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      className={
                        currentPage === pageNum
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'border-border'
                      }
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                {totalPages > 5 && <span className="text-muted-foreground">...</span>}
              </div>

              <Button
                variant="outline"
                className="border-border"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
