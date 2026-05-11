import phase1Data from '../../../data/phase1.json'
import phase2Data from '../../../data/phase2.json'
import type { Phase1Answers, Phase2Answers } from '../types'

type Role = 'dominant' | 'submissive' | 'switch'

const DOM_AXES = new Set(['dominance', 'sadism', 'discipline', 'voyeurism'])
const SUB_AXES = new Set(['submission', 'masochism', 'bondage', 'exhibitionism'])

// phase1.json のカテゴリ・axes をインデックス化
const P1_INDEX = Object.fromEntries(
  (phase1Data.questions as Array<{ id: number; category: string; axes: string[] }>).map((q) => [
    String(q.id),
    { category: q.category, axes: q.axes },
  ])
)

// phase2.json の選択肢 axes をインデックス化
const P2_INDEX: Record<string, Record<string, string[]>> = {}
for (const q of phase2Data.questions as Array<{
  id: number
  choices: Array<{ id: string; axes: string[] }>
}>) {
  P2_INDEX[String(q.id)] = Object.fromEntries(q.choices.map((c) => [c.id, c.axes]))
}

export function calcTendency(
  phase1Answers: Phase1Answers,
  phase2Answers: Phase2Answers,
): Role {
  let domScore = 0
  let subScore = 0

  // Phase 1: カテゴリが dominant → dom+1、submissive → sub+1（weight 1）
  for (const [qId, answered] of Object.entries(phase1Answers)) {
    if (!answered) continue
    const q = P1_INDEX[qId]
    if (!q) continue
    if (q.category === 'dominant') domScore += 1
    else if (q.category === 'submissive') subScore += 1
    // voyeuristic / sensory は中立として扱う
    for (const axis of q.axes) {
      if (DOM_AXES.has(axis)) domScore += 0.5
      if (SUB_AXES.has(axis)) subScore += 0.5
    }
  }

  // Phase 2: 選択肢の axes で加算（weight 2）
  for (const [scenarioId, choiceId] of Object.entries(phase2Answers)) {
    const axes = P2_INDEX[scenarioId]?.[choiceId] ?? []
    for (const axis of axes) {
      if (DOM_AXES.has(axis)) domScore += 2
      if (SUB_AXES.has(axis)) subScore += 2
    }
  }

  const total = domScore + subScore
  if (total === 0) return 'switch'

  const domRatio = domScore / total
  if (domRatio >= 0.6) return 'dominant'
  if (domRatio <= 0.4) return 'submissive'
  return 'switch'
}
