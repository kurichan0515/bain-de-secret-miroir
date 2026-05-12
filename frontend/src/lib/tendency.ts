import phase1DataBdsm from '../../../data/question-sets/bdsm/phase1.json'
import phase2DataBdsm from '../../../data/question-sets/bdsm/phase2.json'
import phase1DataDefault from '../../../data/question-sets/default/phase1.json'
import phase2DataDefault from '../../../data/question-sets/default/phase2.json'
import type { Phase1Answers, Phase2Answers } from '../types'
import type { QuestionSet } from '../store/useAnswerStore'

type Role = 'dominant' | 'submissive' | 'switch'

const DOM_AXES = new Set(['dominance', 'sadism', 'discipline', 'voyeurism'])
const SUB_AXES = new Set(['submission', 'masochism', 'bondage', 'exhibitionism'])
const DOM_CATEGORIES = new Set(['dominant', 'active'])
const SUB_CATEGORIES = new Set(['submissive', 'passive'])

function buildP1Index(questions: Array<{ id: number; category: string; axes: string[] }>) {
  return Object.fromEntries(questions.map((q) => [String(q.id), { category: q.category, axes: q.axes }]))
}

function buildP2Index(questions: Array<{ id: number; choices: Array<{ id: string; axes: string[] }> }>) {
  const index: Record<string, Record<string, string[]>> = {}
  for (const q of questions) {
    index[String(q.id)] = Object.fromEntries(q.choices.map((c) => [c.id, c.axes]))
  }
  return index
}

const INDICES = {
  bdsm: {
    p1: buildP1Index(phase1DataBdsm.questions as Array<{ id: number; category: string; axes: string[] }>),
    p2: buildP2Index(phase2DataBdsm.questions as Array<{ id: number; choices: Array<{ id: string; axes: string[] }> }>),
  },
  default: {
    p1: buildP1Index(phase1DataDefault.questions as Array<{ id: number; category: string; axes: string[] }>),
    p2: buildP2Index(phase2DataDefault.questions as Array<{ id: number; choices: Array<{ id: string; axes: string[] }> }>),
  },
}

export function calcTendency(
  phase1Answers: Phase1Answers,
  phase2Answers: Phase2Answers,
  questionSet: QuestionSet = 'default',
): Role {
  const { p1: P1_INDEX, p2: P2_INDEX } = INDICES[questionSet]
  let domScore = 0
  let subScore = 0

  for (const [qId, answered] of Object.entries(phase1Answers)) {
    if (!answered) continue
    const q = P1_INDEX[qId]
    if (!q) continue
    if (DOM_CATEGORIES.has(q.category)) domScore += 1
    else if (SUB_CATEGORIES.has(q.category)) subScore += 1
    for (const axis of q.axes) {
      if (DOM_AXES.has(axis)) domScore += 0.5
      if (SUB_AXES.has(axis)) subScore += 0.5
    }
  }

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
