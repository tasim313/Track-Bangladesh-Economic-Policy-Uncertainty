'use client'

import { Card } from '@/components/ui/card'
import { KeywordCategory } from '@/lib/types'
import { Check } from 'lucide-react'

interface CategoryFilterProps {
  selectedCategory: KeywordCategory | null
  onCategoryChange: (category: KeywordCategory | null) => void
  counts: Record<KeywordCategory, number>
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

export function CategoryFilter({ selectedCategory, onCategoryChange, counts }: CategoryFilterProps) {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Filter by Category</h3>

      <div className="space-y-2">
        {/* All Keywords Option */}
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
            selectedCategory === null
              ? 'bg-blue-500/20 border-blue-500/40 text-blue-400'
              : 'bg-card/50 border-border hover:bg-card/70'
          }`}
        >
          <span className="text-sm font-medium">All Keywords</span>
          <span className="text-xs px-2 py-1 rounded bg-card/50">
            {Object.values(counts).reduce((a, b) => a + b, 0)}
          </span>
        </button>

        {/* Category Options */}
        {Object.values(KeywordCategory).map((category) => {
          const isSelected = selectedCategory === category
          const colors = categoryColors[category]

          return (
            <button
              key={category}
              onClick={() => onCategoryChange(category)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                isSelected
                  ? `${colors.bg} ${colors.border} border-opacity-100`
                  : 'bg-card/50 border-border border-opacity-30 hover:border-opacity-100'
              }`}
            >
              <div className="flex items-center gap-3">
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
              </div>
              <span className={`text-xs px-2 py-1 rounded ${isSelected ? colors.bg : 'bg-card/50'}`}>
                {counts[category]}
              </span>
            </button>
          )
        })}
      </div>
    </Card>
  )
}
