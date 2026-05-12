import type { DiagnosisResult } from '../types'

const MOCK_RESULT: DiagnosisResult = {
  type_name: '静寂なる傀儡師',
  catchphrase: 'あなたの瞳は、冷たいガラス越しにのみ熱を帯びる。',
  description:
    'あなたは日常では言葉少なく穏やかな観察者として振る舞うが、深層心理では視線と沈黙で相手を操ることを渇望している。物理的な接触よりも、精神的な逃げ道を塞ぐことに美学を見出す稀有な存在だ。その静けさの奥に、冷徹な支配の意志が宿っている。',
  radar_scores: {
    Dominance: 72,
    Submission: 20,
    Sadism: 35,
    Masochism: 15,
    Psychological: 100,
    Sensory: 45,
  },
  specific_traits: ['心理的支配', '視線への執着', '静かなる観察'],
  compatible_type: '硝子の檻の住人',
}

export async function mockAnalyze(): Promise<DiagnosisResult> {
  // 本番と同じローディング時間を再現
  await new Promise((r) => setTimeout(r, 2000))
  return MOCK_RESULT
}
