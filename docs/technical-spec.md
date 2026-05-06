# 技術仕様書：Bain de Secret Miroir

## 1. システムアーキテクチャ概要

```
┌─────────────────────────────────────────────────────────┐
│                      User (Browser)                      │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Frontend (React SPA)                        │
│  Hosting: Vercel / Cloudflare Pages                     │
│  - Phase 1: Swipe UI (Framer Motion)                    │
│  - Phase 2: Scenario Selection                          │
│  - Phase 3: Text Input                                  │
│  - Result Display                                       │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ HTTPS POST /api/analyze
                        ↓
┌─────────────────────────────────────────────────────────┐
│           Backend (AWS Lambda + API Gateway)            │
│  - スコアリングロジック                                   │
│  - Gemini API呼び出し                                    │
│  - 結果のJSON生成                                        │
└───────────────────────┬─────────────────────────────────┘
                        │
                        │ API Request
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Google Gemini API                           │
│  Model: gemini-1.5-pro / gemini-1.5-flash              │
└─────────────────────────────────────────────────────────┘
```

---

## 2. フロントエンド仕様

### 2.1 技術スタック

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^11.0.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.0",
    "zustand": "^4.4.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "eslint": "^8.55.0",
    "prettier": "^3.1.0"
  }
}
```

### 2.2 ディレクトリ構造

```
frontend/
├── public/
│   ├── fonts/
│   │   ├── ShipporiMincho.woff2
│   │   └── Cinzel.woff2
│   └── images/
│       └── og-image-template.png
├── src/
│   ├── components/
│   │   ├── Phase1/
│   │   │   ├── SwipeCard.tsx
│   │   │   └── SwipeContainer.tsx
│   │   ├── Phase2/
│   │   │   ├── ScenarioCard.tsx
│   │   │   └── ChoiceButton.tsx
│   │   ├── Phase3/
│   │   │   └── TextInput.tsx
│   │   ├── Result/
│   │   │   ├── ResultCard.tsx
│   │   │   └── ShareButton.tsx
│   │   ├── Loading/
│   │   │   └── AnalyzingScreen.tsx
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── ProgressBar.tsx
│   │       └── Layout.tsx
│   ├── hooks/
│   │   ├── useSwipe.ts
│   │   ├── useAnalyze.ts
│   │   └── useProgress.ts
│   ├── store/
│   │   └── diagnosticStore.ts
│   ├── utils/
│   │   ├── scoring.ts
│   │   ├── api.ts
│   │   └── validation.ts
│   ├── data/
│   │   ├── phase1.json
│   │   ├── phase2.json
│   │   └── phase3.json
│   ├── styles/
│   │   ├── globals.css
│   │   └── variables.css
│   ├── pages/
│   │   ├── Start.tsx
│   │   ├── Phase1.tsx
│   │   ├── Phase2.tsx
│   │   ├── Phase3.tsx
│   │   ├── Analyzing.tsx
│   │   └── Result.tsx
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

### 2.3 State管理（Zustand）

```typescript
// src/store/diagnosticStore.ts

interface DiagnosticState {
  // Phase 1 回答
  phase1Answers: Record<number, boolean>;
  setPhase1Answer: (questionId: number, value: boolean) => void;
  
  // Phase 2 回答
  phase2Answers: Record<string, string>;
  setPhase2Answer: (scenarioId: string, choice: string) => void;
  
  // Phase 3 回答
  phase3Answers: Record<number, string>;
  setPhase3Answer: (questionId: number, value: string) => void;
  
  // 進捗
  currentPhase: number;
  setCurrentPhase: (phase: number) => void;
  
  // 結果
  result: DiagnosticResult | null;
  setResult: (result: DiagnosticResult) => void;
  
  // リセット
  reset: () => void;
}

export const useDiagnosticStore = create<DiagnosticState>((set) => ({
  phase1Answers: {},
  setPhase1Answer: (questionId, value) =>
    set((state) => ({
      phase1Answers: { ...state.phase1Answers, [questionId]: value }
    })),
  
  phase2Answers: {},
  setPhase2Answer: (scenarioId, choice) =>
    set((state) => ({
      phase2Answers: { ...state.phase2Answers, [scenarioId]: choice }
    })),
  
  phase3Answers: {},
  setPhase3Answer: (questionId, value) =>
    set((state) => ({
      phase3Answers: { ...state.phase3Answers, [questionId]: value }
    })),
  
  currentPhase: 1,
  setCurrentPhase: (phase) => set({ currentPhase: phase }),
  
  result: null,
  setResult: (result) => set({ result }),
  
  reset: () =>
    set({
      phase1Answers: {},
      phase2Answers: {},
      phase3Answers: {},
      currentPhase: 1,
      result: null
    })
}));
```

