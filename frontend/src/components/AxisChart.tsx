import { motion } from 'framer-motion'
import type { AxisScores } from '../types'

const AXIS_LABELS: Record<keyof AxisScores, { ja: string; en: string }> = {
  dominance:    { ja: '支配',   en: 'Dominance' },
  submission:   { ja: '服従',   en: 'Submission' },
  bondage:      { ja: '拘束',   en: 'Bondage' },
  discipline:   { ja: '調教',   en: 'Discipline' },
  sadism:       { ja: '加虐',   en: 'Sadism' },
  masochism:    { ja: '被虐',   en: 'Masochism' },
  psychological:{ ja: '心理',   en: 'Psychological' },
  sensory:      { ja: '感覚',   en: 'Sensory' },
  exhibitionism:{ ja: '露出',   en: 'Exhibitionism' },
  voyeurism:    { ja: '観察',   en: 'Voyeurism' },
}

interface Props {
  scores: AxisScores
  dominantAxis: string
}

export function AxisChart({ scores, dominantAxis }: Props) {
  const sorted = (Object.entries(scores) as [keyof AxisScores, number][])
    .sort(([, a], [, b]) => b - a)

  return (
    <div className="w-full">
      {sorted.map(([key, score], i) => {
        const isDominant = key === dominantAxis
        const label = AXIS_LABELS[key]

        return (
          <motion.div
            key={key}
            className="flex items-center gap-3 mb-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
          >
            {/* 軸名 */}
            <div className="flex flex-col items-end" style={{ minWidth: '52px' }}>
              <span
                className="text-xs"
                style={{
                  fontFamily: 'Shippori Mincho, serif',
                  color: isDominant ? '#FFFFFF' : 'rgba(184, 197, 214, 0.6)',
                  fontWeight: isDominant ? 400 : 300,
                }}
              >
                {label.ja}
              </span>
              <span
                className="text-xs"
                style={{
                  fontFamily: 'Cinzel, serif',
                  fontSize: '8px',
                  color: isDominant ? 'rgba(200,205,215,0.6)' : 'rgba(184,197,214,0.3)',
                  letterSpacing: '0.05em',
                }}
              >
                {label.en}
              </span>
            </div>

            {/* バー */}
            <div
              className="flex-1 relative"
              style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '1px' }}
            >
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  borderRadius: '1px',
                  background: isDominant
                    ? 'linear-gradient(90deg, rgba(26,43,72,0.9), rgba(100,130,200,0.8))'
                    : 'rgba(26,43,72,0.5)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ delay: i * 0.06 + 0.2, duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
              />
            </div>

            {/* スコア */}
            <span
              className="text-xs tabular-nums"
              style={{
                minWidth: '30px',
                textAlign: 'right',
                fontFamily: 'Cinzel, serif',
                color: isDominant ? '#FFFFFF' : 'rgba(184,197,214,0.4)',
              }}
            >
              {score}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
