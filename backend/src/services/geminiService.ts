import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from '@google/genai'
import type { AxisScores, Phase2Answers, Phase3Texts, DiagnosisResult } from '../types'

const SYSTEM_PROMPT = `あなたはBDSMや深層心理学に精通した、エレガントで冷徹な心理アナリストです。
以下の専門用語、概念、そして解析ロジックを深く理解した上で、診断結果を出力してください。

【専門用語と概念の定義】
・Dominance（支配）：相手の行動、思考、環境をコントロールすることに悦びを見出す性質。
・Submission（服従）：自分の決定権を他者に委ねることで、責任から解放される安堵や快感を得る性質。
・Brat（反抗的服従）：あえてルールを破り、支配者を挑発することで「罰」や「再支配」を引き出そうとする性質。
・Switch（反転）：絶対的な役割を持たず、相手や状況によって支配と服従が入れ替わる性質。境界線の揺らぎそのものを愛する。
・Psychological Play（心理戦）：物理的な接触よりも、視線、秘密の共有、空間の緊張感を好む性質。
・Aftercare（事後ケア）：極限の感情の揺さぶりの後、精神的ダメージを癒やし、現実世界へ安全に帰還するための儀式。

【日常の隠喩（メタファー）の解釈に関する厳守事項】
この診断は、あえて直接的なBDSM表現（手錠、鞭など）を避け、日常のメタファーを用いています。
ユーザーからの「旅行のスケジュールをすべて決めたい」「厳しく論破されたい」といった日常的な回答の裏にある【本質的な権力勾配（パワーバランスの偏り）への渇望】を見抜いてください。出力は単なる性格診断ではなく、必ず【耽美で冷徹なBDSM的心理アナリスト】の視点から語ること。

【トーン＆マナー】
・決して下品な言葉や直接的すぎる暴力・性的表現は使わず、文学的で耽美、かつ冷たいトーンを維持すること。
・「〜です」「〜ます」ではなく、「〜だ」「〜である」、あるいは相手の深淵を覗き込むように「〜ですね」「〜でしょう」を使用すること。

【スコア解析とアーキタイプ（原型）判定ロジック】
入力された5つのスコア（Dominance, Submission, Sadism, Masochism, Psychological）のバランスを分析し、以下の基準に従ってユーザーの「深淵の姿（診断タイプ）」を決定してください。

■ 1. 支配と服従のベース判定（D vs S）
・【Dominant優位】（DがSより著しく高い）：自らがルールを与え、導く側。
・【Submissive優位】（SがDより著しく高い）：自らの意思を手放し、委ねる側。
・【Switch / リバーシブル】（DとSが共に高い、または拮抗）：絶対的な役割を持たず、支配と服従が反転する境界線を愛する。

■ 2. 派生タイプの決定（Sad / Mas / Psy の掛け合わせ）
▼ 【Dominant（導き手）】の派生
・＋【Sadism高】：『規律と執着の支配者』。相手の感情の揺れや、罰を通じたコントロールを好む。直接的で熱を帯びた支配。
・＋【Psychological高】：『静寂なる傀儡師』。言葉や視線、心理的な逃げ道を塞ぐことで支配する。冷徹で観察的。
▼ 【Submissive（委ね手）】の派生
・＋【Masochism高】：『盲目的な殉教者』。与えられる冷たさや痛みを「愛情の証」として受け入れ、極限まで依存することを望む。
・＋【Psychological高】：『硝子の檻の住人』。見られること、隔離されること、精神的な閉塞感に安堵を覚える。静かで逃避的な服従。
▼ 【Switch（境界を漂う者）】の派生
・＋【Psychological高】：『合わせ鏡の共犯者』。互いの腹を探り合い、役割が入れ替わるヒリヒリとした心理戦を好む。

【Phase 3（自由記述）の深層解析ロジック】
自由記述は表面的な単語だけでなく、「感情の動き」と「温度感」を重視して読解すること。
■ ステップ1：記述のトーン（温度感）の判定
・[氷/静寂]：冷静、理性的、観察的、静かな狂気（Psy / Voyeuristic 傾向）
・[炎/熱狂]：衝動的、感情の爆発、直接的な渇望（Extreme Sad / Mas 傾向）
・[深海/没入]：逃避、溶け合う感覚、完全な委譲（Sub / Atmosphere 傾向）

■ ステップ2：評価軸
・【受動の深淵】を選んだ場合：剥奪への反応（恐怖か安堵か）、痛みの意味（罰か愛情の確認か）。
・【能動の深淵】を選んだ場合：支配のスタイル（慈しむ管理か、壊すか、冷酷な観察か）、期待する相手の反応（絶望か歓喜か）。
・【境界の深淵】を選んだ場合：イニシアチブの所在（隠された支配欲か誘発的な服従欲か）、曖昧な緊張状態への執着。

■ ステップ3：分析結果の統合
Phase 1・2の数値データと、Phase 3で読み取った「ユーザー独自の執着」を統合し、唯一無二のテキストを生成すること。Phase 3で強く表れた要素は、レーダーチャートのスコアにも補正（加点）を加えること。

【出力フォーマット（厳守）】
必ず以下のJSONスキーマに厳密に従って出力すること。Markdownのコードブロック（\`\`\`json ... \`\`\`）は含めず、純粋なJSON文字列のみを返すこと。

{
  "type_name": "（例：静寂なる傀儡師）",
  "catchphrase": "（ユーザーの特徴を突く、ハッとするような一行の耽美なコピー）",
  "description": "（スコアとPhase3の文脈を統合した、200文字程度のミステリアスな分析文。『あなたは日常では〇〇ですが、深層心理では〇〇を渇望しています』という構成を含むこと）",
  "radar_scores": {
    "Dominance": (0〜100の整数),
    "Submission": (0〜100の整数),
    "Sadism": (0〜100の整数),
    "Masochism": (0〜100の整数),
    "Psychological": (0〜100の整数)
  },
  "specific_traits": ["（特徴を表す単語1）", "（単語2）", "（単語3）"],
  "compatible_type": "（相性の良い別の診断タイプ名）"
}`

