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

export interface AnalyzeRequest {
  phase1Answers: Phase1Answers
  phase2Answers: Phase2Answers
  phase3Answers: Phase3Texts
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
