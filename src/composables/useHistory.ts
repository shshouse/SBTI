import type { TestResult } from '~/stores/test'

export interface HistoryRecord {
  id: string
  date: string
  typeCode: string
  typeCn: string
  similarity: number
  levels: Record<string, string>
  rawScores: Record<string, number>
  special: boolean
}

const STORAGE_KEY = 'sbti_history'

export function useHistory() {
  const records = ref<HistoryRecord[]>([])

  function load() {
    if (import.meta.server) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      records.value = raw ? JSON.parse(raw) : []
    } catch {
      records.value = []
    }
  }

  function save() {
    if (import.meta.server) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
  }

  function addRecord(result: TestResult) {
    const record: HistoryRecord = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      date: new Date().toLocaleString('zh-CN'),
      typeCode: result.finalType.code,
      typeCn: result.finalType.cn,
      similarity: result.bestNormal.similarity,
      levels: { ...result.levels },
      rawScores: { ...result.rawScores },
      special: result.special,
    }
    records.value.unshift(record)
    if (records.value.length > 50) records.value = records.value.slice(0, 50)
    save()
    return record
  }

  function removeRecord(id: string) {
    records.value = records.value.filter(r => r.id !== id)
    save()
  }

  function clearAll() {
    records.value = []
    save()
  }

  load()

  return { records, addRecord, removeRecord, clearAll, load }
}
