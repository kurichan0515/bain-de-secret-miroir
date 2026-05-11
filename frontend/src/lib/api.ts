import axios from 'axios'
import type { AnalyzeRequest, DiagnosisResult } from '../types'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export async function analyze(payload: AnalyzeRequest): Promise<DiagnosisResult> {
  const { data } = await api.post<DiagnosisResult>('/analyze', payload)
  return data
}
