import { create } from 'zustand'
import type { Phase1Answers, Phase2Answers, Phase3Answers, DiagnosisResult, AppPhase } from '../types'

interface AnswerStore {
  phase: AppPhase
  phase1Answers: Phase1Answers
  phase2Answers: Phase2Answers
  phase3Answers: Phase3Answers
  result: DiagnosisResult | null

  setPhase: (phase: AppPhase) => void
  setPhase1Answer: (questionId: string, value: boolean) => void
  setPhase2Answer: (scenarioId: string, choiceId: string) => void
  setPhase3Answer: (questionId: string, text: string) => void
  setResult: (result: DiagnosisResult) => void
  reset: () => void
}

const initialState = {
  phase: 'intro' as AppPhase,
  phase1Answers: {} as Phase1Answers,
  phase2Answers: {} as Phase2Answers,
  phase3Answers: {} as Phase3Answers,
  result: null,
}

export const useAnswerStore = create<AnswerStore>((set) => ({
  ...initialState,

  setPhase: (phase) => set({ phase }),

  setPhase1Answer: (questionId, value) =>
    set((state) => ({
      phase1Answers: { ...state.phase1Answers, [questionId]: value },
    })),

  setPhase2Answer: (scenarioId, choiceId) =>
    set((state) => ({
      phase2Answers: { ...state.phase2Answers, [scenarioId]: choiceId },
    })),

  setPhase3Answer: (questionId, text) =>
    set((state) => ({
      phase3Answers: { ...state.phase3Answers, [questionId]: text },
    })),

  setResult: (result) => set({ result }),

  reset: () => set(initialState),
}))