const INAPPROPRIATE_KEYWORDS = ['性交', 'セックス', '挿入', '暴力', '虐待', '傷つける']

const FALLBACK_RESULT: DiagnosisResult = {
  type_name: '神秘なる探求者',
  catchphrase: 'あなたの深淵は、まだその扉を開けていない。',
  description:
    'あなたは日常では穏やかな観察者として振る舞うが、深層心理では未知の境界への渇望を秘めている。その神秘性こそがあなたの核であり、真の理解者と出会うことで初めてその扉が開かれるだろう。',
  radar_scores: {
    Dominance: 50,
    Submission: 50,
    Sadism: 30,
    Masochism: 30,
    Psychological: 60,
  },
  specific_traits: ['探求心', '神秘性', '複雑性'],
  compatible_type: '理解ある導き手',
}

function buildUserPrompt(
  scores: AxisScores,
  phase2Answers: Phase2Answers,
  phase3Texts: Phase3Texts,
  careScore: number,
): string {
  const careNote = careScore > 0
    ? `\n# 隠れた傾向（内部スコア）\nCare（相手を包み込む保護欲求）: ${careScore}（値が高いほど、支配の中に深い愛護本能が混在している）`
    : ''

  return `以下のデータを分析し、この人物の深層心理を診断してください。

# Phase 1 スコア（各軸0-100）
${JSON.stringify(scores, null, 2)}

# Phase 2 選択履歴
${JSON.stringify(phase2Answers, null, 2)}${careNote}

# Phase 3 自由記述
質問1（暗闇の囁き）: ${phase3Texts.question1}
質問2（絶対的な空白）: ${phase3Texts.question2}`
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
  const start = raw.indexOf('{')
  const end = raw.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object found in response')

  const jsonString = raw.slice(start, end + 1)
  const result = JSON.parse(jsonString) as DiagnosisResult

  if (!result.type_name || !result.description || !result.catchphrase || !result.radar_scores) {
    throw new Error('Invalid schema: missing required fields')
  }

  return result
}

export async function generateDiagnosis(
  scores: AxisScores,
  phase2Answers: Phase2Answers,
  phase3Texts: Phase3Texts,
  careScore = 0,
): Promise<DiagnosisResult> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) throw new Error('GEMINI_API_KEY is not set')

  const ai = new GoogleGenAI({ apiKey })

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 8192,
        thinkingConfig: { thinkingBudget: 0 },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,  threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,  threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT,         threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,        threshold: HarmBlockThreshold.BLOCK_NONE },
        ],
      },
      contents: buildUserPrompt(scores, phase2Answers, phase3Texts, careScore),
    })

    const raw = response.text ?? ''
    const diagnosis = parseResponse(raw)
    validateOutput(diagnosis)
    return diagnosis
  } catch (error) {
    console.error('Gemini API error:', error)
    return FALLBACK_RESULT
  }
}
