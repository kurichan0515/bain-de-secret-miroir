import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function IntroPage() {
  const navigate = useNavigate()

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-svh px-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, ease: 'easeInOut' }}
    >
      {/* サービス名 — Cormorant Garamond italic で正しい大文字小文字を表現 */}
      <motion.p
        className="mb-6"
        style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontStyle: 'italic',
          fontSize: '1rem',
          letterSpacing: '0.2em',
          color: 'rgba(184, 197, 214, 0.65)',
        }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
      >
        Bain de Secret Miroir
      </motion.p>

      {/* メインタイトル — clamp でどの画面幅でも1行に収まる */}
      <motion.h1
        className="font-light mb-4"
        style={{
          fontFamily: 'Shippori Mincho, serif',
          fontSize: 'clamp(1.4rem, 6.5vw, 2.25rem)',
          letterSpacing: '0.06em',
          lineHeight: '1.6',
          whiteSpace: 'nowrap',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1.2 }}
      >
        深淵は、あなたを映す鏡
      </motion.h1>

      <motion.p
        className="text-sm leading-loose mb-16 text-pretty"
        style={{ color: 'rgba(184, 197, 214, 0.7)', maxWidth: '18rem' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 1 }}
      >
        あなたの深層心理を映し出す<br />58の問いに答えてください
      </motion.p>

      <motion.button
        onClick={() => navigate('/phase1')}
        className="px-10 py-4 text-sm tracking-[0.2em] border"
        style={{
          borderColor: 'rgba(255, 255, 255, 0.2)',
          fontFamily: 'Cinzel, serif',
          background: 'transparent',
          color: '#FFFFFF',
          cursor: 'pointer',
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
        whileHover={{
          backgroundColor: 'rgba(26, 43, 72, 0.4)',
          borderColor: 'rgba(255, 255, 255, 0.4)',
          y: -2,
        }}
        whileTap={{ scale: 0.98 }}
      >
        診断を始める
      </motion.button>
    </motion.div>
  )
}
