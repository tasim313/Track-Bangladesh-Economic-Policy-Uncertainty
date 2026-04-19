'use client'

import { startTransition, useDeferredValue, useMemo, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { CalendarRange, CheckCircle2, Languages, Link2, Loader2, Orbit, UploadCloud } from 'lucide-react'
import { useUIStore } from '@/stores/ui-store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const YEARS = Array.from({ length: 15 }, (_, index) => 2010 + index)

function normalizeUrl(raw: string) {
  try {
    const url = new URL(raw.trim())
    return url.toString()
  } catch {
    return null
  }
}

function parseUrls(raw: string) {
  const tokens = raw
    .split(/[\n,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean)

  const seen = new Set<string>()
  const valid: string[] = []
  const duplicates: string[] = []
  const invalid: string[] = []

  for (const token of tokens) {
    const normalized = normalizeUrl(token)
    if (!normalized) {
      invalid.push(token)
      continue
    }
    if (seen.has(normalized)) {
      duplicates.push(normalized)
      continue
    }
    seen.add(normalized)
    valid.push(normalized)
  }

  return {
    valid,
    duplicates,
    invalid,
  }
}

export function IngestionPanel() {
  const mode = useUIStore((state) => state.ingestionMode)
  const setMode = useUIStore((state) => state.setIngestionMode)
  const [sources, setSources] = useState<Record<'prothom-alo' | 'daily-star', boolean>>({
    'prothom-alo': true,
    'daily-star': true,
  })
  const [startYear, setStartYear] = useState('2010')
  const [endYear, setEndYear] = useState('2024')
  const [language, setLanguage] = useState<'bangla' | 'english' | 'mixed'>('mixed')
  const [frequency, setFrequency] = useState<'daily' | 'monthly'>('monthly')
  const [rawUrls, setRawUrls] = useState('')

  const deferredUrls = useDeferredValue(rawUrls)
  const parsedUrls = useMemo(() => parseUrls(deferredUrls), [deferredUrls])

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, unknown>) => {
      const response = await fetch('/api/ingestion/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = (await response.json().catch(() => ({}))) as { message?: string }

      if (!response.ok) {
        throw new Error(data.message ?? 'Unable to queue the ingestion job.')
      }

      return data
    },
    onSuccess: (data) => {
      toast.success(data.message ?? 'Ingestion job queued.')
    },
    onError: (error) => {
      toast.error(error.message)
    },
  })

  const selectedSources = Object.entries(sources)
    .filter(([, enabled]) => enabled)
    .map(([key]) => key) as Array<'prothom-alo' | 'daily-star'>

  function submitStandardJob() {
    if (selectedSources.length === 0) {
      toast.error('Choose at least one standard source.')
      return
    }

    if (Number(startYear) > Number(endYear)) {
      toast.error('The start year must be before the end year.')
      return
    }

    mutation.mutate({
      mode: 'standard',
      sources: selectedSources,
      startYear: Number(startYear),
      endYear: Number(endYear),
      language,
      frequency,
    })
  }

  function submitBulkJob() {
    if (parsedUrls.valid.length === 0) {
      toast.error('Add at least one valid URL.')
      return
    }

    mutation.mutate({
      mode: 'bulk',
      urls: parsedUrls.valid,
    })
  }

  return (
    <Card className="overflow-hidden border-border/70 bg-card/90 shadow-xl shadow-slate-950/5">
      <div className="grid gap-8 p-6 lg:grid-cols-[1.05fr_0.95fr] lg:p-8">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <Orbit className="size-3.5" />
              Universal Ingester
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Ingest systematic archives or submit external evidence in bulk.</h2>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                Switch between curated academic crawling and high-volume URL evidence collection without blocking the UI.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-4">
            <Switch
              checked={mode === 'bulk'}
              onCheckedChange={(checked) =>
                startTransition(() => {
                  setMode(checked ? 'bulk' : 'standard')
                })
              }
            />
            <div>
              <p className="font-medium">{mode === 'bulk' ? 'Bulk Link Input' : 'Standard Sources'}</p>
              <p className="text-sm text-muted-foreground">
                {mode === 'bulk'
                  ? 'Treat every validated URL as external evidence for the keyword scorer.'
                  : 'Use the Prothom Alo and Daily Star presets with date, language, and frequency controls.'}
              </p>
            </div>
          </div>

          {mode === 'standard' ? (
            <div className="space-y-6 rounded-[1.5rem] border border-blue-200/70 bg-[linear-gradient(135deg,rgba(59,130,246,0.08),rgba(34,197,94,0.08))] p-5 dark:border-blue-500/20">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-3">
                  <Label className="flex items-center gap-2 text-sm font-medium">
                    <CheckCircle2 className="size-4 text-[#3b82f6]" />
                    Preset sources
                  </Label>
                  <div className="grid gap-3">
                    {[
                      {
                        key: 'prothom-alo' as const,
                        title: 'Prothom Alo',
                        description: 'Bangla coverage for the academic crawl preset.',
                      },
                      {
                        key: 'daily-star' as const,
                        title: 'The Daily Star',
                        description: 'English coverage for cross-language comparison.',
                      },
                    ].map((source) => (
                      <label
                        key={source.key}
                        className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border/70 bg-background/80 p-4 transition hover:border-primary/40"
                      >
                        <Checkbox
                          checked={sources[source.key]}
                          onCheckedChange={(checked) =>
                            setSources((current) => ({
                              ...current,
                              [source.key]: Boolean(checked),
                            }))
                          }
                        />
                        <div>
                          <p className="font-medium">{source.title}</p>
                          <p className="text-sm text-muted-foreground">{source.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <CalendarRange className="size-4 text-[#a855f7]" />
                        Start year
                      </Label>
                      <Select value={startYear} onValueChange={setStartYear}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>End year</Label>
                      <Select value={endYear} onValueChange={setEndYear}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {YEARS.map((year) => (
                            <SelectItem key={year} value={String(year)}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Languages className="size-4 text-[#22c55e]" />
                      Language
                    </Label>
                    <Select value={language} onValueChange={(value) => setLanguage(value as typeof language)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mixed">Bangla + English</SelectItem>
                        <SelectItem value="bangla">Bangla only</SelectItem>
                        <SelectItem value="english">English only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <RadioGroup
                      className="grid gap-3 sm:grid-cols-2"
                      value={frequency}
                      onValueChange={(value) => setFrequency(value as typeof frequency)}
                    >
                      {[
                        { value: 'daily', title: 'Daily', text: 'Best for dense archive tracing.' },
                        { value: 'monthly', title: 'Monthly', text: 'Best for broad academic windows.' },
                      ].map((item) => (
                        <label
                          key={item.value}
                          className={cn(
                            'flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition',
                            frequency === item.value ? 'border-primary bg-primary/5' : 'border-border/70 bg-background/80',
                          )}
                        >
                          <RadioGroupItem value={item.value} className="mt-0.5" />
                          <div>
                            <p className="font-medium">{item.title}</p>
                            <p className="text-sm text-muted-foreground">{item.text}</p>
                          </div>
                        </label>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>

              <Button onClick={submitStandardJob} disabled={mutation.isPending} className="w-full sm:w-auto">
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                Queue academic crawl
              </Button>
            </div>
          ) : (
            <div className="space-y-4 rounded-[1.5rem] border border-red-200/70 bg-[linear-gradient(135deg,rgba(239,68,68,0.08),rgba(168,85,247,0.08))] p-5 dark:border-red-500/20">
              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Link2 className="size-4 text-[#ef4444]" />
                  External evidence links
                </Label>
                <Textarea
                  rows={10}
                  placeholder="Paste 1 to 100+ URLs here, separated by commas, spaces, or new lines."
                  value={rawUrls}
                  onChange={(event) => setRawUrls(event.target.value)}
                  className="resize-none bg-background/90"
                />
                <p className="text-sm text-muted-foreground">
                  URLs are parsed client-side, normalized, de-duplicated, and prepared for bulk ingestion.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Valid', value: parsedUrls.valid.length, tone: 'text-[#22c55e]' },
                  { label: 'Duplicates', value: parsedUrls.duplicates.length, tone: 'text-[#a855f7]' },
                  { label: 'Invalid', value: parsedUrls.invalid.length, tone: 'text-[#ef4444]' },
                ].map((item) => (
                  <div key={item.label} className="rounded-2xl border border-border/70 bg-background/80 p-4">
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className={cn('mt-2 text-2xl font-semibold', item.tone)}>{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-dashed border-border/80 bg-background/80 p-4">
                <p className="text-sm font-medium">Queued preview</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {parsedUrls.valid.length === 0
                    ? 'No valid links detected yet.'
                    : `${parsedUrls.valid.slice(0, 4).join(' | ')}${parsedUrls.valid.length > 4 ? ' ...' : ''}`}
                </p>
              </div>

              <Button onClick={submitBulkJob} disabled={mutation.isPending} className="w-full sm:w-auto">
                {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
                Queue external evidence
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {[
            {
              title: 'Mode A',
              subtitle: 'Systematic academic crawl',
              tone: 'from-[#3b82f6]/10 via-[#22c55e]/10 to-transparent',
              points: ['One-click Prothom Alo and Daily Star presets', 'Date range constrained to 2010 to 2024', 'Daily or monthly archive cadence'],
            },
            {
              title: 'Mode B',
              subtitle: 'Custom link ingestion',
              tone: 'from-[#ef4444]/10 via-[#a855f7]/10 to-transparent',
              points: ['1 to 100+ URLs accepted in one textarea', 'Client-side normalization and duplicate removal', 'Scored as external evidence against the EPU lexicon'],
            },
          ].map((item) => (
            <div key={item.title} className={cn('rounded-[1.75rem] border border-border/70 bg-gradient-to-br p-5', item.tone)}>
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{item.title}</p>
              <h3 className="mt-2 text-lg font-semibold">{item.subtitle}</h3>
              <div className="mt-4 space-y-3">
                {item.points.map((point) => (
                  <div key={point} className="flex items-start gap-3 text-sm">
                    <div className="mt-1 size-2 rounded-full bg-primary" />
                    <span className="text-muted-foreground">{point}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-[1.75rem] border border-border/70 bg-card/80 p-5">
            <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Submission notes</p>
            <h3 className="mt-2 text-lg font-semibold">Django-ready API payloads</h3>
            <p className="mt-3 text-sm text-muted-foreground">
              Every queued job is shaped for a bearer-authenticated backend request and can be forwarded to
              <span className="mx-1 rounded bg-muted px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_API_URL</span>
              once the crawler service is live.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
