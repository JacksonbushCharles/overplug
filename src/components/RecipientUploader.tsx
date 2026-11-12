'use client'

import { useCallback, useMemo, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, UploadCloud } from 'lucide-react'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import mammoth from 'mammoth'

import { Button } from '@/components/ui/button'

type RecipientUploaderProps = {
  onRecipientsChange: (recipients: string[]) => void
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase()
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function RecipientUploader({ onRecipientsChange }: RecipientUploaderProps) {
  const [manualText, setManualText] = useState('')
  const [imported, setImported] = useState<string[]>([])
  const [summary, setSummary] = useState({ total: 0, valid: 0, invalid: 0, duplicates: 0 })

  const parseText = (text: string) => {
    const items = text
      .split(/\n|,|;/)
      .map((item) => item.trim())
      .filter(Boolean)

    const seen = new Set<string>()
    const valid: string[] = []
    let invalid = 0
    let duplicates = 0

    items.forEach((item) => {
      const normalized = normalizeEmail(item)
      if (!isValidEmail(normalized)) {
        invalid += 1
        return
      }
      if (seen.has(normalized)) {
        duplicates += 1
        return
      }
      seen.add(normalized)
      valid.push(normalized)
    })

    const result = valid
    setImported(result)
    setSummary({ total: items.length, valid: result.length, invalid, duplicates })
    onRecipientsChange(result)
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    const name = file.name.toLowerCase()

    try {
      if (name.endsWith('.csv') || name.endsWith('.txt')) {
        const text = await file.text()
        parseText(text)
      } else if (name.endsWith('.json')) {
        const json = JSON.parse(await file.text())
        const values = Array.isArray(json) ? json : json.emails || []
        parseText(values.join(', '))
      } else if (name.endsWith('.xlsx') || name.endsWith('.xls')) {
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const sheet = workbook.SheetNames[0]
        const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], { defval: '' }) as Array<Record<string, unknown>>
        const values = rows.flatMap((row) => Object.values(row).filter((value): value is string => typeof value === 'string'))
        parseText(values.join(', '))
      } else if (name.endsWith('.docx')) {
        const buffer = await file.arrayBuffer()
        const result = await mammoth.extractRawText({ arrayBuffer: buffer })
        parseText(result.value)
      } else {
        parseText(await file.text())
      }
    } catch {
      setSummary({ total: 0, valid: 0, invalid: 0, duplicates: 0 })
      setImported([])
      onRecipientsChange([])
    }
  }, [onRecipientsChange])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.txt'],
      'application/json': ['.json'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: false,
  })

  const summaryCards = useMemo(
    () => [
      { label: 'Total Imported', value: summary.total },
      { label: 'Valid', value: summary.valid },
      { label: 'Invalid', value: summary.invalid },
      { label: 'Duplicates Removed', value: summary.duplicates },
    ],
    [summary]
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Recipients</h2>
        <p className="text-sm text-muted-foreground">Upload a file or paste addresses manually. Invalid entries are skipped automatically.</p>
      </div>

      <div
        {...getRootProps()}
        className={`cursor-pointer rounded-3xl border border-dashed p-6 text-center transition ${isDragActive ? 'border-cyan-400 bg-cyan-500/10' : 'border-white/10 bg-background/50'}`}
      >
        <input {...getInputProps()} />
        <UploadCloud className="mx-auto mb-3 h-8 w-8 text-cyan-400" />
        <p className="text-sm font-medium">Drop files here or click to browse</p>
        <p className="mt-1 text-sm text-muted-foreground">CSV, TXT, JSON, XLSX, DOCX</p>
      </div>

      <label className="block space-y-2 text-sm">
        <span className="text-muted-foreground">Paste email list manually</span>
        <textarea
          className="min-h-[120px] w-full rounded-2xl border border-white/10 bg-background/70 px-3 py-2.5 outline-none ring-0"
          value={manualText}
          onChange={(event) => {
            const value = event.target.value
            setManualText(value)
            parseText(value)
          }}
          placeholder="john@example.com, jane@example.com"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        {summaryCards.map((item) => (
          <div key={item.label} className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <p className="text-2xl font-semibold">{item.value}</p>
            <p className="text-sm text-muted-foreground">{item.label}</p>
          </div>
        ))}
      </div>

      {imported.length > 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm text-cyan-300">
            <FileText className="h-4 w-4" />
            <span>Imported recipients</span>
          </div>
          <div className="flex max-h-28 flex-wrap gap-2 overflow-y-auto">
            {imported.map((email) => (
              <span key={email} className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200">
                {email}
              </span>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}
