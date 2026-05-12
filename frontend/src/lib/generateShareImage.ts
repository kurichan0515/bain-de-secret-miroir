import type { DiagnosisResult, RadarScores } from '../types'

const W = 1200
const H = 630

export async function generateShareImage(result: DiagnosisResult): Promise<Blob> {
  await document.fonts.ready

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')!

  drawBackground(ctx)
  drawHeader(ctx)
  drawTypeInfo(ctx, result)
  drawScoreBars(ctx, result.radar_scores)
  drawDivider(ctx)
  drawCompatibleType(ctx, result.compatible_type)
  drawRadarChart(ctx, result.radar_scores, 880, 400, 148)
  drawFooterHashtags(ctx, result)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('canvas.toBlob failed'))
    }, 'image/png')
  })
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  const bg = ctx.createLinearGradient(0, 0, W, H)
  bg.addColorStop(0, '#05070A')
  bg.addColorStop(0.5, '#0A0E14')
  bg.addColorStop(1, '#05070A')
  ctx.fillStyle = bg
  ctx.fillRect(0, 0, W, H)

  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  ctx.strokeRect(20, 20, W - 40, H - 40)
}

function drawHeader(ctx: CanvasRenderingContext2D) {
  ctx.font = '600 12px Cinzel'
  ctx.fillStyle = 'rgba(184, 197, 214, 0.38)'
  ctx.textAlign = 'left'
  ctx.fillText('BAIN DE SECRET MIROIR', 60, 66)

  ctx.strokeStyle = 'rgba(255,255,255,0.06)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(60, 82)
  ctx.lineTo(W - 60, 82)
  ctx.stroke()
}

function drawTypeInfo(ctx: CanvasRenderingContext2D, result: DiagnosisResult) {
  ctx.font = '10px Cinzel'
  ctx.fillStyle = 'rgba(184, 197, 214, 0.32)'
  ctx.textAlign = 'left'
  ctx.fillText('YOUR TYPE', 60, 116)

  ctx.font = '300 50px "Shippori Mincho"'
  ctx.fillStyle = '#FFFFFF'
  ctx.fillText(result.type_name, 60, 185)

  ctx.font = 'italic 15px "Shippori Mincho"'
  ctx.fillStyle = 'rgba(184, 197, 214, 0.62)'
  wrapText(ctx, result.catchphrase, 60, 222, 500, 28)
}

function drawScoreBars(ctx: CanvasRenderingContext2D, scores: RadarScores) {
  const BAR_X = 60
  const BAR_W = 300
  const BAR_H = 5
  const ROW_H = 34
  let barY = 330

  ctx.font = '10px Cinzel'
  ctx.fillStyle = 'rgba(184, 197, 214, 0.32)'
  ctx.textAlign = 'left'
  ctx.fillText('SPECTRUM SCORE', BAR_X, barY - 10)

  const entries: [string, number][] = [
    ['支配', scores.Dominance],
    ['服従', scores.Submission],
    ['加虐', scores.Sadism],
    ['被虐', scores.Masochism],
    ['心理', scores.Psychological],
  ]
  const maxVal = Math.max(...entries.map(([, v]) => v))

  for (const [label, value] of entries) {
    const dominant = value === maxVal

    ctx.font = '13px "Shippori Mincho"'
    ctx.fillStyle = dominant ? '#FFFFFF' : 'rgba(184, 197, 214, 0.5)'
    ctx.textAlign = 'right'
    ctx.fillText(label, BAR_X + 26, barY + 4)

    ctx.fillStyle = 'rgba(255,255,255,0.04)'
    ctx.fillRect(BAR_X + 34, barY - 3, BAR_W, BAR_H)

    const fillW = (value / 100) * BAR_W
    const grad = ctx.createLinearGradient(BAR_X + 34, 0, BAR_X + 34 + fillW, 0)
    grad.addColorStop(0, dominant ? 'rgba(26,43,72,0.9)' : 'rgba(26,43,72,0.45)')
    grad.addColorStop(1, dominant ? 'rgba(100,130,200,0.9)' : 'rgba(60,90,160,0.45)')
    ctx.fillStyle = grad
    ctx.fillRect(BAR_X + 34, barY - 3, fillW, BAR_H)

    ctx.font = '12px Cinzel'
    ctx.fillStyle = dominant ? '#FFFFFF' : 'rgba(184, 197, 214, 0.32)'
    ctx.textAlign = 'left'
    ctx.fillText(String(value), BAR_X + 34 + BAR_W + 8, barY + 4)

    barY += ROW_H
  }
}

