import phase1DataBdsm from '../../../data/question-sets/bdsm/phase1.json'
import phase2DataBdsm from '../../../data/question-sets/bdsm/phase2.json'
import type { Phase1Answers, Phase2Answers, AxisScores, QuestionSet } from '../types'

const PHASE1_WEIGHT = 1
const PHASE2_WEIGHT = 2

const AXIS_KEYS: (keyof AxisScores)[] = [
  'dominance', 'submission', 'bondage', 'discipline',
  'sadism', 'masochism', 'psychological', 'sensory',
  'exhibitionism', 'voyeurism',
]

// ─── BDSM セット（既存ロジック: axes フィールドから動的生成） ───────────────────

const BDSM_P1_INDEX = Object.fromEntries(
  (phase1DataBdsm.questions as Array<{ id: number; axes: string[] }>).map((q) => [
    String(q.id),
    q.axes as (keyof AxisScores)[],
  ])
)

const BDSM_P2_INDEX: Record<string, Record<string, (keyof AxisScores)[]>> = {}
for (const q of phase2DataBdsm.questions as Array<{
  id: number
  choices: Array<{ id: string; axes: string[] }>
}>) {
  BDSM_P2_INDEX[String(q.id)] = Object.fromEntries(
    q.choices.map((c) => [c.id, c.axes as (keyof AxisScores)[]])
  )
}

// ─── DEFAULT セット（明示スコアテーブル） ─────────────────────────────────────

type ScoreDelta = Partial<Record<keyof AxisScores, number>>

const DEFAULT_P1_SCORES: Record<string, ScoreDelta> = {
  // Q1-15: 支配・加虐
  '1':  { dominance: 1, submission: -1, psychological: 1 },
  '2':  { dominance: 1, submission: -1 },
  '3':  { dominance: 1, submission: -1, sensory: 1 },
  '4':  { dominance: 1, submission: -1, psychological: 1 },
  '5':  { sadism: 1, masochism: -1, psychological: 1 },
  '6':  { dominance: 1, submission: -1 },
  '7':  { dominance: 1, psychological: 1 },
  '8':  { dominance: 1, submission: -1, sadism: 1 },
  '9':  { dominance: 1, sadism: 1, masochism: -1 },
  '10': { dominance: 1, sensory: 1 },
  '11': { dominance: 1, sadism: 1 },
  '12': { dominance: 1, submission: -1 },
  '13': { dominance: 1, submission: -1 },
  '14': { dominance: 1, sadism: 1 },
  '15': { dominance: 1, submission: -1, psychological: 1 },
  // Q16-30: 服従・被虐
  '16': { submission: 1, dominance: -1 },
  '17': { submission: 1, dominance: -1, psychological: 1 },
  '18': { submission: 1, dominance: -1 },
  '19': { submission: 1, dominance: -1, masochism: 1 },
  '20': { submission: 1, dominance: -1 },
  '21': { submission: 1, dominance: -1 },
  '22': { submission: 1, dominance: -1 },
  '23': { submission: 1, masochism: 1, sadism: -1 },
  '24': { submission: 1, masochism: 1, sadism: -1 },
  '25': { submission: 1, masochism: 1 },
  '26': { submission: 1, dominance: -1, sensory: 1 },
  '27': { submission: 1, sensory: 1 },
  '28': { submission: 1, masochism: 1 },
  '29': { submission: 1, masochism: 1, sadism: -1 },
  '30': { submission: 1, dominance: -1, psychological: 1 },
}
// Q31-40: 心理戦。Q39のみ dominance/submission コントラスト追加
for (let i = 31; i <= 40; i++) DEFAULT_P1_SCORES[String(i)] = { psychological: 1 }
DEFAULT_P1_SCORES['39'] = { psychological: 1, dominance: 1, submission: -1 }
// Q41-50: 五感。Q47のみ submission/dominance コントラスト追加
for (let i = 41; i <= 50; i++) DEFAULT_P1_SCORES[String(i)] = { sensory: 1 }
DEFAULT_P1_SCORES['47'] = { sensory: 1, submission: 1, dominance: -1 }