### 2.4 API通信

```typescript
// src/utils/api.ts

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.yourdomain.com';

export interface AnalyzeRequest {
  phase1_scores: Record<string, number>;
  phase2_choices: Array<{
    scenario_id: string;
    choice: string;
    attributes: string[];
  }>;
  phase3_texts: {
    question1: string;
    question2: string;
  };
}

export interface AnalyzeResponse {
  type_name: string;
  type_name_en: string;
  catchphrase: string;
  description: string;
  core_attributes: string[];
  dominant_axis: string;
  secondary_axis?: string;
  sensory_preference?: string;
  compatible_type: string;
  partner_advice?: string;
}

export async function analyzeDiagnostic(
  data: AnalyzeRequest
): Promise<AnalyzeResponse> {
  try {
    const response = await axios.post<AnalyzeResponse>(
      `${API_BASE_URL}/api/analyze`,
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30秒
      }
    );
    
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw new Error('診断の解析に失敗しました。もう一度お試しください。');
  }
}
```

### 2.5 スワイプ実装（Framer Motion）

```typescript
// src/components/Phase1/SwipeCard.tsx

import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';

interface SwipeCardProps {
  question: string;
  onSwipe: (direction: 'left' | 'right') => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({ question, onSwipe }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-30, 30]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      onSwipe('right');
    } else if (info.offset.x < -swipeThreshold) {
      onSwipe('left');
    }
  };

  return (
    <motion.div
      className="swipe-card"
      style={{ x, rotate, opacity }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      whileTap={{ scale: 0.95 }}
    >
      <p className="swipe-card-text">{question}</p>
      
      {/* ヒントテキスト */}
      <div className="swipe-hints">
        <span className="hint-left">← 惹かれない</span>
        <span className="hint-right">惹かれる →</span>
      </div>
    </motion.div>
  );
};
```

---

## 3. バックエンド仕様

### 3.1 技術スタック

- **Runtime**: Node.js 18.x
- **Framework**: AWS Lambda (Serverless)
- **API**: AWS API Gateway (REST API)
- **AI**: Google Gemini API

### 3.2 ディレクトリ構造

```
backend/
├── src/
│   ├── handlers/
│   │   └── analyze.ts
│   ├── services/
│   │   ├── scoringService.ts
│   │   └── geminiService.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── errorHandler.ts
│   └── types/
│       └── index.ts
├── tests/
│   └── analyze.test.ts
├── package.json
├── tsconfig.json
└── serverless.yml
```

### 3.3 Lambda関数実装

```typescript
// src/handlers/analyze.ts

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { calculateScores } from '../services/scoringService';
import { generateDiagnosis } from '../services/geminiService';
import { validateRequest } from '../utils/validation';

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    // CORS headers
    const headers = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Content-Type': 'application/json'
    };

    // OPTIONS request (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
      return { statusCode: 200, headers, body: '' };
    }

    // リクエストのパース
    const body = JSON.parse(event.body || '{}');

    // バリデーション
    const validationError = validateRequest(body);
    if (validationError) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: validationError })
      };
    }

    // スコア計算
    const scores = calculateScores(
      body.phase1_answers,
      body.phase2_answers
    );

    // AI診断生成
    const diagnosis = await generateDiagnosis({
      phase1_scores: scores,
      phase2_choices: body.phase2_choices,
      phase3_texts: body.phase3_texts
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(diagnosis)
    };
  } catch (error) {
    console.error('Error:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: '診断の生成中にエラーが発生しました。'
      })
    };
  }
};
```

### 3.4 スコアリングサービス

