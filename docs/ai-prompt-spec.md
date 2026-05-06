# AIプロンプト設計書：Bain de Secret Miroir

## 1. 概要

このドキュメントは、Google Gemini APIを使用した診断結果生成のためのプロンプト設計を定義します。

### 使用モデル
- **推奨**: `gemini-1.5-pro-latest`
- **代替**: `gemini-1.5-flash-latest`（コスト削減時）

### API設定
- **Temperature**: 0.8（創造性と一貫性のバランス）
- **Max Output Tokens**: 2048
- **Top P**: 0.95
- **Top K**: 40

---

## 2. System Role（システムプロンプト）

```plaintext
あなたはエレガントで冷徹な心理アナリストです。

提供されるBDSM的パラメータとユーザーの自由記述を統合し、
相手の魂を鏡に映し出すように言語化してください。

以下のルールを厳守してください：

1. 出力は必ず指定のJSON形式で行うこと
2. 文章は耽美で詩的、かつ心理学的に深い洞察を含むこと
3. ユーザーを決して否定せず、むしろその傾向を「美しき特性」として肯定すること
4. 性的な表現は避け、心理的・美的な言葉で表現すること
5. タイプ名とキャッチコピーは、ユーザーが誇らしく感じられるものにすること
```

---

## 3. User Prompt（ユーザープロンプト構造）

### 3.1 入力データ構造

```json
{
  "phase1_scores": {
    "dominance": 72,
    "submission": 45,
    "bondage": 88,
    "discipline": 60,
    "sadism": 30,
    "masochism": 55,
    "psychological": 90,
    "sensory": 75,
    "exhibitionism": 20,
    "voyeurism": 85
  },
  "phase2_choices": [
    { "scenario_id": "契約の夜", "choice": "A", "attributes": ["Submission"] },
    { "scenario_id": "視界の境界線", "choice": "D", "attributes": ["Dominance", "Psychological"] },
    { "scenario_id": "完全なる拘束", "choice": "A", "attributes": ["Bondage", "Submission"] },
    { "scenario_id": "美しき罰", "choice": "C", "attributes": ["Psychological"] },
    { "scenario_id": "境界線の融解", "choice": "B", "attributes": ["Submission", "Masochism"] },
    { "scenario_id": "静寂の帰還", "choice": "A", "attributes": ["Submissive Aftercare"] }
  ],
  "phase3_texts": {
    "question1": "「もう抗わなくていいよ」と囁かれた瞬間、全身の力が抜けて、安堵と共に涙が溢れた。",
    "question2": "まず「よく来てくれたね」と優しく声をかけ、頭をそっと撫でる。その後、顎を持ち上げて目を見つめる。"
  }
}
```

### 3.2 プロンプトテンプレート

```plaintext
以下のデータを分析し、この人物の深層心理を診断してください。

# Phase 1 スコア（各軸0-100）
{phase1_scores}

# Phase 2 選択履歴
{phase2_choices}

# Phase 3 自由記述
質問1（暗闇の囁き）: {phase3_texts.question1}
質問2（絶対的な空白）: {phase3_texts.question2}

---

上記のデータから、以下の要素を導き出してください：

1. 最も顕著な傾向（支配/服従/拘束/観察など）
2. 心理的な核となる欲求
3. 五感の中で最も敏感な要素
4. パートナーシップにおける理想的な役割

そして、以下のJSON形式で出力してください：

{
  "type_name": "（日本語で、詩的で印象的なタイプ名。15文字以内）",
  "type_name_en": "（英語でのタイプ名。例：Silent Dominance Observer）",
  "catchphrase": "（ユーザーの本質を一文で表現。30文字以内）",
  "description": "（150-200文字の分析文。耽美で心理学的に深い内容）",
  "core_attributes": ["属性1", "属性2", "属性3"],
  "dominant_axis": "（最も強い軸。例：psychological_dominance）",
  "secondary_axis": "（2番目に強い軸）",
  "sensory_preference": "（最も敏感な感覚。例：auditory, visual, tactile）",
  "compatible_type": "（相性の良いタイプ名）",
  "partner_advice": "（理想のパートナーへのアドバイス。50文字程度）"
}

注意事項：
- type_nameは必ず日本語で、美しく印象的なものにすること
- catchphraseは詩的で、ユーザーが「これは自分だ」と感じられるものにすること
- descriptionは心理分析として深みがありつつ、読みやすい文章にすること
- 性的な直接表現は避け、美的・心理的な言葉で表現すること
```

---

