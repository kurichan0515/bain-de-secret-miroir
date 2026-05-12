import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda'
import { calculateScores } from '../services/scoringService'
import { generateDiagnosis } from '../services/geminiService'
import type { AnalyzeRequest, Phase3Texts } from '../types'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
}

function ok(body: unknown): APIGatewayProxyResultV2 {
  return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify(body) }
}

function error(statusCode: number, message: string): APIGatewayProxyResultV2 {
  return { statusCode, headers: CORS_HEADERS, body: JSON.stringify({ error: message }) }
}

function validate(body: Partial<AnalyzeRequest>): string | null {
  if (!body.phase1Answers || typeof body.phase1Answers !== 'object') {
    return 'phase1Answers is required'
  }
  if (!body.phase2Answers || typeof body.phase2Answers !== 'object') {
    return 'phase2Answers is required'
  }
  if (!body.phase3Answers || typeof body.phase3Answers !== 'object') {
    return 'phase3Answers is required'
  }
  return null
}

export const handler = async (
  event: APIGatewayProxyEventV2,
): Promise<APIGatewayProxyResultV2> => {
  if (event.requestContext.http.method === 'OPTIONS') {
    return { statusCode: 200, headers: CORS_HEADERS, body: '' }
  }

  try {
    const body = JSON.parse(event.body ?? '{}') as Partial<AnalyzeRequest>

    const validationError = validate(body)
    if (validationError) return error(400, validationError)

    const { phase1Answers, phase2Answers, phase3Answers, questionSet } = body as AnalyzeRequest

    const phase3Texts: Phase3Texts = {
      question1: phase3Answers['1'] ?? '',
      question2: phase3Answers['2'] ?? '',
    }

    const { scores, careScore } = calculateScores(phase1Answers, phase2Answers, questionSet ?? 'bdsm')
    const diagnosis = await generateDiagnosis(scores, phase2Answers, phase3Texts, careScore)

    return ok(diagnosis)
  } catch (err) {
    console.error('Handler error:', err)
    return error(500, '診断の生成中にエラーが発生しました。')
  }
}
