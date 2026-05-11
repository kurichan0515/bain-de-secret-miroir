import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMemo } from 'react'
import { useAnswerStore } from '../store/useAnswerStore'
import { calcTendency } from '../lib/tendency'

type Tendency = 'dominant' | 'submissive' | 'switch'

const CARD_CONFIG: Record<Tendency, {
  label: string
  labelEn: string
  title: string
  subtitle: string
  border: string
  glow: string
  gradient: string
}> = {
  dominant: {
    label: 'Action',
    labelEn: 'Dominant',
    title: '支配者の眼差し',
    subtitle: 'あなたの内に、支配の炎が宿っている。',
    border: 'rgba(150, 20, 20, 0.8)',
    glow: '0 0 80px rgba(150, 20, 20, 0.5), 0 0 160px rgba(150, 20, 20, 0.2)',
    gradient: 'linear-gradient(160deg, #0A0E14 0%, #2A0808 100%)',
  },
  submissive: {
    label: 'Receive',
    labelEn: 'Submissive',
    title: '深淵からの告白',
    subtitle: 'あなたは、委ねることの美を知っている。',
    border: 'rgba(26, 43, 72, 0.95)',
    glow: '0 0 80px rgba(26, 43, 72, 0.6), 0 0 160px rgba(26, 43, 72, 0.25)',
    gradient: 'linear-gradient(160deg, #0A0E14 0%, #0A1428 100%)',
  },
  switch: {
    label: 'Observe',
    labelEn: 'Switch',
    title: '合わせ鏡の共犯者',
    subtitle: 'あなたは、役割の境界を自在に漂う。',
    border: 'rgba(80, 60, 120, 0.8)',
    glow: '0 0 80px rgba(80, 60, 120, 0.5), 0 0 160px rgba(80, 60, 120, 0.2)',
    gradient: 'linear-gradient(160deg, #0A0E14 0%, #180A28 100%)',
  },
}

export default function TransitionPage() {
  const navigate = useNavigate()
  const { phase1Answers, phase2Answers } = useAnswerStore()

  const tendency: Tendency = useMemo(
    () => calcTendency(phase1Answers, phase2Answers),
    [phase1Answers, phase2Answers]
  )

  const config = CARD_CONFIG[tendency]

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-svh px-6"
      style={{ background: '#05070A' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* カード */}
      <motion.div
        style={{
          width: 'min(88vw, 360px)',
          padding: '3rem 2.5rem',
          background: config.gradient,
          border: `1px solid ${config.border}`,
          boxShadow: config.glow,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
        }}
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* カテゴリラベル */}
        <motion.div
          className="absolute top-5 right-5 text-xs tracking-widest px-2 py-1"
          style={{
            color: config.border,
            border: `1px solid ${config.border}`,
            fontFamily: 'Cinzel, serif',
            fontSize: '9px',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {config.label}
        </motion.div>

        {/* "あなたのタイプ" */}
        <motion.p
          className="text-xs tracking-widest mb-6"
          style={{ color: 'rgba(184, 197, 214, 0.4)', fontFamily: 'Cinzel, serif' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {config.labelEn}
        </motion.p>

        {/* タイトル */}
        <motion.h2
          className="text-2xl font-light mb-5"
          style={{
            fontFamily: 'Shippori Mincho, serif',
            background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(184, 197, 214, 0.7) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            wordBreak: 'keep-all',
            overflowWrap: 'anywhere',
          }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.8 }}
        >
          {config.title}
        </motion.h2>

        {/* サブタイトル */}
        <motion.p
          className="text-sm italic"
          style={{
            color: 'rgba(184, 197, 214, 0.65)',
            fontFamily: 'Shippori Mincho, serif',
            lineHeight: '1.9',
            wordBreak: 'keep-all',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          {config.subtitle}
        </motion.p>

        {/* 区切り線 */}
        <motion.div
          style={{
            width: '40px',
            height: '1px',
            background: config.border,
            margin: '1.5rem 0',
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        />

        {/* 最後の問いへ誘う文 */}
        <motion.p
          className="text-xs"
          style={{
            color: 'rgba(184, 197, 214, 0.4)',
            fontFamily: 'Shippori Mincho, serif',
            lineHeight: '1.8',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
        >
          最後の問いが、あなたを待っている。
        </motion.p>
      </motion.div>

      {/* 次へボタン */}
      <motion.button
        onClick={() => navigate('/phase3')}
        className="mt-10 px-10 py-4 text-xs tracking-widest"
        style={{
          border: `1px solid ${config.border}`,
          background: 'transparent',
          color: '#FFFFFF',
          cursor: 'pointer',
          fontFamily: 'Cinzel, serif',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.6 }}
        whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)', y: -2 }}
        whileTap={{ scale: 0.97 }}
      >
        次の問いへ
      </motion.button>
    </motion.div>
  )
}
