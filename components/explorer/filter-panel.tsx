'use client'

import { Card } from '@/components/ui/card'
import { KeywordCategory } from '@/lib/types'
import { Check } from 'lucide-react'

interface FilterPanelProps {
  selectedCategories: KeywordCategory[]
  onCategoriesChange: (categories: KeywordCategory[]) => void
  dateRange: { start: string; end: string }
  onDateRangeChange: (range: { start: string; end: string }) => void
}

const categoryColors = {
  [KeywordCategory.ECONOMIC]: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  [KeywordCategory.POLITICAL]: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400' },
  [KeywordCategory.UNCERTAINTY]: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400' },
}

const categoryLabels = {
  [KeywordCategory.ECONOMIC]: 'Economic',
  [KeywordCategory.POLITICAL]: 'Political',
  [KeywordCategory.UNCERTAINTY]: 'Uncertainty',
}

export function FilterPanel({
  selectedCategories,
  onCategoriesChange,
  dateRange,
  onDateRangeChange,
}: FilterPanelProps) {
  const toggleCategory = (category: KeywordCategory) => {
    if (selectedCategories.includes(category)) {
      onCategoriesChange(selectedCategories.filter((c) => c !== category))
    } else {
      onCategoriesChange([...selectedCategories, category])
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Article Category</h3>

        <div className="space-y-3">
          {Object.values(KeywordCategory).map((category) => {
            const isSelected = selectedCategories.includes(category)
            const colors = categoryColors[category]

            return (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition-all ${
                  isSelected
                    ? `${colors.bg} ${colors.border} border-opacity-100`
                    : 'bg-transparent border-border border-opacity-30 hover:border-opacity-100'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded border flex items-center justify-center ${
                    isSelected ? colors.border : 'border-muted-foreground'
                  }`}
                >
                  {isSelected && <Check className={`w-3 h-3 ${colors.text}`} />}
                </div>
                <span
                  className={`text-sm font-medium ${
                    isSelected ? colors.text : 'text-muted-foreground'
                  }`}
                >
                  {categoryLabels[category]}
                </span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* Date Range Filter */}
      <Card className="bg-card border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Date Range</h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted-foreground mb-2 block">From</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                onDateRangeChange({ ...dateRange, start: e.target.value })
              }
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm"
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">To</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                onDateRangeChange({ ...dateRange, end: e.target.value })
              }
              className="w-full px-3 py-2 bg-secondary/50 border border-border rounded-lg text-foreground text-sm"
            />
          </div>
        </div>
      </Card>

      {/* Score Info */}
      <Card className="bg-blue-500/10 border border-blue-500/20 p-6">
        <h3 className="text-sm font-semibold text-blue-400 mb-3">Scores Explained</h3>
        <div className="space-y-2 text-xs text-blue-200">
          <p><span className="font-semibold">E Score:</span> Economic uncertainty indicators</p>
          <p><span className="font-semibold">P Score:</span> Political uncertainty indicators</p>
          <p><span className="font-semibold">U Score:</span> General uncertainty indicators</p>
          <p className="pt-2 border-t border-blue-500/20">Higher scores indicate stronger relevance to that category.</p>
        </div>
      </Card>
    </div>
  )
}
