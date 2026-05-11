import type { DiagnosisResult } from '../types'

const MOCK_RESULT: DiagnosisResult = {
  type_name: '静寂なる支配の観察者',
  type_name_en: 'Silent Dominance Observer',
  catchphrase: 'あなたの瞳は、冷たいガラス越しにのみ熱を帯びる。',
  description:
    'あなたは言葉少なく、視線で相手を縛る。心理的な距離を保ちながら、相手の内面を完璧に把握することに喜びを感じる。物理的な拘束よりも、精神的な支配に美学を見出す稀有な存在。その静けさの奥に、深く燃える意志がある。',
  core_attributes: ['心理的支配', '視線への執着', '静かなる観察'],
  dominant_axis: 'psychological',
  secondary_axis: 'voyeurism',
  sensory_preference: 'visual',
  compatible_type: '深淵の探求者',
  partner_advice: 'あなたの静かな視線に身を委ねられる、繊細な魂を求めています。',
  axis_scores: {
    dominance: 72,
    submission: 20,
    bondage: 45,
    discipline: 58,
    sadism: 35,
    masochism: 15,
    psychological: 100,
    sensory: 60,
    exhibitionism: 18,
    voyeurism: 85,
  },
}

export async function mockAnalyze(): Promise<DiagnosisResult> {
  // 本番と同じローディング時間を再現
  await new Promise((r) => setTimeout(r, 2000))
  return MOCK_RESULT
}
