import phase1Data from '../../../data/phase1.json'
import phase2Data from '../../../data/phase2.json'
import type { Phase1Answers, Phase2Answers, AxisScores } from '../types'

const PHASE1_WEIGHT = 1
const PHASE2_WEIGHT = 2

const AXIS_KEYS: (keyof AxisScores)[] = [
  'dominance', 'submission', 'bondage', 'discipline',
  'sadism', 'masochism', 'psychological', 'sensory',
  'exhibitionism', 'voyeurism',
]

// phase1.json の axes フィールドをインデックス化
const PHASE1_INDEX = Object.fromEntries(
  (phase1Data.questions as Array<{ id: number; axes: string[] }>).map((q) => [
    String(q.id),
    q.axes as (keyof AxisScores)[],
  ])
)

// phase2.json の choices.axes をインデックス化: { scenarioId: { choiceId: axes[] } }
const PHASE2_INDEX: Record<string, Record<string, (keyof AxisScores)[]>> = {}
for (const q of phase2Data.questions as Array<{
  id: number
  choices: Array<{ id: string; axes: string[] }>
}>) {
  PHASE2_INDEX[String(q.id)] = Object.fromEntries(
    q.choices.map((c) => [c.id, c.axes as (keyof AxisScores)[]])
  )
}

function initScores(): AxisScores {
  return {
    dominance: 0, submission: 0, bondage: 0, discipline: 0,
    sadism: 0, masochism: 0, psychological: 0, sensory: 0,
    exhibitionism: 0, voyeurism: 0,
  }
}

export function calculateScores(
  phase1Answers: Phase1Answers,
  phase2Answers: Phase2Answers,
): AxisScores {
  const raw = initScores()

  // Phase 1：右スワイプした問題の axes を加算
  for (const [qId, answered] of Object.entries(phase1Answers)) {
    if (!answered) continue
    const axes = PHASE1_INDEX[qId] ?? []
    for (const axis of axes) {
      if (axis in raw) raw[axis] += PHASE1_WEIGHT
    }
  }

  // Phase 2：選択した選択肢の axes を weight 2 で加算
  for (const [scenarioId, choiceId] of Object.entries(phase2Answers)) {
    const axes = PHASE2_INDEX[scenarioId]?.[choiceId] ?? []
    for (const axis of axes) {
      if (axis in raw) raw[axis] += PHASE2_WEIGHT
    }
  }

  // 0–100 正規化
  const max = Math.max(...AXIS_KEYS.map((k) => raw[k]), 1)
  const normalized = initScores()
  for (const key of AXIS_KEYS) {
    normalized[key] = Math.round((raw[key] / max) * 100)
  }

  return normalized
}
