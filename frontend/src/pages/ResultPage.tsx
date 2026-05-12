import { useState, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAnswerStore } from '../store/useAnswerStore'
import { AdBanner } from '../components/AdBanner'
import { RadarChart } from '../components/RadarChart'
import { TypeLandscape } from '../components/TypeLandscape'
import { generateShareImage } from '../lib/generateShareImage'

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0, 0, 0.2, 1] } },
}

function Divider() {
  return (
    <div className="w-full my-8 px-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} />
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p
      className="text-xs tracking-widest mb-5"
      style={{ color: 'rgba(184, 197, 214, 0.4)', fontFamily: 'Cinzel, serif' }}
    >
      {children}
    </p>
  )
}

export default function ResultPage() {
  const navigate = useNavigate()
  const { result, reset } = useAnswerStore()
  const [saveState, setSaveState] = useState<'idle' | 'generating' | 'done'>('idle')

  const generateImage = useCallback(async () => {
    if (!result) return null
    return await generateShareImage(result)
  }, [result])

  const handleSaveImage = useCallback(async () => {
    if (!result || saveState === 'generating') return
    setSaveState('generating')
    try {
      const blob = await generateImage()
      if (!blob) throw new Error()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'bain-de-secret-miroir.png'
      a.click()
      URL.revokeObjectURL(url)
      setSaveState('done')
    } catch {
      setSaveState('idle')
    }
  }, [result, saveState, generateImage])

  if (!result) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-svh px-6 text-center"
        style={{ background: '#05070A' }}
      >
        <p
          className="text-sm mb-6"
          style={{ color: 'rgba(184, 197, 214, 0.6)', fontFamily: 'Shippori Mincho, serif' }}
        >
          診断結果の取得に失敗しました
        </p>
        <button
          onClick={() => navigate('/')}
          className="text-xs tracking-widest px-8 py-3"
          style={{
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'transparent',
            color: '#fff',
            cursor: 'pointer',
            fontFamily: 'Cinzel, serif',
          }}
        >
          最初からやり直す
        </button>
      </div>
    )
  }

  const handleRetry = () => {
    reset()
    navigate('/')
  }

  return (
    <motion.div
      className="flex flex-col items-center min-h-svh px-4 py-12"
      style={{ background: 'linear-gradient(180deg, #05070A 0%, #0A0E14 60%, #05070A 100%)' }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="w-full" style={{ maxWidth: '480px' }}>

        {/* ── タイプカード ── */}
        <motion.div variants={itemVariants}>
          <div
            className="p-8 mb-6"
            style={{
              background: 'linear-gradient(160deg, #0A0E14 0%, #1A2B48 100%)',
              boxShadow: '0 0 60px rgba(26, 43, 72, 0.5)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-6">
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.08)' }} />
              <p
                className="text-xs tracking-widest"
                style={{ color: 'rgba(184, 197, 214, 0.5)', fontFamily: 'Cinzel, serif', whiteSpace: 'nowrap' }}
              >
                あなたのタイプ
              </p>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <h1
              className="text-2xl text-center mb-4 leading-relaxed"
              style={{
                fontFamily: 'Shippori Mincho, serif',
                fontWeight: 300,
                background: 'linear-gradient(135deg, #FFFFFF 0%, rgba(184, 197, 214, 0.8) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {result.type_name}
            </h1>

            <p
              className="text-sm text-center italic"
              style={{
                color: 'rgba(184, 197, 214, 0.6)',
                fontFamily: 'Shippori Mincho, serif',
                lineHeight: '1.9',
              }}
            >
              {result.catchphrase}
            </p>
          </div>
        </motion.div>

        {/* ── 分析文 ── */}
        <motion.div className="mb-2 px-2" variants={itemVariants}>
          <SectionLabel>Analysis</SectionLabel>
          <p
            className="text-sm text-pretty"
            style={{
              fontFamily: 'Shippori Mincho, serif',
              lineHeight: '2',
              color: 'rgba(255,255,255,0.85)',
            }}
          >
            {result.description}
          </p>
        </motion.div>

        {/* ── 特徴的な傾向 ── */}
        {result.specific_traits.length > 0 && (
          <motion.div className="mt-6 px-2" variants={itemVariants}>
            <SectionLabel>Core Traits</SectionLabel>
            <ul className="space-y-2">
              {result.specific_traits.map((trait, i) => (
                <li
                  key={i}
                  className="text-sm flex items-start gap-3"
                  style={{ fontFamily: 'Shippori Mincho, serif', color: 'rgba(255,255,255,0.8)' }}
                >
                  <span style={{ color: 'rgba(184, 197, 214, 0.4)' }}>—</span>
                  {trait}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <Divider />

        {/* ── 相性タイプカード ── */}
        <motion.div className="px-2" variants={itemVariants}>
          <div
            className="p-6"
            style={{
              border: '1px solid rgba(100,140,220,0.25)',
              background: 'rgba(26,43,72,0.18)',
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div style={{ height: '1px', flex: 1, background: 'rgba(100,140,220,0.15)' }} />
              <p
                className="text-xs tracking-widest"
                style={{ color: 'rgba(100,140,220,0.6)', fontFamily: 'Cinzel, serif', whiteSpace: 'nowrap' }}
              >
                最も相性のいいタイプ
              </p>
              <div style={{ height: '1px', flex: 1, background: 'rgba(100,140,220,0.15)' }} />
            </div>
            <p
              className="text-xl mb-3 text-center"
              style={{
                fontFamily: 'Shippori Mincho, serif',
                fontWeight: 300,
                color: 'rgba(100, 140, 220, 0.9)',
              }}
            >
              {result.compatible_type}
            </p>
            <p
              className="text-xs text-center"
              style={{
                fontFamily: 'Shippori Mincho, serif',
                lineHeight: '1.9',
                color: 'rgba(184,197,214,0.45)',
              }}
            >
              あなたの深淵を最も深く理解し、共鳴できる存在。
            </p>
          </div>
        </motion.div>

        <Divider />

        {/* ── レーダーチャート ── */}
        {result.radar_scores && (
          <motion.div className="px-2" variants={itemVariants}>
            <SectionLabel>BDSM Spectrum Score</SectionLabel>
            <RadarChart scores={result.radar_scores} />
          </motion.div>
        )}

        <Divider />

        {/* ── タイプ一覧 ── */}
        <motion.div className="px-2" variants={itemVariants}>
          <TypeLandscape
            radarScores={result.radar_scores}
            compatibleType={result.compatible_type}
          />
        </motion.div>

        <Divider />

        {/* ── アクション ── */}
        <motion.div className="flex flex-col gap-3 px-2" variants={itemVariants}>

          {/* X 投稿 */}
          <a
            href={`https://x.com/intent/tweet?text=${encodeURIComponent(`【Bain de Secret Miroir】\n私の深層心理タイプは「${result.type_name}」\n相性タイプ:「${result.compatible_type}」\n\n${result.catchphrase}\n\n#BainDeSecretMiroir #${result.type_name} #${result.compatible_type}`)}&url=${encodeURIComponent(window.location.origin)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-4 text-sm tracking-widest"
            style={{
              border: '1px solid rgba(255,255,255,0.2)',
              color: 'rgba(255,255,255,0.85)',
              fontFamily: 'Cinzel, serif',
              textDecoration: 'none',
            }}
          >
            X に投稿する
          </a>

          {/* 画像だけ保存 */}
          <button
            onClick={handleSaveImage}
            disabled={saveState === 'generating'}
            className="flex items-center justify-center py-3 text-xs tracking-widest"
            style={{
              border: '1px solid rgba(100,140,220,0.2)',
              background: 'transparent',
              color: saveState === 'generating' ? 'rgba(100,140,220,0.3)' : 'rgba(100,140,220,0.6)',
              cursor: saveState === 'generating' ? 'default' : 'pointer',
              fontFamily: 'Cinzel, serif',
            }}
          >
            {saveState === 'generating' ? 'Generating...' : saveState === 'done' ? 'Saved ✓' : '診断カードを保存'}
          </button>

          <button
            onClick={handleRetry}
            className="py-3 text-xs tracking-widest"
            style={{
              background: 'transparent',
              border: 'none',
              color: 'rgba(184, 197, 214, 0.4)',
              cursor: 'pointer',
              fontFamily: 'Cinzel, serif',
            }}
          >
            もう一度診断する
          </button>

          <AdBanner
            format="horizontal"
            className="mt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}
          />
        </motion.div>
      </div>
    </motion.div>
  )
}
