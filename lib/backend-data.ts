import { apiFetch } from '@/lib/api'
import { Article, CrawlJob, CrawlJobStatus, EPUDataPoint, Keyword, KeywordArticleCountRow, KeywordCategory, NewsSource } from '@/lib/types'

type PaginatedResponse<T> = {
  count?: number
  next?: string | null
  previous?: string | null
  results?: T[]
}

type DailyScoreResponse = {
  date: string
  source: string
  total_articles: number
  epu_articles: number
  raw_ratio: string | number
  normalized_score: string | number
  economy_count: number
  policy_count: number
  uncertainty_count: number
  updated_at: string
}

type ArticleResponse = {
  id: string
  source: string
  headline: string
  url: string
  published_date: string
  created_at: string
  has_economy_keyword: boolean
  has_policy_keyword: boolean
  has_uncertainty_keyword: boolean
  raw_content?: string
}

type CrawlJobResponse = {
  id: string
  source: string
  date_from: string
  date_to: string
  status: string
  progress_current: number
  progress_total: number
  articles_found: number
  started_at: string | null
  completed_at: string | null
  error_log: string
  created_at: string
}

type KeywordCategoryResponse = {
  id: number
  name: string
  language: string
  keywords: string[]
  updated_at: string
}

type NewsSourceResponse = {
  id: number
  name: string
  url: string
  country: string
  region: NewsSource['region']
  language: NewsSource['language']
  is_active: boolean
  created_at: string
  updated_at: string
}

type AnalyticsSummaryResponse = {
  articles?: {
    total_articles?: number
    total_epu_articles?: number
  }
}

type MonthlyScoreResponse = {
  period: string
  source: string
  avg_normalized: number | string
}

type KeywordArticleCountResponse = {
  date: string
  source: string
  source_keyword: string
  article_count: number
}

function toNumber(value: unknown, fallback = 0) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function unwrapList<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) {
    return payload as T[]
  }

  if (payload && typeof payload === 'object' && Array.isArray((payload as PaginatedResponse<T>).results)) {
    return (payload as PaginatedResponse<T>).results as T[]
  }

  return []
}

function mapKeywordCategory(name: string): KeywordCategory {
  const normalized = name.toLowerCase()

  if (normalized === 'economy' || normalized === 'economic') {
    return KeywordCategory.ECONOMIC
  }

  if (normalized === 'policy' || normalized === 'political') {
    return KeywordCategory.POLITICAL
  }

  return KeywordCategory.UNCERTAINTY
}