function drawDivider(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(610, 100)
  ctx.lineTo(610, H - 72)
  ctx.stroke()
}

function drawCompatibleType(ctx: CanvasRenderingContext2D, compatibleType: string) {
  ctx.font = '10px Cinzel'
  ctx.fillStyle = 'rgba(184, 197, 214, 0.32)'
  ctx.textAlign = 'left'
  ctx.fillText('COMPATIBLE TYPE', 650, 116)

  ctx.font = '300 34px "Shippori Mincho"'
  ctx.fillStyle = 'rgba(100, 140, 220, 0.88)'
  ctx.fillText(compatibleType, 650, 178)

  ctx.font = '14px "Shippori Mincho"'
  ctx.fillStyle = 'rgba(184, 197, 214, 0.48)'
  wrapText(ctx, 'あなたの深淵を最も深く理解し、共鳴できる存在。', 650, 212, 460, 26)
}

function drawFooterHashtags(ctx: CanvasRenderingContext2D, result: DiagnosisResult) {
  ctx.strokeStyle = 'rgba(255,255,255,0.05)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(60, H - 66)
  ctx.lineTo(W - 60, H - 66)
  ctx.stroke()

  ctx.font = '11px Cinzel'
  ctx.fillStyle = 'rgba(184, 197, 214, 0.22)'
  ctx.textAlign = 'left'
  ctx.fillText(
    `#BainDeSecretMiroir  #${result.type_name}  #${result.compatible_type}`,
    60,
    H - 38,
  )
}

function drawRadarChart(
  ctx: CanvasRenderingContext2D,
  scores: RadarScores,
  cx: number,
  cy: number,
  radius: number,
) {
  const axes = ['Dominance', 'Submission', 'Sadism', 'Masochism', 'Psychological'] as const
  const ja: Record<string, string> = {
    Dominance: '支配', Submission: '服従', Sadism: '加虐', Masochism: '被虐', Psychological: '心理',
  }
  const n = axes.length
  const angle = (i: number) => (i * 2 * Math.PI) / n - Math.PI / 2
  const pt = (i: number, r: number) => ({
    x: cx + r * Math.cos(angle(i)),
    y: cy + r * Math.sin(angle(i)),
  })

  for (let step = 1; step <= 5; step++) {
    const r = (radius * step) / 5
    ctx.beginPath()
    for (let i = 0; i < n; i++) {
      const p = pt(i, r)
      if (i === 0) ctx.moveTo(p.x, p.y)
      else ctx.lineTo(p.x, p.y)
    }
    ctx.closePath()
    ctx.strokeStyle = 'rgba(255,255,255,0.06)'
    ctx.lineWidth = 1
    ctx.stroke()
  }

  for (let i = 0; i < n; i++) {
    const p = pt(i, radius)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(p.x, p.y)
    ctx.strokeStyle = 'rgba(255,255,255,0.09)'
    ctx.lineWidth = 1
    ctx.stroke()

    const lp = pt(i, radius + 24)
    ctx.font = '13px "Shippori Mincho"'
    ctx.fillStyle = 'rgba(184, 197, 214, 0.52)'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(ja[axes[i]], lp.x, lp.y)
  }
  ctx.textBaseline = 'alphabetic'

  ctx.beginPath()
  for (let i = 0; i < n; i++) {
    const r = radius * (scores[axes[i]] / 100)
    const p = pt(i, r)
    if (i === 0) ctx.moveTo(p.x, p.y)
    else ctx.lineTo(p.x, p.y)
  }
  ctx.closePath()

  const fill = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  fill.addColorStop(0, 'rgba(100,140,220,0.5)')
  fill.addColorStop(1, 'rgba(26,43,72,0.15)')
  ctx.fillStyle = fill
  ctx.fill()
  ctx.strokeStyle = 'rgba(100,140,220,0.72)'
  ctx.lineWidth = 2
  ctx.stroke()

  for (let i = 0; i < n; i++) {
    const r = radius * (scores[axes[i]] / 100)
    const p = pt(i, r)
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(150, 185, 255, 0.9)'
    ctx.fill()
  }
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const chars = [...text]
  let line = ''
  let currentY = y
  for (const char of chars) {
    const test = line + char
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, currentY)
      line = char
      currentY += lineHeight
    } else {
      line = test
    }
  }
  if (line) ctx.fillText(line, x, currentY)
}
