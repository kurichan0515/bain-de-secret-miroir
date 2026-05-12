import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnswerStore } from '../store/useAnswerStore'
import phase1DataBdsm from '../../../data/question-sets/bdsm/phase1.json'
import phase1DataDefault from '../../../data/question-sets/default/phase1.json'

interface QuestionItem {
  id: number
  text: string
  category: 'dominant' | 'submissive' | 'voyeuristic' | 'sensory' | 'active' | 'passive' | 'observer'
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// カテゴリ色はドラッグ選択時のエフェクトにのみ使用
const CATEGORY_EFFECT: Record<string, { border: string; glow: string; label: string }> = {
  dominant:     { border: 'rgba(160, 30, 30, 0.85)',   glow: 'rgba(150, 20, 20, 0.35)',   label: 'Action' },
  submissive:   { border: 'rgba(26, 60, 100, 0.9)',    glow: 'rgba(26, 43, 72, 0.45)',    label: 'Receive' },
  voyeuristic:  { border: 'rgba(90, 65, 135, 0.75)',   glow: 'rgba(80, 60, 120, 0.3)',    label: 'Observe' },
  sensory:      { border: 'rgba(110, 85, 50, 0.7)',    glow: 'rgba(100, 80, 50, 0.25)',   label: 'Sense' },
  active:       { border: 'rgba(160, 30, 30, 0.85)',   glow: 'rgba(150, 20, 20, 0.35)',   label: 'Lead' },
  passive:      { border: 'rgba(26, 60, 100, 0.9)',    glow: 'rgba(26, 43, 72, 0.45)',    label: 'Follow' },
  observer:     { border: 'rgba(90, 65, 135, 0.75)',   glow: 'rgba(80, 60, 120, 0.3)',    label: 'Watch' },
}

const NEUTRAL_BORDER = 'rgba(255, 255, 255, 0.08)'
const NEUTRAL_BG = 'linear-gradient(160deg, #0A0E14 0%, #1A2B48 100%)'
const DARK_BG = 'linear-gradient(160deg, #060810 0%, #0D1520 100%)'

const cardVariants: Variants = {
  enter: { opacity: 0, y: 60, scale: 0.95 },
  center: { opacity: 1, y: 0, scale: 1 },
  exit: (direction: number) => ({
    opacity: 0,
    x: direction * 300,
    rotate: direction * 12,
    scale: 0.9,
    transition: { duration: 0.35, ease: [0.4, 0, 1, 1] },
  }),
}

const floatingVariants: Variants = {
  animate: {
    y: [-5, 5, -5],
    transition: { duration: 4, repeat: Infinity, ease: [0.45, 0.05, 0.55, 0.95] },
  },
}

export default function Phase1Page() {
  const navigate = useNavigate()
  const setPhase1Answer = useAnswerStore((s) => s.setPhase1Answer)
  const questionSet = useAnswerStore((s) => s.questionSet)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [dragX, setDragX] = useState(0)

  const questions: QuestionItem[] = useMemo(() => {
    const data = questionSet === 'bdsm' ? phase1DataBdsm : phase1DataDefault
    return shuffle(data.questions as QuestionItem[])
  }, [questionSet])

  const currentQuestion = questions[currentIndex]
  const effect = CATEGORY_EFFECT[currentQuestion.category]
  const progress = currentIndex / questions.length

  // ドラッグ強度（0〜1）
  const yesIntensity = Math.min(1, Math.max(0, dragX / 160))
  const noIntensity = Math.min(1, Math.max(0, -dragX / 160))
  const isDraggingYes = dragX > 20
  const isDraggingNo = dragX < -20

  // 動的スタイル計算
  const cardBorderColor = isDraggingYes
    ? effect.border
    : isDraggingNo
    ? `rgba(255,255,255,${0.08 - noIntensity * 0.06})`
    : NEUTRAL_BORDER

  const cardBoxShadow = isDraggingYes
    ? `0 0 ${Math.floor(30 + yesIntensity * 50)}px ${effect.glow}`
    : 'none'

  const cardBackground = isDraggingNo
    ? DARK_BG
    : NEUTRAL_BG

  const answer = useCallback(
    (value: boolean) => {
      setPhase1Answer(String(currentQuestion.id), value)
      setDirection(value ? 1 : -1)
      if (currentIndex + 1 >= questions.length) {
        navigate('/phase2')
      } else {
        setCurrentIndex((i) => i + 1)
      }
    },
    [currentQuestion, currentIndex, setPhase1Answer, navigate]
  )

  return (
    <div className="flex flex-col items-center min-h-svh px-4 py-8" style={{ background: '#05070A' }}>
      {/* プログレスバー — 常にニュートラル */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(184, 197, 214, 0.5)', fontFamily: 'Cinzel, serif' }}>
          <span>Phase I</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'rgba(184, 197, 214, 0.35)' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* カード */}
      <div className="relative flex-1 flex items-center justify-center w-full">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={cardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: 'easeOut' }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDrag={(_, info) => setDragX(info.offset.x)}
            onDragEnd={(_, info) => {
              setDragX(0)
              if (info.offset.x > 100) answer(true)
              else if (info.offset.x < -100) answer(false)
            }}
            style={{
              width: 'min(90vw, 400px)',
              height: '500px',
              background: cardBackground,
              border: `1px solid ${cardBorderColor}`,
              boxShadow: cardBoxShadow,
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem 1.5rem',
              cursor: 'grab',
              userSelect: 'none',
              position: 'relative',
              transition: 'background 0.2s',
            }}
          >
            {/* 問題番号 */}
            <p
              className="absolute top-5 left-5 text-xs tracking-widest"
              style={{ color: 'rgba(184, 197, 214, 0.4)', fontFamily: 'Cinzel, serif' }}
            >
              {String(currentIndex + 1).padStart(2, '0')}
            </p>

            {/* ドラッグ方向エフェクト — YES側：カテゴリカラーラベル */}
            <AnimatePresence>
              {isDraggingYes && (
                <motion.div
                  className="absolute top-5 right-5 text-xs tracking-widest px-2 py-1"
                  style={{
                    color: effect.border,
                    border: `1px solid ${effect.border}`,
                    fontFamily: 'Cinzel, serif',
                    fontSize: '9px',
                    letterSpacing: '0.15em',
                  }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: yesIntensity, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                >
                  {effect.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* 問題文 */}
            <motion.div variants={floatingVariants} animate="animate" style={{ textAlign: 'center' }}>
              <div
                className="font-light"
                style={{
                  fontFamily: 'Shippori Mincho, serif',
                  fontSize: 'clamp(0.8rem, 3.5vw, 0.95rem)',
                  lineHeight: '2.2',
                  textAlign: 'center',
                }}
              >
                {currentQuestion.text
                  .split('\n')
                  .flatMap((line, li) => {
                    const parts = line.split('、')
                    return parts.map((p, i) => (
                      <div key={`${li}-${i}`}>{i < parts.length - 1 ? p + '、' : p}</div>
                    ))
                  })}
              </div>
            </motion.div>

            {/* スワイプヒント */}
            <motion.div
              className="absolute bottom-8 left-0 right-0 flex justify-between px-8 text-xs"
              style={{ color: 'rgba(184, 197, 214, 0.35)', fontFamily: 'Cinzel, serif' }}
              animate={{ opacity: Math.abs(dragX) < 20 ? 1 : 0 }}
            >
              <span>← 惹かれない</span>
              <span>惹かれる →</span>
            </motion.div>

            {/* ドラッグ中ラベル YES */}
            {dragX > 20 && (
              <motion.div
                className="absolute top-6 right-14 text-xs tracking-widest"
                style={{ color: effect.border, fontFamily: 'Cinzel, serif' }}
                animate={{ opacity: Math.min(dragX / 150, 1) }}
              >
                YES
              </motion.div>
            )}
            {/* ドラッグ中ラベル NO */}
            {dragX < -20 && (
              <motion.div
                className="absolute top-6 left-14 text-xs tracking-widest"
                style={{ color: 'rgba(184, 197, 214, 0.5)', fontFamily: 'Cinzel, serif' }}
                animate={{ opacity: Math.min(Math.abs(dragX) / 150, 1) }}
              >
                NO
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ボタン — 常にニュートラル */}
      <div className="flex gap-8 mt-8">
        <button
          onClick={() => answer(false)}
          className="flex items-center justify-center w-16 h-16 rounded-full text-sm"
          style={{
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'transparent',
            color: 'rgba(184, 197, 214, 0.6)',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
          }}
        >
          ✕
        </button>
        <button
          onClick={() => answer(true)}
          className="flex items-center justify-center w-16 h-16 rounded-full text-sm"
          style={{
            border: '1px solid rgba(255,255,255,0.25)',
            background: 'rgba(255,255,255,0.05)',
            color: '#FFFFFF',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
          }}
        >
          ○
        </button>
      </div>
    </div>
  )
}