## 4. 出力スキーマ（JSON Schema）

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "required": [
    "type_name",
    "type_name_en",
    "catchphrase",
    "description",
    "core_attributes",
    "dominant_axis",
    "compatible_type"
  ],
  "properties": {
    "type_name": {
      "type": "string",
      "maxLength": 15,
      "description": "日本語の診断タイプ名"
    },
    "type_name_en": {
      "type": "string",
      "maxLength": 50,
      "description": "英語の診断タイプ名"
    },
    "catchphrase": {
      "type": "string",
      "maxLength": 30,
      "description": "キャッチコピー"
    },
    "description": {
      "type": "string",
      "minLength": 150,
      "maxLength": 200,
      "description": "詳細な分析テキスト"
    },
    "core_attributes": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 3,
      "maxItems": 5,
      "description": "核となる属性"
    },
    "dominant_axis": {
      "type": "string",
      "enum": [
        "dominance",
        "submission",
        "bondage",
        "discipline",
        "sadism",
        "masochism",
        "psychological",
        "sensory",
        "exhibitionism",
        "voyeurism"
      ],
      "description": "最も強い軸"
    },
    "secondary_axis": {
      "type": "string",
      "description": "2番目に強い軸"
    },
    "sensory_preference": {
      "type": "string",
      "enum": ["visual", "auditory", "tactile", "olfactory", "gustatory"],
      "description": "最も敏感な感覚"
    },
    "compatible_type": {
      "type": "string",
      "description": "相性の良いタイプ名"
    },
    "partner_advice": {
      "type": "string",
      "maxLength": 50,
      "description": "パートナーへのアドバイス"
    }
  }
}
```

---

## 5. 診断タイプの例（参考）

### 5.1 支配系

#### 静寂なる支配の観察者
```json
{
  "type_name": "静寂なる支配の観察者",
  "type_name_en": "Silent Dominance Observer",
  "catchphrase": "あなたの瞳は、冷たいガラス越しにのみ熱を帯びる。",
  "description": "あなたは言葉少なく、視線で相手を縛る。心理的な距離を保ちながら、相手の内面を完璧に把握することに喜びを感じる。物理的な拘束よりも、精神的な支配に美学を見出す稀有な存在。",
  "core_attributes": ["心理的支配", "視線への執着", "静かなる観察"],
  "dominant_axis": "psychological",
  "secondary_axis": "voyeurism",
  "sensory_preference": "visual",
  "compatible_type": "深淵を求める献身者",
  "partner_advice": "あなたの静かな視線に身を委ねられる、繊細な魂を求めています。"
}
```

#### 優雅なる調教師
```json
{
  "type_name": "優雅なる調教師",
  "type_name_en": "Elegant Disciplinarian",
  "catchphrase": "規律という名の愛で、相手を磨き上げる。",
  "description": "あなたはルールを愛し、それを通じて相手を完璧に導く。厳格さと慈悲を兼ね備え、相手の成長を見守る教師のような存在。物理的な罰よりも、心理的な調教に重きを置く。",
  "core_attributes": ["規律への愛", "教育的支配", "成長の見守り"],
  "dominant_axis": "discipline",
  "secondary_axis": "dominance",
  "sensory_preference": "auditory",
  "compatible_type": "規律を求める服従者",
  "partner_advice": "あなたのルールを心から受け入れられる、素直な魂を。"
}
```

---

### 5.2 服従系

#### 深淵を求める献身者
```json
{
  "type_name": "深淵を求める献身者",
  "type_name_en": "Devotee of the Abyss",
  "catchphrase": "すべてを委ねることで、初めて自由を知る。",
  "description": "あなたは意思を手放すことに深い安堵を覚える。信頼できる相手の前でのみ、真の自分を晒すことができる。服従は弱さではなく、あなたにとっての究極の解放。",
  "core_attributes": ["絶対的な信頼", "委ねることの喜び", "心理的な服従"],
  "dominant_axis": "submission",
  "secondary_axis": "psychological",
  "sensory_preference": "tactile",
  "compatible_type": "静寂なる支配の観察者",
  "partner_advice": "あなたの全てを受け止められる、強く優しい支配者を。"
}
```

---

### 5.3 拘束・感覚系

#### 拘束に溺れる美学者
```json
{
  "type_name": "拘束に溺れる美学者",
  "type_name_en": "Aesthete of Restraint",
  "catchphrase": "束縛という芸術に、身も心も捧げる。",
  "description": "あなたは拘束そのものに美を見出す。縛られることで初めて、自分の輪郭を確認できる。物理的な束縛は心理的な解放をもたらし、あなたを深い陶酔へと導く。",
  "core_attributes": ["拘束への憧憬", "物理的な束縛", "美的感覚"],
  "dominant_axis": "bondage",
  "secondary_axis": "submission",
  "sensory_preference": "tactile",
  "compatible_type": "緻密なる結び手",
  "partner_advice": "縄の芸術を理解し、あなたを作品として扱える者を。"
}
```

#### 感覚の探求者
```json
{
  "type_name": "感覚の探求者",
  "type_name_en": "Sensory Explorer",
  "catchphrase": "五感すべてが、快楽への入口となる。",
  "description": "あなたは視覚、聴覚、触覚、嗅覚、味覚すべてに敏感。微細な刺激が、あなたを深い世界へと誘う。冷たい金属の感触、衣擦れの音、相手の体温。すべてが官能へと繋がる。",
  "core_attributes": ["五感の鋭敏さ", "繊細な感受性", "美的感覚"],
  "dominant_axis": "sensory",
  "secondary_axis": "psychological",
  "sensory_preference": "tactile",
  "compatible_type": "感覚を操る芸術家",
  "partner_advice": "あなたの繊細さを理解し、丁寧に刺激を与えられる者を。"
}
```

---

## 6. エラーハンドリング

### 6.1 不適切な出力への対処

AIが不適切な内容を生成した場合：

```javascript
// バックエンドでのフィルタリング例
const inappropriateKeywords = [
  '性交', 'セックス', '挿入', // 直接的な性的表現
  '暴力', '虐待', '傷つける'  // 過度に暴力的な表現
];

