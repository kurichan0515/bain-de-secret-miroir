import { motion } from 'framer-motion'
import type { RadarScores } from '../types'

interface TypeInfo {
  key: string
  name: string
  description: string
  matchFn: (s: RadarScores) => boolean
}

const ALL_TYPES: TypeInfo[] = [
  {
    key: 'dominance_sadism',
    name: '規律と執着の支配者',
    description: '相手の感情の揺れや、罰を通じたコントロールに悦びを見出す。直接的で熱を帯びた支配の中に、深い執着が宿る。',
    matchFn: (s) => s.Dominance - s.Submission > 20 && s.Sadism >= s.Psychological,
  },
  {
    key: 'dominance_psychological',
    name: '静寂なる傀儡師',
    description: '言葉や視線で相手の心理的な逃げ道を塞ぐ冷徹な存在。物理的な力ではなく、沈黙と観察によって支配を確立する。',
    matchFn: (s) => s.Dominance - s.Submission > 20 && s.Psychological > s.Sadism,
  },
  {
    key: 'submission_masochism',
    name: '盲目的な殉教者',
    description: '与えられる冷たさや痛みを愛情の証として受け入れ、極限まで依存することを望む。その献身に、独自の美学が宿る。',
    matchFn: (s) => s.Submission - s.Dominance > 20 && s.Masochism >= s.Psychological,
  },
  {
    key: 'submission_psychological',
    name: '硝子の檻の住人',
    description: '見られること、隔離されること、精神的な閉塞感に安堵を覚える。静かで逃避的な服従の中に、深い自由を見出す。',
    matchFn: (s) => s.Submission - s.Dominance > 20 && s.Psychological > s.Masochism,
  },
  {
    key: 'switch_psychological',
    name: '合わせ鏡の共犯者',
    description: '互いの腹を探り合い、役割が入れ替わるヒリヒリとした心理戦を愛する。境界線の揺らぎそのものがこの者の本質だ。',
    matchFn: (s) => Math.abs(s.Dominance - s.Submission) <= 20,
  },
]

function deriveUserType(scores: RadarScores): string {
  return (ALL_TYPES.find((t) => t.matchFn(scores)) ?? ALL_TYPES[4]).key
}

interface Props {
  radarScores: RadarScores
  compatibleType: string
}

export function TypeLandscape({ radarScores, compatibleType }: Props) {
  const userKey = deriveUserType(radarScores)

  return (
    <div className="w-full">
      <p
        className="text-xs tracking-widest mb-5"
        style={{ color: 'rgba(184, 197, 214, 0.4)', fontFamily: 'Cinzel, serif' }}
      >
        Type Landscape
      </p>

      <div className="flex flex-col gap-3">
        {ALL_TYPES.map((type, i) => {
          const isUser = type.key === userKey
          const isCompatible = type.name === compatibleType

          return (
            <motion.div
              key={type.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              style={{
                padding: '14px 16px',
                border: '1px solid',
                borderColor: isUser
                  ? 'rgba(255,255,255,0.2)'
                  : isCompatible
                  ? 'rgba(26,43,72,0.6)'
                  : 'rgba(255,255,255,0.05)',
                background: isUser
                  ? 'rgba(26,43,72,0.3)'
                  : isCompatible
                  ? 'rgba(26,43,72,0.12)'
                  : 'transparent',
                position: 'relative',
              }}
            >
              {isUser && (
                <span
                  className="absolute top-2 right-2 text-xs px-2 py-0.5"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '8px',
                    letterSpacing: '0.1em',
                    color: 'rgba(200,205,215,0.7)',
                    border: '1px solid rgba(200,205,215,0.2)',
                  }}
                >
                  You
                </span>
              )}
              {isCompatible && !isUser && (
                <span
                  className="absolute top-2 right-2 text-xs px-2 py-0.5"
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '8px',
                    letterSpacing: '0.1em',
                    color: 'rgba(100,140,220,0.7)',
                    border: '1px solid rgba(26,43,72,0.5)',
                  }}
                >
                  Compatible
                </span>
              )}

              <p
                className="text-sm font-light mb-1"
                style={{
                  fontFamily: 'Shippori Mincho, serif',
                  color: isUser ? '#FFFFFF' : isCompatible ? 'rgba(100,140,220,0.9)' : 'rgba(255,255,255,0.6)',
                }}
              >
                {type.name}
              </p>
              <p
                className="text-xs text-pretty"
                style={{
                  fontFamily: 'Shippori Mincho, serif',
                  lineHeight: '1.8',
                  color: isUser ? 'rgba(184,197,214,0.8)' : 'rgba(184,197,214,0.4)',
                }}
              >
                {type.description}
              </p>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
