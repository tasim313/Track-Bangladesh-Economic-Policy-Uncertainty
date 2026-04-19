import { EPUDataPoint, Article, CrawlJob, CrawlJobStatus, Keyword, KeywordCategory, CrawlStatus } from './types'

// Generate mock EPU data for the last 30 days
export function generateMockEPUData(): EPUDataPoint[] {
  const data: EPUDataPoint[] = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    const baseIndex = 65 + Math.random() * 25
    const economicScore = 70 + Math.random() * 20
    const politicalScore = 60 + Math.random() * 30
    const uncertaintyScore = 55 + Math.random() * 25

    data.push({
      date: date.toISOString().split('T')[0],
      timestamp: date.getTime(),
      index: parseFloat(baseIndex.toFixed(2)),
      economic: parseFloat(economicScore.toFixed(2)),
      political: parseFloat(politicalScore.toFixed(2)),
      uncertainty: parseFloat(uncertaintyScore.toFixed(2)),
    })
  }

  return data
}

// Mock articles data
export function generateMockArticles(): Article[] {
  const sources = ['BBC', 'Reuters', 'AP News', 'DW', 'The Guardian', 'Local News']
  const titles = [
    'Bangladesh announces new economic policy measures',
    'Political uncertainty impacts stock market',
    'Central bank reviews inflation targets',
    'Government implements regulatory reforms',
    'International relations shape trade policy',
    'Currency volatility continues amid policy debates',
    'Labor market shows mixed signals',
    'Foreign investment trends shift',
  ]

  return Array.from({ length: 12 }, (_, i) => ({
    id: `article-${i + 1}`,
    title: titles[i % titles.length] + ` #${i + 1}`,
    url: `https://example.com/article/${i + 1}`,
    source: sources[Math.floor(Math.random() * sources.length)],
    publishedDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
    extractedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
    e_score: parseFloat((50 + Math.random() * 50).toFixed(2)),
    p_score: parseFloat((40 + Math.random() * 60).toFixed(2)),
    u_score: parseFloat((45 + Math.random() * 55).toFixed(2)),
    summary: 'This article discusses important economic and political developments...',
  }))
}

// Mock crawl jobs
export function generateMockCrawlJobs(): CrawlJob[] {
  const statuses = Object.values(CrawlJobStatus)
  
  return Array.from({ length: 5 }, (_, i) => {
    const now = new Date()
    const startedAt = new Date(now.getTime() - (i * 2 + 1) * 60 * 60 * 1000)
    const duration = Math.floor(Math.random() * 3600) + 300

    return {
      id: `job-${i + 1}`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      startedAt: startedAt.toISOString(),
      completedAt: i !== 0 ? new Date(startedAt.getTime() + duration * 1000).toISOString() : undefined,
      articlesFound: Math.floor(Math.random() * 100) + 20,
      errors: Math.floor(Math.random() * 5),
      duration: i !== 0 ? duration : undefined,
      progress: i === 0 ? Math.floor(Math.random() * 100) : 100,
    }
  })
}

// Mock keywords data
export function generateMockKeywords(): Keyword[] {
  const economicKeywords = ['inflation', 'GDP', 'interest rate', 'trade', 'investment', 'fiscal policy']
  const politicalKeywords = ['government', 'election', 'parliament', 'policy', 'reform', 'regulation']
  const uncertaintyKeywords = ['volatility', 'risk', 'uncertainty', 'instability', 'fluctuation', 'crisis']

  const keywords: Keyword[] = []

  economicKeywords.forEach((text, i) => {
    keywords.push({
      id: `kw-e-${i}`,
      text,
      category: KeywordCategory.ECONOMIC,
      createdAt: new Date().toISOString(),
      frequency: Math.floor(Math.random() * 100) + 10,
    })
  })

  politicalKeywords.forEach((text, i) => {
    keywords.push({
      id: `kw-p-${i}`,
      text,
      category: KeywordCategory.POLITICAL,
      createdAt: new Date().toISOString(),
      frequency: Math.floor(Math.random() * 100) + 10,
    })
  })

  uncertaintyKeywords.forEach((text, i) => {
    keywords.push({
      id: `kw-u-${i}`,
      text,
      category: KeywordCategory.UNCERTAINTY,
      createdAt: new Date().toISOString(),
      frequency: Math.floor(Math.random() * 100) + 10,
    })
  })

  return keywords
}

// Mock crawl status
export function generateMockCrawlStatus(): CrawlStatus {
  return {
    activeJobs: Math.floor(Math.random() * 3),
    completedToday: Math.floor(Math.random() * 8) + 3,
    errorCount: Math.floor(Math.random() * 3),
    lastCrawlTime: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
    totalArticlesToday: Math.floor(Math.random() * 300) + 100,
    successRate: 95 + Math.random() * 5,
  }
}
