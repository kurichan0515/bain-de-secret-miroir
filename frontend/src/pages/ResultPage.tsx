import { useState, useCallback } from 'react'
import { motion, type Variants } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAnswerStore } from '../store/useAnswerStore'
import { AdBanner } from '../components/AdBanner'
import { AxisChart } from '../components/AxisChart'
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
  const [imageState, setImageState] = useState<'idle' | 'generating' | 'done'>('idle')

  const handleSaveImage = useCallback(async () => {
    if (!result || imageState === 'generating') return
    setImageState('generating')
    try {
      const blob = await generateShareImage(result)
      const file = new File([blob], 'bain-de-secret-miroir.png', { type: 'image/png' })

      if (
        navigator.share &&
        navigator.canShare &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share({
          files: [file],
          title: `Bain de Secret Miroir — ${result.type_name}`,
        })
      } else {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'bain-de-secret-miroir.png'
        a.click()
        URL.revokeObjectURL(url)
      }
      setImageState('done')
    } catch {
      setImageState('idle')
    }
  }, [result, imageState])

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

  const shareText = encodeURIComponent(
    `【Bain de Secret Miroir】\n私の深層心理タイプは「${result.type_name}」\n相性タイプ:「${result.compatible_type}」\n\n${result.catchphrase}\n\n#BainDeSecretMiroir #${result.type_name} #${result.compatible_type}`
  )
  const shareUrl = encodeURIComponent(window.location.origin)

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
            }}
          >
            <p
              className="text-xs tracking-widest mb-6 text-center"
              style={{ color: 'rgba(184, 197, 214, 0.5)', fontFamily: 'Cinzel, serif' }}
            >
              Your Type
            </p>

            <h1
              className="text-2xl text-center mb-6 leading-relaxed text-balance"
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
              className="text-sm text-center italic text-pretty"
              style={{
                color: 'rgba(184, 197, 214, 0.7)',
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
          <SectionLabel>Compatible Type</SectionLabel>
          <div
            className="p-6"
            style={{
              border: '1px solid rgba(26,43,72,0.6)',
              background: 'rgba(26,43,72,0.12)',
            }}
          >
            <p
              className="text-xs tracking-widest mb-3"
              style={{ color: 'rgba(100,140,220,0.5)', fontFamily: 'Cinzel, serif' }}
            >
              Most Compatible
            </p>
            <p
              className="text-xl mb-4"
              style={{
                fontFamily: 'Shippori Mincho, serif',
                fontWeight: 300,
                color: 'rgba(100, 140, 220, 0.9)',
              }}
            >
              {result.compatible_type}
            </p>
            <p
              className="text-xs text-pretty"
              style={{
                fontFamily: 'Shippori Mincho, serif',
                lineHeight: '1.9',
                color: 'rgba(184,197,214,0.55)',
              }}
            >
              あなたの深淵を最も深く理解し、共鳴できる存在。互いの影が重なることで、はじめて完全な像が結ばれる。
            </p>
          </div>
        </motion.div>

        <Divider />

        {/* ── 軸スコアチャート ── */}
        {result.radar_scores && (
          <motion.div className="px-2" variants={itemVariants}>
            <SectionLabel>BDSM Spectrum Score</SectionLabel>
            <AxisChart scores={result.radar_scores} />
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

          {/* 画像保存 */}
          <button
            onClick={handleSaveImage}
            disabled={imageState === 'generating'}
            className="flex items-center justify-center py-4 text-sm tracking-widest"
            style={{
              border: '1px solid rgba(100,140,220,0.3)',
              background: imageState === 'done'
                ? 'rgba(26,43,72,0.3)'
                : 'transparent',
              color: imageState === 'generating'
                ? 'rgba(184, 197, 214, 0.3)'
                : 'rgba(100,140,220,0.8)',
              cursor: imageState === 'generating' ? 'default' : 'pointer',
              fontFamily: 'Cinzel, serif',
            }}
          >
            {imageState === 'generating'
              ? 'Generating...'
              : imageState === 'done'
              ? 'Image Saved'
              : 'Save Diagnosis Card'}
          </button>

          <p
            className="text-xs text-center"
            style={{
              fontFamily: 'Shippori Mincho, serif',
              color: 'rgba(184, 197, 214, 0.3)',
              lineHeight: '1.6',
            }}
          >
            画像を保存して、X投稿に添付できます
          </p>

          {/* X 共有 */}
          <a
            href={`https://x.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center py-4 text-sm tracking-widest"
            style={{
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'rgba(255,255,255,0.7)',
              fontFamily: 'Cinzel, serif',
              textDecoration: 'none',
            }}
          >
            Share on X
          </a>

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
