// EPU Data Types
export interface EPUDataPoint {
  date: string
  timestamp: number
  index: number
  economic: number
  political: number
  uncertainty: number
}

// Article Types
export interface Article {
  id: string
  title: string
  url: string
  source: string
  publishedDate: string
  extractedAt: string
  e_score: number
  p_score: number
  u_score: number
  summary?: string
}

// Crawl Job Types
export enum CrawlJobStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export interface CrawlJob {
  id: string
  status: CrawlJobStatus
  startedAt: string
  completedAt?: string
  articlesFound: number
  errors: number
  duration?: number
  progress?: number
}

// Keyword Types
export enum KeywordCategory {
  ECONOMIC = 'economic',
  POLITICAL = 'political',
  UNCERTAINTY = 'uncertainty',
}

export interface Keyword {
  id: string
  text: string
  category: KeywordCategory
  createdAt: string
  frequency?: number
}

// Crawl Status Types
export interface CrawlStatus {
  activeJobs: number
  completedToday: number
  errorCount: number
  lastCrawlTime: string
  totalArticlesToday: number
  successRate: number
}

// Analytics Types
export interface EPUAnalyticsData {
  period: string
  indexValue: number
  economicValue: number
  politicalValue: number
  uncertaintyValue: number
  articlesCount: number
}

export interface KeywordArticleCountRow {
  date: string
  source: string
  sourceKeyword: string
  articleCount: number
}

export interface NewsSource {
  id: number
  name: string
  url: string
  country: string
  region: 'bangladesh' | 'usa' | 'uk' | 'australia' | 'canada' | 'new_zealand' | 'worldwide'
  language: 'en' | 'bn'
  is_active: boolean
  created_at: string
  updated_at: string
}
