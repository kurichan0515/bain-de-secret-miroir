import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAnswerStore } from '../store/useAnswerStore'
import { analyze } from '../lib/api'
import { mockAnalyze } from '../lib/mockApi'
import { AdBanner } from '../components/AdBanner'

const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

const messages = [
  'AIが深淵を解析中...',
  'あなたの言葉を紐解いています...',
  '深層心理の地図を描いています...',
  '秘密の鏡が像を結びます...',
]

export default function LoadingPage() {
  const navigate = useNavigate()
  const { phase1Answers, phase2Answers, phase3Answers, questionSet, setResult } = useAnswerStore()
  const [messageIndex, setMessageIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((i) => (i + 1) % messages.length)
    }, 2000)

    const call = USE_MOCK
      ? mockAnalyze()
      : analyze({ phase1Answers, phase2Answers, phase3Answers, questionSet })

    call
      .then((result) => {
        setResult(result)
        navigate('/result')
      })
      .catch((err) => {
        console.error('API error:', err)
        navigate('/result')
      })
      .finally(() => clearInterval(interval))

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-svh"
      style={{ background: '#05070A' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="relative mb-16">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              width: 120,
              height: 120,
              top: -60,
              left: -60,
              border: '1px solid rgba(26, 43, 72, 0.6)',
            }}
            animate={{
              scale: [1, 2.5 + i * 0.5],
              opacity: [0.6, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: 'easeOut',
            }}
          />
        ))}
        <div
          className="w-16 h-16 rounded-full"
          style={{ background: 'rgba(26, 43, 72, 0.4)', border: '1px solid rgba(26, 43, 72, 0.8)' }}
        />
      </div>

      <motion.p
        key={messageIndex}
        className="text-sm tracking-widest"
        style={{ color: 'rgba(184, 197, 214, 0.7)', fontFamily: 'Shippori Mincho, serif' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        {messages[messageIndex]}
      </motion.p>

      {/* 解析待ち時間を活用したインタースティシャル広告 */}
      <motion.div
        className="absolute bottom-8 w-full px-4"
        style={{ maxWidth: '360px' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <AdBanner format="rectangle" />
      </motion.div>
    </motion.div>
  )
}
