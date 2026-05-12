import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnswerStore } from '../store/useAnswerStore'
import phase2DataBdsm from '../../../data/question-sets/bdsm/phase2.json'
import phase2DataDefault from '../../../data/question-sets/default/phase2.json'

interface Choice {
  id: string
  text: string
  tag: string
}

interface Question {
  id: number
  title: string
  title_en: string
  scenario: string
  choices: Choice[]
}

const rippleVariants: Variants = {
  initial: { scale: 0, opacity: 0.6 },
  animate: {
    scale: 4,
    opacity: 0,
    transition: { duration: 0.8, ease: [0, 0, 0.2, 1] },
  },
}

export default function Phase2Page() {
  const navigate = useNavigate()
  const setPhase2Answer = useAnswerStore((s) => s.setPhase2Answer)
  const questionSet = useAnswerStore((s) => s.questionSet)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null)
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null)

  const questions: Question[] = useMemo(() => {
    const data = questionSet === 'bdsm' ? phase2DataBdsm : phase2DataDefault
    return data.questions as Question[]
  }, [questionSet])

  const current = questions[currentIndex]
  const progress = currentIndex / questions.length

  const handleChoice = (e: React.MouseEvent<HTMLButtonElement>, choiceId: string) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setRipple({ x: e.clientX - rect.left, y: e.clientY - rect.top, key: Date.now() })

    setTimeout(() => {
      setPhase2Answer(String(current.id), choiceId)
      if (currentIndex + 1 >= questions.length) {
        navigate('/transition')
      } else {
        setCurrentIndex((i) => i + 1)
        setRipple(null)
        setHoveredChoice(null)
      }
    }, 400)
  }

  return (
    <motion.div
      className="flex flex-col min-h-svh px-4 py-8"
      style={{ background: '#05070A' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* プログレス */}
      <div className="w-full max-w-sm mx-auto mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(184, 197, 214, 0.5)', fontFamily: 'Cinzel, serif' }}>
          <span>Phase II</span>
          <span>{currentIndex + 1} / {questions.length}</span>
        </div>
        <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full"
            style={{ background: 'rgba(26, 43, 72, 0.9)' }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="flex-1 flex flex-col w-full mx-auto"
          style={{ maxWidth: '480px' }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          {/* シナリオヘッダー */}
          <div className="mb-6 px-2">
            <div className="flex items-baseline gap-3 mb-3">
              <p className="text-xs tracking-widest" style={{ color: 'rgba(184, 197, 214, 0.4)', fontFamily: 'Cinzel, serif' }}>
                Scenario {String(currentIndex + 1).padStart(2, '0')}
              </p>
              <p className="text-xs tracking-widest" style={{ color: 'rgba(184, 197, 214, 0.25)', fontFamily: 'Cinzel, serif' }}>
                {current.title_en}
              </p>
            </div>
            <h2 className="text-xl font-light mb-5" style={{ fontFamily: 'Shippori Mincho, serif' }}>
              {current.title}
            </h2>
            <p
              className="text-sm"
              style={{
                color: 'rgba(184, 197, 214, 0.75)',
                lineHeight: '2',
                fontFamily: 'Shippori Mincho, serif',
                overflowWrap: 'break-word',
              }}
            >
              {current.scenario}
            </p>
          </div>

          {/* 選択肢 */}
          <div className="flex flex-col gap-3 px-0">
            {current.choices.map((choice) => (
              <div key={choice.id} className="relative overflow-hidden">
                <motion.button
                  onClick={(e) => handleChoice(e, choice.id)}
                  onMouseEnter={() => setHoveredChoice(choice.id)}
                  onMouseLeave={() => setHoveredChoice(null)}
                  onTouchStart={() => setHoveredChoice(choice.id)}
                  onTouchEnd={() => setHoveredChoice(null)}
                  className="w-full text-left px-5 py-4 text-xs relative"
                  style={{
                    background: hoveredChoice === choice.id
                      ? 'rgba(26, 43, 72, 0.55)'
                      : 'rgba(26, 43, 72, 0.25)',
                    border: '1px solid',
                    borderColor: hoveredChoice === choice.id
                      ? 'rgba(255, 255, 255, 0.2)'
                      : 'rgba(255, 255, 255, 0.08)',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    lineHeight: '1.9',
                    fontFamily: 'Shippori Mincho, serif',
                    transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
                    transform: hoveredChoice === choice.id ? 'translateY(-2px)' : 'translateY(0)',
                  }}
                >
                  {/* 選択肢ラベル */}
                  <span
                    className="text-xs mr-3"
                    style={{ color: 'rgba(184, 197, 214, 0.45)', fontFamily: 'Cinzel, serif' }}
                  >
                    {choice.id}
                  </span>
                  <span style={{ overflowWrap: 'break-word' }}>{choice.text}</span>

                  {/* ホバータグ */}
                  <AnimatePresence>
                    {hoveredChoice === choice.id && (
                      <motion.span
                        className="absolute right-4 top-1/2 text-xs tracking-widest px-2 py-0.5"
                        style={{
                          color: 'rgba(184, 197, 214, 0.7)',
                          border: '1px solid rgba(184, 197, 214, 0.2)',
                          fontFamily: 'Shippori Mincho, serif',
                          transform: 'translateY(-50%)',
                          background: 'rgba(5, 7, 10, 0.8)',
                          whiteSpace: 'nowrap',
                        }}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {choice.tag}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {/* 波紋エフェクト */}
                {ripple && (
                  <motion.div
                    key={ripple.key}
                    className="pointer-events-none absolute rounded-full"
                    style={{
                      width: 40,
                      height: 40,
                      left: ripple.x - 20,
                      top: ripple.y - 20,
                      background: 'rgba(26, 43, 72, 0.8)',
                    }}
                    variants={rippleVariants}
                    initial="initial"
                    animate="animate"
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  )
}
