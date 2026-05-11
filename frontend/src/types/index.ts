export interface Question {
  id: string
  text: string
  category?: string
}

export interface Scenario {
  id: string
  title: string
  description: string
  choices: Choice[]
}

export interface Choice {
  id: string
  text: string
}

export interface FreeQuestion {
  id: string
  text: string
  placeholder: string
}

export type Phase1Answers = Record<string, boolean>
export type Phase2Answers = Record<string, string>
export type Phase3Answers = Record<string, string>

export interface AnalyzeRequest {
  phase1Answers: Phase1Answers
  phase2Answers: Phase2Answers
  phase3Answers: Phase3Answers
}

export interface AxisScores {
  dominance: number
  submission: number
  bondage: number
  discipline: number
  sadism: number
  masochism: number
  psychological: number
  sensory: number
  exhibitionism: number
  voyeurism: number
}

export interface DiagnosisResult {
  type_name: string
  type_name_en: string
  catchphrase: string
  description: string
  core_attributes: string[]
  dominant_axis: string
  secondary_axis: string
  sensory_preference: string
  compatible_type: string
  partner_advice: string
  axis_scores: AxisScores
}

export type AppPhase = 'intro' | 'phase1' | 'phase2' | 'phase3' | 'loading' | 'result'
