'use client'

import { Card } from '@/components/ui/card'
import { Article } from '@/lib/types'
import { ExternalLink } from 'lucide-react'

interface RecentArticlesProps {
  articles: Article[]
}

export function RecentArticles({ articles }: RecentArticlesProps) {
  return (
    <Card className="bg-card border-border p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Recent Articles</h3>

      <div className="space-y-4">
        {articles.slice(0, 5).map((article) => {
          const publishDate = new Date(article.publishedDate)
          const daysAgo = Math.floor((Date.now() - publishDate.getTime()) / (24 * 60 * 60 * 1000))

          return (
            <div
              key={article.id}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-card/50 border border-transparent hover:border-border transition-all cursor-pointer group"
            >
              <div className="flex-1">
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-foreground hover:text-blue-400 line-clamp-2 group-hover:text-blue-400 transition-colors flex items-start gap-2"
                >
                  {article.title}
                  <ExternalLink className="w-3 h-3 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 bg-card/50 rounded border border-border">
                    {article.source}
                  </span>
                  <span>{daysAgo === 0 ? 'Today' : `${daysAgo}d ago`}</span>
                </div>
              </div>

              {/* Score Indicators */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-emerald-400">
                      {article.e_score.toFixed(0)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">E</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-orange-400">
                      {article.p_score.toFixed(0)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">P</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-8 h-8 rounded-lg bg-red-500/20 border border-red-500/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-red-400">
                      {article.u_score.toFixed(0)}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">U</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
