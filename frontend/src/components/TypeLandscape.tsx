import { motion } from 'framer-motion'
import type { RadarScores } from '../types'

interface TypeInfo {
  key: string
  name: string
  description: string
  matchFn: (s: RadarScores) => boolean
}

const ALL_TYPES: TypeInfo[] = [
  // ── 特殊型（先に判定）
  {
    key: 'observer',
    name: '深淵の傍観者',
    description: '触れ合うことより、ただ密やかに覗き、空気を味わう。観察と没入だけが世界との接点であり、その距離感こそが美学だ。',
    matchFn: (s) => s.Dominance < 30 && s.Submission < 30 && (s.Psychological >= 50 || s.Sensory >= 50),
  },
  {
    key: 'brat',
    name: '悪戯な黒猫',
    description: '従いたいからこそ、あえて牙を剥いて「罰」を引き出す。挑発と服従が表裏一体の、甘く危険な反抗者。',
    matchFn: (s) => s.Submission > s.Dominance && s.Sadism >= 35,
  },
  // ── Switch派生
  {
    key: 'switch_sad_mas',
    name: '境界を灼く双頭の蛇',
    description: '支配する快楽と蹂躙される悦び、その両極端を喰らい尽くす。役割よりも強度と刺激を渇望する境界の存在。',
    matchFn: (s) => Math.abs(s.Dominance - s.Submission) <= 25 && (s.Sadism >= 45 || s.Masochism >= 45),
  },
  {
    key: 'switch_psychological',
    name: '合わせ鏡の共犯者',
    description: '互いの腹を探り合い、役割が入れ替わるヒリヒリとした心理戦を愛する。境界線の揺らぎそのものがこの者の本質だ。',
    matchFn: (s) => Math.abs(s.Dominance - s.Submission) <= 25,
  },
  // ── Dominant派生
  {
    key: 'dominance_sensory',
    name: '官能を統べる調香師',
    description: '音、匂い、温度、質感——五感のすべてを自らの色に染め上げる。感覚的支配こそが最も深い制御だと知っている。',
    matchFn: (s) => s.Dominance - s.Submission > 20 && s.Sensory > s.Psychological && s.Sensory > s.Sadism,
  },
  {
    key: 'dominance_psychological',
    name: '静寂なる傀儡師',
    description: '言葉や視線で相手の心理的な逃げ道を塞ぐ冷徹な存在。物理的な力ではなく、沈黙と観察によって支配を確立する。',
    matchFn: (s) => s.Dominance - s.Submission > 20 && s.Psychological >= s.Sadism && s.Psychological >= s.Sensory,
  },
  {
    key: 'dominance_sadism',
    name: '規律と執着の支配者',
    description: '相手の感情の揺れや、罰を通じたコントロールに悦びを見出す。直接的で熱を帯びた支配の中に、深い執着が宿る。',
    matchFn: (s) => s.Dominance - s.Submission > 20 && s.Sadism > s.Psychological && s.Sadism >= s.Sensory,
  },
  {
    key: 'dominance_pure',
    name: '慈愛と庇護の君主',
    description: '相手の自由を管理し、庇護することこそが愛情表現。執着よりも絶対的な庇護と秩序を求める。',
    matchFn: (s) => s.Dominance - s.Submission > 20,
  },
  // ── Submissive派生
  {
    key: 'submission_sensory',
    name: '泥濘に沈む睡蓮',
    description: '視界を奪われ、感覚の波に溺れていくことに悦びを感じる。五感による没入こそが、この者の服従の形。',
    matchFn: (s) => s.Submission - s.Dominance > 20 && s.Sensory > s.Psychological && s.Sensory > s.Masochism,
  },
  {
    key: 'submission_psychological',
    name: '硝子の檻の住人',
    description: '見られること、隔離されること、精神的な閉塞感に安堵を覚える。静かで逃避的な服従の中に、深い自由を見出す。',
    matchFn: (s) => s.Submission - s.Dominance > 20 && s.Psychological >= s.Masochism && s.Psychological >= s.Sensory,
  },
  {
    key: 'submission_masochism',
    name: '盲目的な殉教者',
    description: '与えられる冷たさや痛みを愛情の証として受け入れ、極限まで依存することを望む。その献身に、独自の美学が宿る。',
    matchFn: (s) => s.Submission - s.Dominance > 20 && s.Masochism > s.Psychological && s.Masochism >= s.Sensory,
  },
  {
    key: 'submission_pure',
    name: '揺り籠の縋り手',
    description: '自らの意思をすべて手放し、絶対的な管理下に落ちたいという純粋な委譲の渇望。甘えと依存こそが本質だ。',
    matchFn: (s) => s.Submission - s.Dominance > 20,
  },
]

function deriveUserType(scores: RadarScores): string {
  return (ALL_TYPES.find((t) => t.matchFn(scores)) ?? ALL_TYPES[3]).key
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
