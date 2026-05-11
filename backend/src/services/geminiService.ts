import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from '@google/generative-ai'
import type { AxisScores, Phase2Answers, Phase3Texts, DiagnosisResult } from '../types'

const SYSTEM_PROMPT = `あなたはエレガントで冷徹な心理アナリストです。

提供されるBDSM的パラメータとユーザーの自由記述を統合し、
相手の魂を鏡に映し出すように言語化してください。

以下のルールを厳守してください：
1. 出力は必ず指定のJSON形式で行うこと
2. 文章は耽美で詩的、かつ心理学的に深い洞察を含むこと
3. ユーザーを決して否定せず、むしろその傾向を「美しき特性」として肯定すること
4. 性的な表現は避け、心理的・美的な言葉で表現すること
5. タイプ名とキャッチコピーは、ユーザーが誇らしく感じられるものにすること`

const INAPPROPRIATE_KEYWORDS = ['性交', 'セックス', '挿入', '暴力', '虐待', '傷つける']

const FALLBACK_RESULT: DiagnosisResult = {
  type_name: '神秘なる探求者',
  type_name_en: 'Mysterious Seeker',
  catchphrase: 'あなたの心は、まだ見ぬ深淵を求めている。',
  description:
    'あなたの内面には、言葉にできない複雑な欲求が渦巻いています。その神秘性こそがあなたの魅力であり、唯一無二の個性です。深く豊かな内面世界を持つあなたは、真の理解者と出会うことで、更なる深みへと昇華していくでしょう。',
  core_attributes: ['探求心', '神秘性', '複雑性'],
  dominant_axis: 'psychological',
  secondary_axis: 'sensory',
  sensory_preference: 'tactile',
  compatible_type: '理解ある導き手',
  partner_advice: 'あなたの複雑な内面を受け入れ、共に探求できる者を。',
}

function buildUserPrompt(
  scores: AxisScores,
  phase2Answers: Phase2Answers,
  phase3Texts: Phase3Texts,
): string {
  return `以下のデータを分析し、この人物の深層心理を診断してください。

# Phase 1 スコア（各軸0-100）
${JSON.stringify(scores, null, 2)}

# Phase 2 選択履歴
${JSON.stringify(phase2Answers, null, 2)}

# Phase 3 自由記述
質問1（暗闇の囁き）: ${phase3Texts.question1}
質問2（絶対的な空白）: ${phase3Texts.question2}

---

上記のデータから、以下の要素を導き出してください：
1. 最も顕著な傾向（支配/服従/拘束/観察など）
2. 心理的な核となる欲求
3. 五感の中で最も敏感な要素
4. パートナーシップにおける理想的な役割

以下のJSON形式のみで出力してください（他のテキストは不要）：

{
  "type_name": "（日本語で詩的なタイプ名、15文字以内）",
  "type_name_en": "（英語タイプ名）",
  "catchphrase": "（30文字以内のキャッチコピー）",
  "description": "（150-200文字の分析文）",
  "core_attributes": ["属性1", "属性2", "属性3"],
  "dominant_axis": "（dominance/submission/bondage/discipline/sadism/masochism/psychological/sensory/exhibitionism/voyeurism のいずれか）",
  "secondary_axis": "（2番目の軸）",
  "sensory_preference": "（visual/auditory/tactile/olfactory/gustatory のいずれか）",
  "compatible_type": "（相性の良いタイプ名）",
  "partner_advice": "（50文字程度のアドバイス）"
}`
}

function validateOutput(result: DiagnosisResult): void {
  const text = JSON.stringify(result)
  for (const keyword of INAPPROPRIATE_KEYWORDS) {
    if (text.includes(keyword)) {
      throw new Error(`Inappropriate content detected: ${keyword}`)
    }
  }
}

function parseResponse(raw: string): DiagnosisResult {
  // 最初の { と最後の } の間を抽出（フェンスの有無に関係なく動作する）
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object found in response')

  const jsonString = raw.slice(start, end + 1)
  const result = JSON.parse(jsonString) as DiagnosisResult

  if (!result.type_name || !result.description || !result.catchphrase) {
    throw new Error('Invalid schema: missing required fields')
  }

  return result
}

export async function generateDiagnosis(
  scores: AxisScores,
  phase2Answers: Phase2Answers,
  phase3Texts: Phase3Texts,
): Promise<DiagnosisResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const genAI = new GoogleGenerativeAI(apiKey)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      // @ts-ignore - Gemini 2.5 の思考トークンを無効化（出力がMAX_TOKENSで切れる問題を防ぐ）
      thinkingConfig: { thinkingBudget: 0 },
    },
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,  threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,  threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT,         threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,        threshold: HarmBlockThreshold.BLOCK_NONE },
    ],
  })

  try {
    const result = await model.generateContent(
      buildUserPrompt(scores, phase2Answers, phase3Texts)
    )

    const raw = result.response.text()
    const diagnosis = parseResponse(raw)
    validateOutput(diagnosis)
    return diagnosis
  } catch (error) {
    console.error('Gemini API error:', error)
    return FALLBACK_RESULT
  }
}