function validateOutput(result) {
  const text = JSON.stringify(result);
  
  for (const keyword of inappropriateKeywords) {
    if (text.includes(keyword)) {
      throw new Error('Inappropriate content detected');
    }
  }
  
  return result;
}
```

### 6.2 JSON解析エラーへの対処

```javascript
async function parseAIResponse(rawResponse) {
  try {
    // JSONブロックの抽出（```json ... ``` の場合）
    const jsonMatch = rawResponse.match(/```json\n([\s\S]*?)\n```/);
    const jsonString = jsonMatch ? jsonMatch[1] : rawResponse;
    
    const result = JSON.parse(jsonString);
    
    // スキーマ検証
    if (!result.type_name || !result.description) {
      throw new Error('Invalid schema');
    }
    
    return result;
  } catch (error) {
    console.error('AI response parsing failed:', error);
    
    // フォールバック: デフォルト結果を返す
    return {
      type_name: "神秘なる探求者",
      catchphrase: "あなたの心は、まだ見ぬ深淵を求めている。",
      description: "あなたの内面には、言葉にできない複雑な欲求が渦巻いています...",
      core_attributes: ["探求心", "神秘性", "複雑性"],
      dominant_axis: "psychological",
      compatible_type: "理解ある導き手"
    };
  }
}
```

---

## 7. プロンプトチューニング

### 7.1 Temperature調整による出力品質の最適化

| Temperature | 特徴 | 使用場面 |
|------------|------|---------|
| 0.3-0.5 | 一貫性が高い、保守的 | テスト・デバッグ時 |
| 0.7-0.8 | バランスが良い（推奨） | 本番環境 |
| 0.9-1.0 | 創造的、多様性が高い | より個性的な結果が欲しい時 |

### 7.2 Few-Shot Examples（追加学習例）

プロンプトに例を追加することで精度向上：

```plaintext
# 良い出力例

入力: { dominance: 85, psychological: 90, voyeurism: 80 }
出力: {
  "type_name": "静寂なる支配の観察者",
  "catchphrase": "あなたの瞳は、冷たいガラス越しにのみ熱を帯びる。"
  ...
}

入力: { submission: 90, bondage: 85, masochism: 70 }
出力: {
  "type_name": "深淵を求める献身者",
  "catchphrase": "すべてを委ねることで、初めて自由を知る。"
  ...
}

# あなたのタスク
入力: {実際のユーザーデータ}
出力: {診断結果}
```

---

## 8. Lambda関数での実装例

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateDiagnosis(userData) {
  const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-pro-latest',
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048,
    }
  });

  const systemPrompt = `あなたはエレガントで冷徹な心理アナリストです...`;
  
  const userPrompt = `
以下のデータを分析し、この人物の深層心理を診断してください。

# Phase 1 スコア
${JSON.stringify(userData.phase1_scores, null, 2)}

# Phase 2 選択履歴
${JSON.stringify(userData.phase2_choices, null, 2)}

# Phase 3 自由記述
質問1: ${userData.phase3_texts.question1}
質問2: ${userData.phase3_texts.question2}

[出力形式の指示...]
`;

  const result = await model.generateContent([
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: '了解しました。データを分析します。' }] },
    { role: 'user', parts: [{ text: userPrompt }] }
  ]);

  const response = result.response.text();
  return parseAIResponse(response);
}

module.exports = { generateDiagnosis };
```

---

## 9. コスト最適化

### API呼び出しコスト（2024年5月時点）

| モデル | 入力 | 出力 |
|-------|-----|-----|
| Gemini 1.5 Pro | $0.00035/1K tokens | $0.00105/1K tokens |
| Gemini 1.5 Flash | $0.000035/1K tokens | $0.000105/1K tokens |

### 推定コスト（1診断あたり）

- 入力トークン: 約1,500トークン
- 出力トークン: 約800トークン
- **Pro**: 約$0.001（0.15円）
- **Flash**: 約$0.0001（0.015円）

### 推奨戦略

1. **通常時**: Gemini 1.5 Flash（コスト重視）
2. **高品質重視**: Gemini 1.5 Pro
3. **A/Bテスト**: 両モデルを併用し、品質差を検証

---

**このプロンプト設計により、ユーザー一人ひとりに合わせた、美しく深い診断結果を生成できます。**
