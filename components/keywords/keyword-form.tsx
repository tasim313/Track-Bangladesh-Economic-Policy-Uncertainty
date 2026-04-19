'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { KeywordCategory } from '@/lib/types'

interface KeywordFormProps {
  onSubmit: (text: string, category: KeywordCategory) => void
  onCancel: () => void
}

const categoryLabels = {
  [KeywordCategory.ECONOMIC]: 'Economic',
  [KeywordCategory.POLITICAL]: 'Political',
  [KeywordCategory.UNCERTAINTY]: 'Uncertainty',
}

const categoryColorMap: Record<KeywordCategory, 'emerald' | 'orange' | 'red'> = {
  [KeywordCategory.ECONOMIC]: 'emerald',
  [KeywordCategory.POLITICAL]: 'orange',
  [KeywordCategory.UNCERTAINTY]: 'red',
}

const colorClasses = {
  emerald: {
    selected: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400',
    unselected: 'bg-card/50 border-border text-muted-foreground hover:text-foreground',
  },
  orange: {
    selected: 'bg-orange-500/20 border-orange-500/40 text-orange-400',
    unselected: 'bg-card/50 border-border text-muted-foreground hover:text-foreground',
  },
  red: {
    selected: 'bg-red-500/20 border-red-500/40 text-red-400',
    unselected: 'bg-card/50 border-border text-muted-foreground hover:text-foreground',
  },
} as const

export function KeywordForm({ onSubmit, onCancel }: KeywordFormProps) {
  const [text, setText] = useState('')
  const [category, setCategory] = useState<KeywordCategory>(KeywordCategory.ECONOMIC)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (text.trim()) {
      onSubmit(text.trim(), category)
      setText('')
    }
  }

  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Add New Keyword</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Keyword
          </label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter keyword"
            className="bg-secondary/50 border-border text-foreground"
            autoFocus
          />
        </div>

        <div>
          <label className="text-sm font-medium text-foreground block mb-3">
            Category
          </label>
          <div className="grid grid-cols-3 gap-3">
            {Object.values(KeywordCategory).map((cat) => {
              const isSelected = category === cat
              const colors = categoryColorMap[cat]

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`px-4 py-3 rounded-lg border font-medium text-sm transition-colors ${
                    isSelected
                      ? colorClasses[colors].selected
                      : colorClasses[colors].unselected
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="submit"
            disabled={!text.trim()}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
          >
            Add Keyword
          </Button>
          <Button
            type="button"
            variant="outline"
            className="border-border"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
