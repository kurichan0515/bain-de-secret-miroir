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

const DEFAULT_P1_SCORES: Record<string, ScoreDelta> = {}

// Q1–Q8: 管理・ルール → D +1
for (let i = 1; i <= 8; i++) DEFAULT_P1_SCORES[String(i)] = { dominance: 1 }
// Q9–Q15: 焦らし・執着 → D +1, Sad +1
for (let i = 9; i <= 15; i++) DEFAULT_P1_SCORES[String(i)] = { dominance: 1, sadism: 1 }
// Q16–Q22: 放棄・安心 → S +1
for (let i = 16; i <= 22; i++) DEFAULT_P1_SCORES[String(i)] = { submission: 1 }
// Q23–Q30: 窮屈さ・冷たさ → S +1, Mas +1
for (let i = 23; i <= 30; i++) DEFAULT_P1_SCORES[String(i)] = { submission: 1, masochism: 1 }
// Q31–Q40: 観測・背徳・視線・心理戦 → Psy +1
for (let i = 31; i <= 40; i++) DEFAULT_P1_SCORES[String(i)] = { psychological: 1 }
// Q41–Q50: 五感・音・質感・気配 → Sensory +1
for (let i = 41; i <= 50; i++) DEFAULT_P1_SCORES[String(i)] = { sensory: 1 }

// Phase 2 スコアテーブル (AxisScores外の care は別途管理)
const DEFAULT_P2_SCORES: Record<string, Record<string, ScoreDelta>> = {
  '1': {
    'A': { submission: 3 },
    'B': { dominance: 3 },
    'C': { psychological: 3 },
    'D': { dominance: 1, submission: 1 },
  },
  '2': {
    'A': { psychological: 2, sensory: 1 },
    'B': { masochism: 3 },
    'C': { psychological: 3 },
    'D': { dominance: 3, sadism: 1 },
  },
  '3': {
    'A': { submission: 3, masochism: 1 },
    'B': { dominance: 3 },
    'C': { psychological: 3 },
    'D': { psychological: 3 },
  },
  '4': {
    'A': { sadism: 3 },
    'B': { masochism: 3 },
    'C': { psychological: 3 },
    'D': { dominance: 3 },
  },
  '5': {
    'A': { dominance: 3 },
    'B': { submission: 3 },
    'C': { psychological: 3 },
    'D': { dominance: 2, psychological: 2 },
  },
  '6': {
    'A': { submission: 3 },
    'B': { dominance: 3 },   // care +2 は careScore で別管理
    'C': { psychological: 3 },
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
  const max = Math.max(...AXIS_KEYS.map((k) => raw[k]), 1)
  const result = initScores()
  for (const key of AXIS_KEYS) {
    result[key] = Math.round((raw[key] / max) * 100)
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