// Phase 2 スコアテーブル (AxisScores外の care は別途管理)
const DEFAULT_P2_SCORES: Record<string, Record<string, ScoreDelta>> = {
  '1': {
    'A': { submission: 3, dominance: -2 },
    'B': { dominance: 3, submission: -2 },
    'C': { psychological: 3 },
    'D': { submission: 1, dominance: -1, psychological: 1 },
  },
  '2': {
    'A': { psychological: 3, masochism: -1 },
    'B': { masochism: 3, sadism: -2, dominance: -1 },
    'C': { psychological: 3, sensory: 1 },
    'D': { sadism: 3, dominance: 1, masochism: -2 },
  },
  '3': {
    'A': { submission: 3, dominance: -2, masochism: 1 },
    'B': { dominance: 3, submission: -2 },
    'C': { sensory: 3, psychological: 1 },
    'D': { psychological: 3, dominance: 1 },
  },
  '4': {
    'A': { sadism: 3, masochism: -2, submission: -1 },
    'B': { masochism: 3, sadism: -2, dominance: -1 },
    'C': { psychological: 3 },
    'D': { dominance: 3, submission: -2 },
  },
  '5': {
    'A': { dominance: 3, submission: -2 },
    'B': { submission: 3, dominance: -2 },
    'C': { psychological: 3 },
    'D': { dominance: 2, psychological: 2, submission: -1 },
  },
  '6': {
    'A': { submission: 3, dominance: -2 },
    'B': { dominance: 3, submission: -2 },   // care +2 は careScore で別管理
    'C': { psychological: 3, sensory: 1 },
    'D': { psychological: 2, dominance: 1 },
  },
}

// Scenario 6-B の care スコア
const DEFAULT_CARE_BONUS: Record<string, Record<string, number>> = {
  '6': { 'B': 2 },
}

// ─── 共通ユーティリティ ─────────────────────────────────────────────────────

function initScores(): AxisScores {
  return {
    dominance: 0, submission: 0, bondage: 0, discipline: 0,
    sadism: 0, masochism: 0, psychological: 0, sensory: 0,
    exhibitionism: 0, voyeurism: 0,
  }
}

function addDelta(raw: AxisScores, delta: ScoreDelta, weight = 1): void {
  for (const [axis, pts] of Object.entries(delta) as [keyof AxisScores, number][]) {
    if (axis in raw) raw[axis] += pts * weight
  }
}

function normalize(raw: AxisScores): AxisScores {
  const max = Math.max(...AXIS_KEYS.map((k) => Math.max(0, raw[k])), 1)
  const result = initScores()
  for (const key of AXIS_KEYS) {
    result[key] = Math.round((Math.max(0, raw[key]) / max) * 100)
  }
  return result
}

// ─── エクスポート ──────────────────────────────────────────────────────────

export interface ScoringResult {
  scores: AxisScores
  careScore: number
}

export function calculateScores(
  phase1Answers: Phase1Answers,
  phase2Answers: Phase2Answers,
  questionSet: QuestionSet = 'bdsm',
): ScoringResult {
  const raw = initScores()
  let careScore = 0

  if (questionSet === 'default') {
    for (const [qId, answered] of Object.entries(phase1Answers)) {
      if (!answered) continue
      const delta = DEFAULT_P1_SCORES[qId]
      if (delta) addDelta(raw, delta)
    }
    for (const [scenarioId, choiceId] of Object.entries(phase2Answers)) {
      const delta = DEFAULT_P2_SCORES[scenarioId]?.[choiceId]
      if (delta) addDelta(raw, delta)
      careScore += DEFAULT_CARE_BONUS[scenarioId]?.[choiceId] ?? 0
    }
  } else {
    for (const [qId, answered] of Object.entries(phase1Answers)) {
      if (!answered) continue
      const axes = BDSM_P1_INDEX[qId] ?? []
      for (const axis of axes) {
        if (axis in raw) raw[axis] += PHASE1_WEIGHT
      }
    }
    for (const [scenarioId, choiceId] of Object.entries(phase2Answers)) {
      const axes = BDSM_P2_INDEX[scenarioId]?.[choiceId] ?? []
      for (const axis of axes) {
        if (axis in raw) raw[axis] += PHASE2_WEIGHT
      }
    }
  }

  return { scores: normalize(raw), careScore }
}
