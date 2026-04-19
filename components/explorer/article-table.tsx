'use client'

import { Article } from '@/lib/types'
import { ExternalLink } from 'lucide-react'

interface ArticleTableProps {
  articles: Article[]
}

export function ArticleTable({ articles }: ArticleTableProps) {
  if (articles.length === 0) {
    return (
      <div className="px-6 py-12 text-center">
        <p className="text-muted-foreground">No articles found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">
              Title
            </th>
            <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">
              Source
            </th>
            <th className="text-center px-6 py-4 font-semibold text-foreground text-sm">
              E Score
            </th>
            <th className="text-center px-6 py-4 font-semibold text-foreground text-sm">
              P Score
            </th>
            <th className="text-center px-6 py-4 font-semibold text-foreground text-sm">
              U Score
            </th>
            <th className="text-left px-6 py-4 font-semibold text-foreground text-sm">
              Published
            </th>
            <th className="text-center px-6 py-4 font-semibold text-foreground text-sm">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article, idx) => {
            const pubDate = new Date(article.publishedDate)
            const formattedDate = pubDate.toLocaleDateString()

            return (
              <tr
                key={article.id}
                className={`border-b border-border hover:bg-card/50 transition-colors ${
                  idx % 2 === 0 ? 'bg-card/30' : ''
                }`}
              >
                <td className="px-6 py-4">
                  <div className="max-w-xs">
                    <p className="text-sm font-medium text-foreground line-clamp-2">
                      {article.title}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-xs font-medium text-blue-400">
                    {article.source}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-xs font-bold text-emerald-400">
                    {article.e_score.toFixed(0)}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-block px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-xs font-bold text-orange-400">
                    {article.p_score.toFixed(0)}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="inline-block px-3 py-1 bg-red-500/10 border border-red-500/20 rounded text-xs font-bold text-red-400">
                    {article.u_score.toFixed(0)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-muted-foreground">{formattedDate}</p>
                </td>
                <td className="px-6 py-4 text-center">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-8 h-8 rounded-lg hover:bg-card/50 border border-border text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