```typescript
// src/services/scoringService.ts

import scoringConfig from '../../data/scoring_config.json';

interface Phase1Answers {
  [questionId: number]: boolean;
}

interface Phase2Answers {
  [scenarioId: string]: string;
}

export function calculateScores(
  phase1Answers: Phase1Answers,
  phase2Answers: Phase2Answers
): Record<string, number> {
  const scores: Record<string, number> = {
    dominance: 0,
    submission: 0,
    bondage: 0,
    discipline: 0,
    sadism: 0,
    masochism: 0,
    psychological: 0,
    sensory: 0,
    exhibitionism: 0,
    voyeurism: 0
  };

  // Phase 1のスコア計算（weight: 1）
  Object.entries(phase1Answers).forEach(([questionId, answer]) => {
    if (answer) {
      const attributes = scoringConfig.phase1_mapping[questionId];
      attributes?.forEach((attr: string) => {
        const normalizedAttr = normalizeAttribute(attr);
        if (scores.hasOwnProperty(normalizedAttr)) {
          scores[normalizedAttr] += 1;
        }
      });
    }
  });

  // Phase 2のスコア計算（weight: 2）
  // TODO: phase2のマッピング実装

  // 正規化（0-100のスケール）
  const maxScore = Math.max(...Object.values(scores));
  if (maxScore > 0) {
    Object.keys(scores).forEach((key) => {
      scores[key] = Math.round((scores[key] / maxScore) * 100);
    });
  }

  return scores;
}

function normalizeAttribute(attr: string): string {
  // 属性名を正規化
  const mapping: Record<string, string> = {
    'Bondage': 'bondage',
    'Restraint': 'bondage',
    'Submission': 'submission',
    'Dominance': 'dominance',
    'Sadism': 'sadism',
    'Masochism': 'masochism',
    'Psychological': 'psychological',
    'Sensory': 'sensory',
    'Exhibitionism': 'exhibitionism',
    'Voyeurism': 'voyeurism'
  };
  
  return mapping[attr] || attr.toLowerCase();
}
```

### 3.5 Gemini API連携

```typescript
// src/services/geminiService.ts

import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface DiagnosisInput {
  phase1_scores: Record<string, number>;
  phase2_choices: any[];
  phase3_texts: {
    question1: string;
    question2: string;
  };
}

export async function generateDiagnosis(input: DiagnosisInput) {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-pro-latest',
    generationConfig: {
      temperature: 0.8,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 2048
    }
  });

  const systemPrompt = `あなたはエレガントで冷徹な心理アナリストです...`;
  
  const userPrompt = `
以下のデータを分析し、この人物の深層心理を診断してください。

# Phase 1 スコア
${JSON.stringify(input.phase1_scores, null, 2)}

# Phase 2 選択履歴
${JSON.stringify(input.phase2_choices, null, 2)}

# Phase 3 自由記述
質問1: ${input.phase3_texts.question1}
質問2: ${input.phase3_texts.question2}

[JSON出力形式...]
`;

  const result = await model.generateContent([
    { role: 'user', parts: [{ text: systemPrompt }] },
    { role: 'model', parts: [{ text: '了解しました。' }] },
    { role: 'user', parts: [{ text: userPrompt }] }
  ]);

  const response = result.response.text();
  return parseResponse(response);
}

function parseResponse(response: string) {
  // JSONの抽出とパース
  const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
  const jsonString = jsonMatch ? jsonMatch[1] : response;
  
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    throw new Error('診断結果の生成に失敗しました');
  }
}
```

---

## 4. インフラ構成

### 4.1 Vercel設定（フロントエンド）

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "vite",
  "env": {
    "VITE_API_URL": "@api-url"
  }
}
```

### 4.2 AWS Lambda設定（serverless.yml）

```yaml
service: bain-de-secret-miroir-api

provider:
  name: aws
  runtime: nodejs18.x
  region: ap-northeast-1
  stage: ${opt:stage, 'dev'}
  environment:
    GEMINI_API_KEY: ${env:GEMINI_API_KEY}
  
functions:
  analyze:
    handler: src/handlers/analyze.handler
    timeout: 30
    memorySize: 512
    events:
      - http:
          path: api/analyze
          method: post
          cors: true

plugins:
  - serverless-plugin-typescript
  - serverless-offline
```

---

## 5. 環境変数

### 5.1 フロントエンド（`.env`）

```bash
VITE_API_URL=https://your-api-gateway-url.com
VITE_GA_TRACKING_ID=G-XXXXXXXXXX  # Google Analytics
```

### 5.2 バックエンド（`.env`）

```bash
GEMINI_API_KEY=your-gemini-api-key
NODE_ENV=production
```

---

## 6. デプロイ手順

### 6.1 フロントエンド（Vercel）

```bash
# Vercel CLIインストール
npm i -g vercel

# ログイン
vercel login

# デプロイ
vercel --prod
```

### 6.2 バックエンド（AWS Lambda）

```bash
# Serverless Frameworkインストール
npm i -g serverless

# AWSクレデンシャル設定
aws configure

# デプロイ
serverless deploy --stage prod
```

---

## 7. モニタリング・ログ

### 7.1 フロントエンド

- **Vercel Analytics**: トラフィック、パフォーマンス
- **Google Analytics 4**: ユーザー行動分析

### 7.2 バックエンド

- **AWS CloudWatch**: Lambda実行ログ
- **AWS X-Ray**: トレーシング（オプション）
- **Gemini API Dashboard**: API使用量、コスト

---

**この技術仕様書に基づき、スケーラブルで保守性の高いシステムを構築できます。**
