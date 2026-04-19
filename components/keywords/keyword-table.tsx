'use client'

import { useState } from 'react'
import { Keyword, KeywordCategory } from '@/lib/types'
import { Trash2, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface KeywordTableProps {
  keywords: Keyword[]
  onDelete: (id: string) => void
  onEdit: (id: string, text: string, category: KeywordCategory) => void
}

const categoryColors = {
  [KeywordCategory.ECONOMIC]: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400', label: 'Economic' },
  [KeywordCategory.POLITICAL]: { bg: 'bg-orange-500/10', border: 'border-orange-500/20', text: 'text-orange-400', label: 'Political' },
  [KeywordCategory.UNCERTAINTY]: { bg: 'bg-red-500/10', border: 'border-red-500/20', text: 'text-red-400', label: 'Uncertainty' },
}

export function KeywordTable({ keywords, onDelete, onEdit }: KeywordTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')
  const [editCategory, setEditCategory] = useState<KeywordCategory>(KeywordCategory.ECONOMIC)

  const startEdit = (kw: Keyword) => {
    setEditingId(kw.id)
    setEditText(kw.text)
    setEditCategory(kw.category)
  }

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      onEdit(id, editText, editCategory)
      setEditingId(null)
    }
  }

  if (keywords.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-muted-foreground">No keywords found.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">
              Keyword
            </th>
            <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">
              Category
            </th>
            <th className="text-center px-6 py-4 font-semibold text-foreground text-sm">
              Frequency
            </th>
            <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">
              Added
            </th>
            <th className="text-center px-6 py-4 font-semibold text-foreground text-sm">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {keywords.map((keyword, idx) => {
            const colors = categoryColors[keyword.category]
            const isEditing = editingId === keyword.id
            const addedDate = new Date(keyword.createdAt).toLocaleDateString()

            return (
              <tr
                key={keyword.id}
                className={`border-b border-border hover:bg-card/50 transition-colors ${
                  idx % 2 === 0 ? 'bg-card/30' : ''
                }`}
              >
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="px-3 py-2 bg-secondary/50 border border-border rounded text-foreground text-sm"
                      autoFocus
                    />
                  ) : (
                    <p className="font-medium text-foreground">{keyword.text}</p>
                  )}
                </td>
                <td className="px-6 py-4">
                  {isEditing ? (
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value as KeywordCategory)}
                      className="px-3 py-2 bg-secondary/50 border border-border rounded text-foreground text-sm"
                    >
                      {Object.values(KeywordCategory).map((cat) => (
                        <option key={cat} value={cat}>
                          {categoryColors[cat].label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${colors.bg} ${colors.border} border ${colors.text}`}>
                      {colors.label}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-semibold text-foreground">
                    {keyword.frequency || 0}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{addedDate}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 justify-center">
                    {isEditing ? (
                      <>
                        <Button
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2"
                          onClick={() => saveEdit(keyword.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border p-2"
                          onClick={() => setEditingId(null)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border text-muted-foreground hover:text-foreground p-2"
                          onClick={() => startEdit(keyword)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-500/20 text-red-400 hover:bg-red-500/10 p-2"
                          onClick={() => onDelete(keyword.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