export async function fetchDailyEpuData(days = 30): Promise<EPUDataPoint[]> {
  const dateTo = new Date()
  const dateFrom = new Date()
  dateFrom.setDate(dateTo.getDate() - days)

  const params = new URLSearchParams({
    date_from: dateFrom.toISOString().split('T')[0],
    date_to: dateTo.toISOString().split('T')[0],
  })

  const mapRowsToPoints = (data: DailyScoreResponse[]) =>
    data
      .map((item) => {
        const total = toNumber(item.total_articles)
        const economy = total > 0 ? (toNumber(item.economy_count) / total) * 100 : 0
        const political = total > 0 ? (toNumber(item.policy_count) / total) * 100 : 0
        const uncertainty = total > 0 ? (toNumber(item.uncertainty_count) / total) * 100 : 0

        return {
          date: item.date,
          timestamp: new Date(item.date).getTime(),
          index: toNumber(item.normalized_score),
          economic: Number(economy.toFixed(2)),
          political: Number(political.toFixed(2)),
          uncertainty: Number(uncertainty.toFixed(2)),
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)

  const response = await apiFetch(`/api/v1/epu/daily/?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Unable to load EPU data.')
  }

  const payload = (await response.json()) as unknown
  let data = unwrapList<DailyScoreResponse>(payload)

  if (data.length === 0) {
    const fallback = await apiFetch('/api/v1/epu/daily/')
    if (!fallback.ok) {
      throw new Error('Unable to load EPU data.')
    }
    const fallbackPayload = (await fallback.json()) as unknown
    data = unwrapList<DailyScoreResponse>(fallbackPayload)
  }

  return mapRowsToPoints(data)
}

export async function fetchArticles(limit = 500): Promise<Article[]> {
  const response = await apiFetch(`/api/v1/articles/?ordering=-published_date&page_size=${limit}`)
  if (!response.ok) {
    throw new Error('Unable to load articles.')
  }

  const payload = (await response.json()) as unknown
  const rows = unwrapList<ArticleResponse>(payload)

  return rows.map((item) => ({
    id: item.id,
    title: item.headline,
    url: item.url,
    source: item.source,
    publishedDate: item.published_date,
    extractedAt: item.created_at,
    e_score: item.has_economy_keyword ? 100 : 0,
    p_score: item.has_policy_keyword ? 100 : 0,
    u_score: item.has_uncertainty_keyword ? 100 : 0,
    summary: item.raw_content,
  }))
}

export async function fetchCrawlJobs(): Promise<CrawlJob[]> {
  const response = await apiFetch('/api/v1/jobs/?ordering=-created_at')
  if (!response.ok) {
    throw new Error('Unable to load crawl jobs.')
  }

  const payload = (await response.json()) as unknown
  const rows = unwrapList<CrawlJobResponse>(payload)

  return rows.map((item) => {
    const startedAt = item.started_at ?? item.created_at
    const progress = item.progress_total > 0 ? (item.progress_current / item.progress_total) * 100 : item.status === 'completed' ? 100 : 0

    return {
      id: item.id,
      status: item.status as CrawlJobStatus,
      startedAt,
      completedAt: item.completed_at ?? undefined,
      articlesFound: toNumber(item.articles_found),
      errors: item.error_log ? 1 : 0,
      progress: Number(progress.toFixed(1)),
    }
  })
}

export async function createCrawlJob(source: 'daily_star' | 'prothom_alo' | 'both', dateFrom: string, dateTo: string) {
  const response = await apiFetch('/api/v1/jobs/', {
    method: 'POST',
    body: JSON.stringify({
      source,
      date_from: dateFrom,
      date_to: dateTo,
    }),
  })

  if (!response.ok) {
    throw new Error('Unable to create crawl job.')
  }
}

export async function pauseCrawlJob(jobId: string) {
  const response = await apiFetch(`/api/v1/jobs/${jobId}/pause/`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Unable to pause job.')
  }
}

export async function resumeCrawlJob(jobId: string) {
  const response = await apiFetch(`/api/v1/jobs/${jobId}/resume/`, {
    method: 'POST',
  })

  if (!response.ok) {
    throw new Error('Unable to resume job.')
  }
}

export async function cancelCrawlJob(jobId: string) {
  const response = await apiFetch(`/api/v1/jobs/${jobId}/`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Unable to cancel job.')
  }
}

export async function fetchKeywordCategories(): Promise<KeywordCategoryResponse[]> {
  const response = await apiFetch('/api/v1/keywords/')
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please sign in again.')
    }
    throw new Error('Unable to load keyword categories.')
  }

  const payload = (await response.json()) as unknown
  return unwrapList<KeywordCategoryResponse>(payload)
}

export function flattenKeywords(categories: KeywordCategoryResponse[]): Keyword[] {
  return categories.flatMap((category) =>
    category.keywords.map((text, index) => ({
      id: `${category.id}:${index}`,
      text,
      category: mapKeywordCategory(category.name),
      createdAt: category.updated_at,
      frequency: 0,
    })),
  )
}

export async function updateKeywordCategory(id: number, keywords: string[]) {
  const response = await apiFetch(`/api/v1/keywords/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify({ keywords }),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please sign in again.')
    }
    throw new Error('Unable to update keywords.')
  }
}

export async function createKeywordCategory(payload: {
  name: string
  language: 'en' | 'bn'
  keywords: string[]
}) {
  const response = await apiFetch('/api/v1/keywords/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Session expired. Please sign in again.')
    }
    throw new Error('Unable to create keyword category.')
  }
}

