'use client'

import { useEffect, useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { TrendChart } from '@/components/analytics/trend-chart'
import { ComparisonChart } from '@/components/analytics/comparison-chart'
import { StatisticsPanel } from '@/components/analytics/statistics-panel'
import { fetchDailyEpuData, fetchKeywordArticleCounts, fetchKeywordCategories } from '@/lib/backend-data'
import { EPUDataPoint, KeywordArticleCountRow } from '@/lib/types'
import { Download, TrendingUp } from 'lucide-react'

type KeywordCategoryRow = {
  name: string
  language: 'en' | 'bn'
  keywords: string[]
}

export default function AnalyticsPage() {
  const [epuData, setEpuData] = useState<EPUDataPoint[]>([])
  const [keywordRows, setKeywordRows] = useState<KeywordArticleCountRow[]>([])
  const [keywordCategories, setKeywordCategories] = useState<KeywordCategoryRow[]>([])
  const [selectedYear, setSelectedYear] = useState('all')
  const [selectedMonth, setSelectedMonth] = useState('all')
  const [selectedDay, setSelectedDay] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const loadData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const [data, keywordData, categories] = await Promise.all([
          fetchDailyEpuData(),
          fetchKeywordArticleCounts(),
          fetchKeywordCategories(),
        ])
        if (mounted) {
          setEpuData(data)
          setKeywordRows(keywordData)
          setKeywordCategories(
            categories.map((item) => ({
              name: item.name,
              language: item.language as 'en' | 'bn',
              keywords: item.keywords,
            })),
          )
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to load analytics data.')
        }
      } finally {
        if (mounted) {
          setIsLoading(false)
        }
      }
    }

    loadData()
    return () => {
      mounted = false
    }
  }, [])

  const epuKeywordTable = useMemo(() => {
    const categoryLabels = [
      { key: 'economy', label: 'Economy (E)' },
      { key: 'policy', label: 'Policy (P)' },
      { key: 'uncertainty', label: 'Uncertainty (U)' },
    ]

    const fallbackKeywords: Record<string, { en: string[]; bn: string[] }> = {
      economy: {
        en: ['economy', 'economic', 'GDP', 'growth', 'inflation', 'fiscal', 'monetary', 'trade', 'export', 'import', 'revenue', 'budget'],
        bn: ['অর্থনীতি', 'আর্থিক', 'কর', 'বাজেট', 'রাজস্ব', 'বাণিজ্য'],
      },
      policy: {
        en: ['policy', 'regulation', 'government', 'parliament', 'central bank', 'Bangladesh Bank', 'minister', 'legislation', 'law', 'reform', 'tariff'],
        bn: ['সরকার', 'নীতি', 'বাংলাদেশ ব্যাংক', 'মন্ত্রী', 'সরকারি', 'আইন', 'সংসদ'],
      },
      uncertainty: {
        en: ['uncertain', 'uncertainty', 'unclear', 'unpredictable', 'ambiguous', 'risk', 'volatile', 'unstable', 'concern', 'fear', 'doubt'],
        bn: ['অনিশ্চয়তা', 'সন্দেহ', 'ঝুঁকি', 'অস্থিতিশীল', 'ভয়', 'শঙ্কা'],
      },
    }

    const byKey = new Map<string, { en: string[]; bn: string[] }>()
    for (const item of keywordCategories) {
      const key = item.name.trim().toLowerCase()
      if (!byKey.has(key)) {
        byKey.set(key, { en: [], bn: [] })
      }
      const row = byKey.get(key)!
      if (item.language === 'bn') {
        row.bn = item.keywords
      } else {
        row.en = item.keywords
      }
    }

    return categoryLabels.map((item) => {
      const row = byKey.get(item.key) ?? fallbackKeywords[item.key]
      return {
        category: item.label,
        english: row.en,
        bangla: row.bn,
      }
    })
  }, [keywordCategories])

  const keywordCategoryMap = useMemo(() => {
    const map = new Map<string, string>()

    for (const row of epuKeywordTable) {
      const categoryCode = row.category.includes('(E)')
        ? 'E'
        : row.category.includes('(P)')
          ? 'P'
          : row.category.includes('(U)')
            ? 'U'
            : 'Unknown'

      for (const keyword of [...row.english, ...row.bangla]) {
        map.set(keyword.trim().toLowerCase(), categoryCode)
      }
    }

    return map
  }, [epuKeywordTable])

  const datePartsRows = useMemo(
    () =>
      keywordRows
        .map((row) => {
          const parts = row.date.split('-')
          if (parts.length !== 3) {
            return null
          }
          return {
            ...row,
            year: parts[0],
            month: parts[1],
            day: parts[2],
          }
        })
        .filter((row): row is KeywordArticleCountRow & { year: string; month: string; day: string } => row !== null),
    [keywordRows],
  )

  const yearOptions = useMemo(
    () => Array.from(new Set(datePartsRows.map((row) => row.year))).sort((a, b) => b.localeCompare(a)),
    [datePartsRows],
  )

  const monthOptions = useMemo(() => {
    const rows = selectedYear === 'all' ? datePartsRows : datePartsRows.filter((row) => row.year === selectedYear)
    return Array.from(new Set(rows.map((row) => row.month))).sort((a, b) => a.localeCompare(b))
  }, [datePartsRows, selectedYear])

  const dayOptions = useMemo(() => {
    let rows = datePartsRows
    if (selectedYear !== 'all') {
      rows = rows.filter((row) => row.year === selectedYear)
    }
    if (selectedMonth !== 'all') {
      rows = rows.filter((row) => row.month === selectedMonth)
    }
    return Array.from(new Set(rows.map((row) => row.day))).sort((a, b) => a.localeCompare(b))
  }, [datePartsRows, selectedYear, selectedMonth])

  const filteredKeywordRows = useMemo(
    () =>
      datePartsRows.filter((row) => {
        if (selectedYear !== 'all' && row.year !== selectedYear) return false
        if (selectedMonth !== 'all' && row.month !== selectedMonth) return false
        if (selectedDay !== 'all' && row.day !== selectedDay) return false
        return true
      }),
    [datePartsRows, selectedYear, selectedMonth, selectedDay],
  )

  // Calculate statistics
  const stats = useMemo(() => {
    if (epuData.length === 0) {
      return { avg: 0, max: 0, min: 0, latest: 0, change: 0 }
    }

    const indices = epuData.map((d) => d.index)
    const avg = indices.reduce((a, b) => a + b, 0) / indices.length
    const max = Math.max(...indices)
    const min = Math.min(...indices)
    const latest = indices[indices.length - 1]
    const previous = indices[Math.max(indices.length - 2, 0)]
    const change = previous ? ((latest - previous) / previous) * 100 : 0

    return { avg, max, min, latest, change }
  }, [epuData])

  const categoryStats = useMemo(() => {
    if (epuData.length === 0) {
      return {
        economic: { avg: '0.00', max: '0.00' },
        political: { avg: '0.00', max: '0.00' },
        uncertainty: { avg: '0.00', max: '0.00' },
      }
    }

    const eValues = epuData.map((d) => d.economic)
    const pValues = epuData.map((d) => d.political)
    const uValues = epuData.map((d) => d.uncertainty)

    return {
      economic: {
        avg: (eValues.reduce((a, b) => a + b, 0) / eValues.length).toFixed(2),
        max: Math.max(...eValues).toFixed(2),
      },
      political: {
        avg: (pValues.reduce((a, b) => a + b, 0) / pValues.length).toFixed(2),
        max: Math.max(...pValues).toFixed(2),
      },
      uncertainty: {
        avg: (uValues.reduce((a, b) => a + b, 0) / uValues.length).toFixed(2),
        max: Math.max(...uValues).toFixed(2),
      },
    }
  }, [epuData])

  const exportKeywordRowsCsv = () => {
    if (keywordRows.length === 0) return

    const escapeCsv = (value: string | number) => {
      const text = String(value ?? '')
      if (text.includes(',') || text.includes('"') || text.includes('\n')) {
        return `"${text.replace(/"/g, '""')}"`
      }
      return text
    }

    const header = ['Date', 'Source', 'Source Keyword, Category', 'Article Count']
    const lines = [
      header.map((col) => escapeCsv(col)).join(','),
      ...keywordRows.map((row) =>
        [
          escapeCsv(row.date),
          escapeCsv(row.source === 'prothom_alo' ? 'Prothom Alo' : row.source === 'daily_star' ? 'Daily Star' : row.source),
          escapeCsv(`${row.sourceKeyword}, ${keywordCategoryMap.get(row.sourceKeyword.trim().toLowerCase()) ?? 'Unknown'}`),
          escapeCsv(row.articleCount),
        ].join(','),
      ),
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `keyword_article_counts_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-8 p-6">
      {error && (
        <Card className="border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </Card>
      )}

      {/* Header with Export */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Academic window analysis (2010-2025)</p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
          onClick={exportKeywordRowsCsv}
          disabled={keywordRows.length === 0}
        >
          <Download className="w-4 h-4" />
          Download CSV
        </Button>
      </div>

      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Output Table</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Date, Source, Source Keyword, Category, Article Count
        </p>

        <div className="mb-4 grid gap-3 md:grid-cols-4">
          <select
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
            value={selectedYear}
            onChange={(e) => {
              setSelectedYear(e.target.value)
              setSelectedMonth('all')
              setSelectedDay('all')
            }}
          >
            <option value="all">All Years</option>
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
            value={selectedMonth}
            onChange={(e) => {
              setSelectedMonth(e.target.value)
              setSelectedDay('all')
            }}
          >
            <option value="all">All Months</option>
            {monthOptions.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>

          <select
            className="h-10 rounded-md border border-border bg-background px-3 text-sm"
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
          >
            <option value="all">All Days</option>
            {dayOptions.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedYear('all')
              setSelectedMonth('all')
              setSelectedDay('all')
            }}
          >
            Reset Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">Source</th>
                <th className="py-2 text-left">Source Keyword, Category</th>
                <th className="py-2 text-left">Article Count</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeywordRows.length === 0 ? (
                <tr>
                  <td className="py-3 text-muted-foreground" colSpan={4}>
                    No rows found for the selected year/month/day filters.
                  </td>
                </tr>
              ) : (
                filteredKeywordRows.map((row, index) => (
                  <tr key={`top-${row.date}-${row.source}-${row.sourceKeyword}-${index}`} className="border-b border-border/60">
                    <td className="py-2">{row.date}</td>
                    <td className="py-2">{row.source === 'prothom_alo' ? 'Prothom Alo' : row.source === 'daily_star' ? 'Daily Star' : row.source}</td>
                    <td className="py-2">
                      {row.sourceKeyword}, {keywordCategoryMap.get(row.sourceKeyword.trim().toLowerCase()) ?? 'Unknown'}
                    </td>
                    <td className="py-2">{row.articleCount}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-card border-border p-6">
          <p className="text-xs text-muted-foreground mb-2">Current Index</p>
          <p className="text-3xl font-bold text-foreground">{stats.latest.toFixed(2)}</p>
          <p className="text-xs text-emerald-400 mt-2">
            {stats.change > 0 ? '+' : ''}{stats.change.toFixed(2)}% from yesterday
          </p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-xs text-muted-foreground mb-2">Average (2010-2025)</p>
          <p className="text-3xl font-bold text-foreground">{stats.avg.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Mean EPU index</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-xs text-muted-foreground mb-2">Peak (2010-2025)</p>
          <p className="text-3xl font-bold text-orange-400">{stats.max.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Highest recorded</p>
        </Card>

        <Card className="bg-card border-border p-6">
          <p className="text-xs text-muted-foreground mb-2">Low (2010-2025)</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.min.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground mt-2">Lowest recorded</p>
        </Card>
      </div>

      {/* Main Trend Chart */}
      <Card className="bg-card border-border p-6 h-[400px]">
        <h3 className="text-lg font-semibold text-foreground mb-4">EPU Index Trend</h3>
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading analytics data...</p>
        ) : (
          <TrendChart data={epuData} />
        )}
      </Card>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparison Chart */}
        <Card className="bg-card border-border p-6 h-[350px]">
          <h3 className="text-lg font-semibold text-foreground mb-4">Category Comparison</h3>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading category data...</p>
          ) : (
            <ComparisonChart data={epuData} />
          )}
        </Card>

        {/* Category Statistics */}
        <StatisticsPanel stats={categoryStats} />
      </div>

      {/* Volatility & Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-emerald-500/10 border border-emerald-500/20 p-6">
          <h4 className="text-sm font-semibold text-emerald-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Economic Indicators
          </h4>
          <div className="space-y-2 text-sm text-emerald-200">
            <p><span className="font-semibold">Average:</span> {categoryStats.economic.avg}</p>
            <p><span className="font-semibold">Peak:</span> {categoryStats.economic.max}</p>
            <p className="text-xs pt-2 border-t border-emerald-500/20">
              Based on economic policy keywords and indicators
            </p>
          </div>
        </Card>

        <Card className="bg-orange-500/10 border border-orange-500/20 p-6">
          <h4 className="text-sm font-semibold text-orange-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Political Indicators
          </h4>
          <div className="space-y-2 text-sm text-orange-200">
            <p><span className="font-semibold">Average:</span> {categoryStats.political.avg}</p>
            <p><span className="font-semibold">Peak:</span> {categoryStats.political.max}</p>
            <p className="text-xs pt-2 border-t border-orange-500/20">
              Based on political keywords and developments
            </p>
          </div>
        </Card>

        <Card className="bg-red-500/10 border border-red-500/20 p-6">
          <h4 className="text-sm font-semibold text-red-400 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Uncertainty Indicators
          </h4>
          <div className="space-y-2 text-sm text-red-200">
            <p><span className="font-semibold">Average:</span> {categoryStats.uncertainty.avg}</p>
            <p><span className="font-semibold">Peak:</span> {categoryStats.uncertainty.max}</p>
            <p className="text-xs pt-2 border-t border-red-500/20">
              Based on general uncertainty indicators
            </p>
          </div>
        </Card>
      </div>

      {/* Time Period Analysis */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-6">Period Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { period: 'Last 7 Days', change: '+5.2', trend: 'up' },
            { period: 'Last 14 Days', change: '-2.1', trend: 'down' },
            { period: 'Last 30 Days', change: '+3.8', trend: 'up' },
          ].map((item) => (
            <div key={item.period} className="flex items-start justify-between p-4 rounded-lg bg-card/50 border border-border">
              <div>
                <p className="text-sm font-medium text-foreground">{item.period}</p>
                <p className={`text-2xl font-bold mt-2 ${
                  item.trend === 'up' ? 'text-orange-400' : 'text-emerald-400'
                }`}>
                  {item.change}%
                </p>
              </div>
              <div className={`text-4xl opacity-20 ${
                item.trend === 'up' ? 'text-orange-400' : 'text-emerald-400'
              }`}>
                {item.trend === 'up' ? '📈' : '📉'}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-card border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">E/P/U Keyword Categories</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Category-wise keywords used for EPU classification (English: The Daily Star, Bangla: Prothom Alo).
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-2 text-left">Category</th>
                <th className="py-2 text-left">English Keywords (The Daily Star)</th>
                <th className="py-2 text-left">Bangla Keywords (Prothom Alo)</th>
              </tr>
            </thead>
            <tbody>
              {epuKeywordTable.map((row) => (
                <tr key={row.category} className="border-b border-border/60 align-top">
                  <td className="py-2 font-medium">{row.category}</td>
                  <td className="py-2">{row.english.join(', ')}</td>
                  <td className="py-2">{row.bangla.join(', ')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
