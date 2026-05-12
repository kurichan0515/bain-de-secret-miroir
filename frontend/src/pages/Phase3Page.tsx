import { motion, AnimatePresence } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnswerStore } from '../store/useAnswerStore'
import { calcTendency } from '../lib/tendency'
import phase3DataBdsm from '../../../data/question-sets/bdsm/phase3.json'
import phase3DataDefault from '../../../data/question-sets/default/phase3.json'

type Tendency = 'dominant' | 'submissive' | 'switch'

interface Question {
  id: string
  title: string
  prompt: string
  placeholder: string
  min_length: number
  max_length: number
}

type Phase3Data = {
  dominant_questions: Question[]
  submissive_questions: Question[]
  switch_questions: Question[]
}

const BORDER_COLOR: Record<Tendency, string> = {
  dominant:   'rgba(150, 20, 20, 0.75)',
  submissive: 'rgba(26, 43, 72, 0.9)',
  switch:     'rgba(80, 60, 120, 0.7)',
}

const GLOW_COLOR: Record<Tendency, string> = {
  dominant:   'rgba(150, 20, 20, 0.2)',
  submissive: 'rgba(26, 43, 72, 0.3)',
  switch:     'rgba(80, 60, 120, 0.15)',
}

// ─── 記述フォーム ────────────────────────────────────────
function QuestionForm({
  question,
  index,
  total,
  tendency,
  onNext,
}: {
  question: Question
  index: number
  total: number
  tendency: Tendency
  onNext: (text: string) => void
}) {
  const [text, setText] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const isValid = text.length >= question.min_length
  const borderColor = BORDER_COLOR[tendency]
  const glowColor = GLOW_COLOR[tendency]

  return (
    <motion.div
      key={question.id}
      className="flex flex-col min-h-svh px-4 py-8"
      style={{ background: '#05070A' }}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      {/* プログレス */}
      <div className="w-full max-w-sm mx-auto mb-8">
        <div className="flex justify-between text-xs mb-2" style={{ color: 'rgba(184, 197, 214, 0.5)', fontFamily: 'Cinzel, serif' }}>
          <span>Phase III</span>
          <span>{index + 1} / {total}</span>
        </div>
        <div className="w-full h-px" style={{ background: 'rgba(255,255,255,0.08)' }}>
          <motion.div
            className="h-full"
            style={{ background: borderColor }}
            animate={{ width: `${(index / total) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full">
        {/* 質問 */}
        <div className="mb-6 px-2">
          <p className="text-xs tracking-widest mb-3" style={{ color: 'rgba(184, 197, 214, 0.4)', fontFamily: 'Cinzel, serif' }}>
            {question.title}
          </p>
          <p
            className="text-sm font-light"
            style={{
              fontFamily: 'Shippori Mincho, serif',
              lineHeight: '2',
              whiteSpace: 'pre-line',
              overflowWrap: 'break-word',
            }}
          >
            {question.prompt}
          </p>
        </div>

        {/* テキストエリア */}
        <div className="flex-1 flex flex-col px-2">
          <div
            className="relative flex-1"
            style={{
              border: `1px solid ${isFocused ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.1)'}`,
              background: 'rgba(5, 7, 10, 0.8)',
              transition: 'border-color 0.3s, box-shadow 0.3s',
              boxShadow: isFocused ? `0 0 20px ${glowColor}` : 'none',
            }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, question.max_length))}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={question.placeholder}
              className="w-full h-full min-h-48 p-5 resize-none bg-transparent outline-none text-sm"
              style={{
                color: '#FFFFFF',
                fontFamily: 'Shippori Mincho, serif',
                lineHeight: '1.9',
                fontStyle: text ? 'normal' : 'italic',
                caretColor: '#FFFFFF',
                wordBreak: 'keep-all',
                overflowWrap: 'anywhere',
              }}
            />
          </div>

          <div className="flex justify-between items-center mt-3 px-1">
            <span className="text-xs" style={{ color: 'rgba(184, 197, 214, 0.4)' }}>
              {text.length < question.min_length
                ? `あと${question.min_length - text.length}文字`
                : `${text.length} / ${question.max_length}`}
            </span>
          </div>
        </div>

        {/* 次へボタン */}
        <motion.button
          onClick={() => isValid && onNext(text)}
          disabled={!isValid}
          className="mt-8 mx-2 py-4 text-sm tracking-widest"
          style={{
            border: `1px solid ${isValid ? borderColor : 'rgba(255,255,255,0.08)'}`,
            background: 'transparent',
            color: isValid ? '#FFFFFF' : 'rgba(255,255,255,0.3)',
            cursor: isValid ? 'pointer' : 'not-allowed',
            fontFamily: 'Cinzel, serif',
            transition: 'all 0.3s',
          }}
          whileHover={isValid ? { backgroundColor: glowColor } : {}}
        >
          {index + 1 >= total ? '解析へ進む' : '最後の問いへ'}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── メインコンポーネント ──────────────────────────────────
export default function Phase3Page() {
  const navigate = useNavigate()
  const { phase1Answers, phase2Answers, setPhase3Answer, questionSet } = useAnswerStore()
  const [currentIndex, setCurrentIndex] = useState(0)

  const tendency: Tendency = useMemo(
    () => calcTendency(phase1Answers, phase2Answers, questionSet),
    [phase1Answers, phase2Answers, questionSet]
  )

  const data = useMemo<Phase3Data>(() => {
    return (questionSet === 'bdsm' ? phase3DataBdsm : phase3DataDefault) as Phase3Data
  }, [questionSet])

  const QUESTIONS: Record<Tendency, Question[]> = useMemo(() => ({
    dominant:   data.dominant_questions,
    submissive: data.submissive_questions,
    switch:     data.switch_questions,
  }), [data])

  const questions = QUESTIONS[tendency]

  const handleNext = (text: string) => {
    const q = questions[currentIndex]
    setPhase3Answer(q.id, text)
    if (currentIndex + 1 >= questions.length) {
      navigate('/loading')
    } else {
      setCurrentIndex((i) => i + 1)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <QuestionForm
        key={questions[currentIndex].id}
        question={questions[currentIndex]}
        index={currentIndex}
        total={questions.length}
        tendency={tendency}
        onNext={handleNext}
      />
    </AnimatePresence>
  )
}