export async function fetchAnalyticsSummary(): Promise<AnalyticsSummaryResponse> {
  const response = await apiFetch('/api/v1/analytics/summary/')
  if (!response.ok) {
    throw new Error('Unable to load analytics summary.')
  }

  return (await response.json()) as AnalyticsSummaryResponse
}

export async function fetchKeywordArticleCounts(limit = 200): Promise<KeywordArticleCountRow[]> {
  const params = new URLSearchParams({
    limit: String(limit),
  })

  const response = await apiFetch(`/api/v1/analytics/keyword-article-counts/?${params.toString()}`)
  if (!response.ok) {
    throw new Error('Unable to load source keyword counts.')
  }

  const payload = (await response.json()) as unknown
  const rows = unwrapList<KeywordArticleCountResponse>(payload)

  return rows.map((item) => ({
    date: item.date,
    source: item.source,
    sourceKeyword: item.source_keyword,
    articleCount: toNumber(item.article_count),
  }))
}

export async function fetchNewsSources(): Promise<NewsSource[]> {
  const response = await apiFetch('/api/v1/sources/?ordering=country,name')
  if (!response.ok) {
    throw new Error('Unable to load news sources.')
  }

  const payload = (await response.json()) as unknown
  return unwrapList<NewsSourceResponse>(payload)
}

export async function createNewsSource(payload: {
  name: string
  url: string
  country: string
  region: NewsSource['region']
  language: NewsSource['language']
  is_active: boolean
}) {
  const response = await apiFetch('/api/v1/sources/', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Unable to create news source.')
  }
}

export async function updateNewsSource(
  id: number,
  payload: Partial<{
    name: string
    url: string
    country: string
    region: NewsSource['region']
    language: NewsSource['language']
    is_active: boolean
  }>,
) {
  const response = await apiFetch(`/api/v1/sources/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error('Unable to update news source.')
  }
}

export async function deleteNewsSource(id: number) {
  const response = await apiFetch(`/api/v1/sources/${id}/`, {
    method: 'DELETE',
  })

  if (!response.ok) {
    throw new Error('Unable to delete news source.')
  }
}

export async function fetchMonthlyOverlay() {
  const response = await apiFetch('/api/v1/epu/monthly/')
  if (!response.ok) {
    throw new Error('Unable to load monthly overlay.')
  }

  const payload = (await response.json()) as unknown
  const rows = unwrapList<MonthlyScoreResponse>(payload)

  const bucket = new Map<
    string,
    {
      period: string
      epuIndex: number
      prothomAlo: number
      dailyStar: number
      userLinks: number
      count: number
    }
  >()

  for (const row of rows) {
    const key = row.period.slice(0, 7)
    const existing =
      bucket.get(key) ?? {
        period: key,
        epuIndex: 0,
        prothomAlo: 0,
        dailyStar: 0,
        userLinks: 0,
        count: 0,
      }

    const score = toNumber(row.avg_normalized)

    if (row.source === 'prothom_alo') {
      existing.prothomAlo = score
    } else if (row.source === 'daily_star') {
      existing.dailyStar = score
    }

    existing.epuIndex += score
    existing.count += 1

    bucket.set(key, existing)
  }

  return Array.from(bucket.values())
    .map((item) => ({
      period: item.period,
      epuIndex: item.count > 0 ? Number((item.epuIndex / item.count).toFixed(2)) : 0,
      prothomAlo: Number(item.prothomAlo.toFixed(2)),
      dailyStar: Number(item.dailyStar.toFixed(2)),
      userLinks: 0,
    }))
    .sort((a, b) => a.period.localeCompare(b.period))
}
