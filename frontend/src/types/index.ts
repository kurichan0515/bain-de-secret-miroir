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

export type QuestionSet = 'default' | 'bdsm'

export interface AnalyzeRequest {
  phase1Answers: Phase1Answers
  phase2Answers: Phase2Answers
  phase3Answers: Phase3Answers
  questionSet?: QuestionSet
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

export interface RadarScores {
  Dominance: number
  Submission: number
  Sadism: number
  Masochism: number
  Psychological: number
}

export interface DiagnosisResult {
  type_name: string
  catchphrase: string
  description: string
  radar_scores: RadarScores
  specific_traits: string[]
  compatible_type: string
}

export type AppPhase = 'intro' | 'phase1' | 'phase2' | 'phase3' | 'loading' | 'result'
