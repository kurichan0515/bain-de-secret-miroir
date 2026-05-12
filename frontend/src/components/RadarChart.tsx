import React from 'react'
import { motion } from 'framer-motion'
import type { RadarScores } from '../types'

const AXES = [
  { key: 'Dominance',     ja: '支配' },
  { key: 'Submission',    ja: '服従' },
  { key: 'Sadism',        ja: '加虐' },
  { key: 'Masochism',     ja: '被虐' },
  { key: 'Psychological', ja: '心理' },
  { key: 'Sensory',       ja: '五感' },
] as const

const CX = 150
const CY = 150
const R = 90
const N = AXES.length

const angle = (i: number) => (i * 2 * Math.PI) / N - Math.PI / 2
const pt = (i: number, r: number) => ({
  x: CX + r * Math.cos(angle(i)),
  y: CY + r * Math.sin(angle(i)),
})
const toPoints = (pts: { x: number; y: number }[]) =>
  pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')

interface Props {
  scores: RadarScores
}

export function RadarChart({ scores }: Props) {
  const keys = AXES.map((a) => a.key as keyof RadarScores)
  const maxScore = Math.max(...keys.map((k) => scores[k]))

  const dataPoints = AXES.map((axis, i) => {
    const r = R * (scores[axis.key as keyof RadarScores] / 100)
    return pt(i, r)
  })

  return (
    <div className="flex flex-col items-center">
      <svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        style={{ overflow: 'visible' }}
      >
        {/* グリッドリング */}
        {[1, 2, 3, 4, 5].map((step) => {
          const r = (R * step) / 5
          const pts = Array.from({ length: N }, (_, i) => pt(i, r))
          return (
            <polygon
              key={step}
              points={toPoints(pts)}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="1"
            />
          )
        })}

        {/* 軸ライン */}
        {AXES.map((_, i) => {
          const p = pt(i, R)
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
            />
          )
        })}

        {/* 軸ラベル */}
        {AXES.map((axis, i) => {
          const lp = pt(i, R + 22)
          const score = scores[axis.key as keyof RadarScores]
          const isDominant = score === maxScore
          return (
            <g key={axis.key}>
              <text
                x={lp.x}
                y={lp.y - 5}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="12"
                fontFamily="Shippori Mincho, serif"
                fill={isDominant ? 'rgba(220,228,240,0.9)' : 'rgba(184,197,214,0.5)'}
              >
                {axis.ja}
              </text>
              <text
                x={lp.x}
                y={lp.y + 10}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="9"
                fontFamily="Cinzel, serif"
                fill={isDominant ? 'rgba(150,185,255,0.7)' : 'rgba(184,197,214,0.25)'}
              >
                {score}
              </text>
            </g>
          )
        })}

        {/* データ多角形 */}
        <motion.polygon
          points={toPoints(dataPoints)}
          fill="rgba(26,43,72,0.45)"
          stroke="rgba(100,140,220,0.7)"
          strokeWidth="1.5"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ transformOrigin: `${CX}px ${CY}px` } as React.CSSProperties}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        />

        {/* 頂点ドット */}
        {dataPoints.map((p, i) => (
          <motion.circle
            key={i}
            cx={p.x}
            cy={p.y}
            r="3"
            fill="rgba(150,185,255,0.9)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          />
        ))}
      </svg>
    </div>
  )
}
