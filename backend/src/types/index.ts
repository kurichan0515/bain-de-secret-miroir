export interface Phase1Answers {
  [questionId: string]: boolean
}

export interface Phase2Answers {
  [scenarioId: string]: string
}

export interface Phase3Texts {
  question1: string
  question2: string
}

export type QuestionSet = 'default' | 'bdsm'

export interface AnalyzeRequest {
  phase1Answers: Phase1Answers
  phase2Answers: Phase2Answers
  phase3Answers: Record<string, string>
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
