import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnswerStore } from '../store/useAnswerStore'
import phase1Data from '../../../data/phase1.json'

interface QuestionItem {
  id: number
  text: string
  category: 'dominant' | 'submissive' | 'voyeuristic' | 'sensory'
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// モジュール読み込み時に1回だけシャッフル（セッション中は順番固定）
const questions: QuestionItem[] = shuffle(phase1Data.questions as QuestionItem[])

// カテゴリごとのラベル・ボーダー色
const CATEGORY_CONFIG = {
  dominant: {
    label: 'Action',
    border: 'rgba(150, 20, 20, 0.75)',    // 赤黒
    glow: 'rgba(150, 20, 20, 0.2)',
  },
  submissive: {
    label: 'Receive',
    border: 'rgba(26, 43, 72, 0.9)',       // 深い紺
    glow: 'rgba(26, 43, 72, 0.4)',
  },
  voyeuristic: {
    label: 'Observe',
    border: 'rgba(80, 60, 120, 0.7)',      // 妖しい紫
    glow: 'rgba(80, 60, 120, 0.25)',
  },
  sensory: {
    label: 'Sense',
    border: 'rgba(100, 80, 50, 0.6)',      // 琥珀
    glow: 'rgba(100, 80, 50, 0.2)',
  },
}

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
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [dragX, setDragX] = useState(0)

  const currentQuestion = questions[currentIndex]
  const config = CATEGORY_CONFIG[currentQuestion.category]
  const progress = currentIndex / questions.length

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
      {/* プログレスバー */}
      <div className="w-full max-w-sm mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(184, 197, 214, 0.5)', fontFamily: 'Cinzel, serif' }}>
          <span>Phase I</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full"
            style={{ background: config.border }}
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
              background: 'linear-gradient(160deg, #0A0E14 0%, #1A2B48 100%)',
              border: `1px solid ${config.border}`,
              boxShadow: `0 0 40px ${config.glow}`,
              borderRadius: '2px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2.5rem',
              cursor: 'grab',
              userSelect: 'none',
              position: 'relative',
            }}
          >
            {/* カテゴリラベル */}
            <div
              className="absolute top-5 right-5 text-xs tracking-widest px-2 py-1"
              style={{
                color: config.border,
                border: `1px solid ${config.border}`,
                fontFamily: 'Cinzel, serif',
                fontSize: '9px',
                letterSpacing: '0.15em',
              }}
            >
              {config.label}
            </div>

            {/* 問題番号 */}
            <p className="absolute top-5 left-5 text-xs tracking-widest" style={{ color: 'rgba(184, 197, 214, 0.4)', fontFamily: 'Cinzel, serif' }}>
              {String(currentIndex + 1).padStart(2, '0')}
            </p>

            {/* 問題文 */}
            <motion.div variants={floatingVariants} animate="animate" style={{ textAlign: 'center' }}>
              <p
                className="font-light"
                style={{
                  fontFamily: 'Shippori Mincho, serif',
                  fontSize: 'clamp(0.85rem, 3.8vw, 1rem)',
                  lineHeight: '2.2',
                  wordBreak: 'keep-all',
                  overflowWrap: 'anywhere',
                  textAlign: 'center',
                }}
              >
                {currentQuestion.text}
              </p>
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

            {/* スワイプ中のラベル */}
            {dragX > 20 && (
              <motion.div
                className="absolute top-6 right-14 text-xs tracking-widest"
                style={{ color: config.border, fontFamily: 'Cinzel, serif' }}
                animate={{ opacity: Math.min(dragX / 150, 1) }}
              >
                YES
              </motion.div>
            )}
            {dragX < -20 && (
              <motion.div
                className="absolute top-6 left-14 text-xs tracking-widest"
                style={{ color: 'rgba(184, 197, 214, 0.7)', fontFamily: 'Cinzel, serif' }}
                animate={{ opacity: Math.min(Math.abs(dragX) / 150, 1) }}
              >
                NO
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ボタン */}
      <div className="flex gap-8 mt-8">
        <button
          onClick={() => answer(false)}
          className="flex items-center justify-center w-16 h-16 rounded-full text-sm"
          style={{
            border: '1px solid rgba(255,255,255,0.15)',
            background: 'transparent',
            color: 'rgba(184, 197, 214, 0.7)',
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
            border: `1px solid ${config.border}`,
            background: config.glow,
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
