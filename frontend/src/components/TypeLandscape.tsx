import { motion } from 'framer-motion'

interface TypeInfo {
  key: string
  name: string
  name_en: string
  description: string
  dominant_axes: string[]
}

const ALL_TYPES: TypeInfo[] = [
  {
    key: 'dominance',
    name: '優雅なる支配者',
    name_en: 'Dominant Caregiver',
    description: '厳格さと優しさを併せ持つ、理想的な支配者。相手の成長を見守りながら、完璧な管理を実現する。',
    dominant_axes: ['dominance', 'discipline'],
  },
  {
    key: 'submission',
    name: '深淵の探求者',
    name_en: 'Submissive Seeker',
    description: '服従の中に安らぎを見出す献身的な魂。信頼できる相手の前でのみ、真の自分を晒すことができる。',
    dominant_axes: ['submission', 'masochism'],
  },
  {
    key: 'psychological',
    name: '心理的支配者',
    name_en: 'Psychological Master',
    description: '精神的な駆け引きを好む知的な支配者。言葉と沈黙で相手の心を自在に操る。',
    dominant_axes: ['psychological', 'dominance'],
  },
  {
    key: 'sensory',
    name: '感覚の芸術家',
    name_en: 'Sensory Artist',
    description: '五感を通じた繊細な刺激を追求する美学者。温度・音・触覚のすべてを官能へと昇華させる。',
    dominant_axes: ['sensory'],
  },
  {
    key: 'masochism',
    name: '献身的な被虐者',
    name_en: 'Masochistic Devotee',
    description: '痛みと快楽の境界を探求する勇敢な魂。限界を超えた先にある恍惚を知る者。',
    dominant_axes: ['masochism', 'submission'],
  },
  {
    key: 'sadism',
    name: '冷徹なる観察者',
    name_en: 'Sadistic Observer',
    description: '相手の反応を冷静に観察し、刺激を与える探求者。感情を排した精密な支配を行使する。',
    dominant_axes: ['sadism', 'voyeurism'],
  },
  {
    key: 'exhibitionism',
    name: '舞台の主役',
    name_en: 'Exhibitionist Performer',
    description: '見られることで輝く表現者。視線を浴びることで自己を確認し、存在を証明する。',
    dominant_axes: ['exhibitionism'],
  },
  {
    key: 'voyeurism',
    name: '静かなる演出家',
    name_en: 'Voyeuristic Director',
    description: '観察し導く視線を持つ演出者。すべてを見通しながら、影から舞台を作り上げる。',
    dominant_axes: ['voyeurism', 'dominance'],
  },
  {
    key: 'analytical',
    name: '知的な両刃',
    name_en: 'Analytical Switch',
    description: '状況に応じて役割を変える柔軟な知性派。支配と服従の両方を深く理解し、自在に使いこなす。',
    dominant_axes: ['psychological'],
  },
  {
    key: 'bondage',
    name: '拘束の詩人',
    name_en: 'Bondage Enthusiast',
    description: '束縛という芸術を愛する美的探求者。縄目や金属の冷たさに、言葉では表せない美を見出す。',
    dominant_axes: ['bondage'],
  },
]

interface Props {
  dominantAxis: string
  compatibleType: string
}

export function TypeLandscape({ dominantAxis, compatibleType }: Props) {
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
          const isUser = type.dominant_axes.includes(dominantAxis)
          const isCompatible = type.name === compatibleType || type.name_en === compatibleType

          return (
            <motion.div
              key={type.key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{
                padding: '12px 14px',
                border: '1px solid',
                borderColor: isUser
                  ? 'rgba(255,255,255,0.2)'
                  : isCompatible
                  ? 'rgba(26,43,72,0.6)'
                  : 'rgba(255,255,255,0.05)',
                background: isUser
                  ? 'rgba(26,43,72,0.3)'
                  : 'transparent',
                position: 'relative',
              }}
            >
              {/* バッジ */}
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

              <div className="flex items-baseline gap-2 mb-1">
                <span
                  className="text-sm font-light"
                  style={{
                    fontFamily: 'Shippori Mincho, serif',
                    color: isUser ? '#FFFFFF' : 'rgba(255,255,255,0.6)',
                  }}
                >
                  {type.name}
                </span>
                <span
                  style={{
                    fontFamily: 'Cinzel, serif',
                    fontSize: '9px',
                    color: 'rgba(184,197,214,0.3)',
                    letterSpacing: '0.05em',
                  }}
                >
                  {type.name_en}
                </span>
              </div>
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
