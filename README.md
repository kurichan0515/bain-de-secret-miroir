# Bain de Secret Miroir

> 「秘密の鏡に浸る」  
> AIによる深層心理分析を用いた、耽美な大人のための性癖自己発見診断

[![License](https://img.shields.io/badge/license-All%20Rights%20Reserved-red.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-In%20Development-yellow.svg)]()

---

## 🎭 プロジェクト概要

**Bain de Secret Miroir**（バン・ド・スクレ・ミロワール）は、Google Gemini AIを活用した心理診断エンターテインメントです。

ユーザーは匿名で58問の質問に答え、AIが深層心理（BDSM的傾向）を美しく言語化します。

### ✨ 主な特徴

- 🎭 **完全匿名**: アカウント登録・ログイン不要
- 🤖 **AI分析**: Google Gemini APIによる深層心理分析
- 🎨 **没入型デザイン**: 漆黒×ディープブルーの耽美な世界観
- 💰 **完全無料**: 広告収益モデル（ユーザー負担なし）
- 🔒 **プライバシー最優先**: データを永続的に保存しない
- 📱 **モバイルファースト**: スマホでの片手操作を最適化

---

## 📁 ディレクトリ構造

```
bain-de-secret-miroir/
├── README.md                       # このファイル
├── docs/                           # 📚 ドキュメント
│   ├── requirements.md             # プロジェクト要件定義書
│   ├── questions.md                # 診断質問の詳細説明
│   ├── design-spec.md              # デザイン仕様書
│   ├── ai-prompt-spec.md           # AIプロンプト設計書
│   ├── technical-spec.md           # 技術仕様書
│   └── implementation-guide.md     # 実装ガイド
├── data/                           # 📊 データファイル
│   ├── phase1.json                 # Phase 1: 直感スワイプ（50問）
│   ├── phase2.json                 # Phase 2: シチュエーション選択（6問）
│   ├── phase3.json                 # Phase 3: 自由記述（2問）
│   └── scoring_config.json         # スコアリング設定
├── frontend/                       # 🎨 フロントエンド（未実装）
│   └── (React + Vite + TypeScript)
└── backend/                        # ⚙️ バックエンド（未実装）
    └── (AWS Lambda + Node.js)
```

---

## 🛠 技術スタック

### フロントエンド
| 技術 | 用途 |
|-----|------|
| **React 18** | UI構築 |
| **TypeScript** | 型安全性 |
| **Vite** | ビルドツール |
| **Framer Motion** | アニメーション |
| **Zustand** | 状態管理 |
| **Tailwind CSS** | スタイリング |
| **Vercel** | ホスティング |

### バックエンド
| 技術 | 用途 |
|-----|------|
| **AWS Lambda** | サーバーレス関数 |
| **API Gateway** | REST API |
| **Node.js 18** | ランタイム |
| **Google Gemini API** | AI診断生成 |
| **TypeScript** | 型安全性 |

### データ・分析
| 技術 | 用途 |
|-----|------|
| **Session Storage** | 一時データ保存 |
| **Google Analytics 4** | アクセス解析 |
| **Google AdSense** | 広告収益化 |

---

## 📊 診断フロー

```
┌─────────────────┐
│  Start Screen   │  ← ランディングページ
└────────┬────────┘
         ↓
┌─────────────────┐
│  Phase 1        │  ← 直感スワイプ（50問）
│  Swipe Cards    │     1〜2秒で左右選択
└────────┬────────┘
         ↓
┌─────────────────┐
│  Phase 2        │  ← シチュエーション選択（6問）
│  Scenarios      │     4択から最も心が動くものを選択
└────────┬────────┘
         ↓
┌─────────────────┐
│  Phase 3        │  ← 自由記述（2問）
│  Text Input     │     深層心理を言語化
└────────┬────────┘
         ↓
┌─────────────────┐
│  Analyzing      │  ← AI解析中（5〜10秒）
│  + Ad Display   │     広告表示タイミング
└────────┬────────┘
         ↓
┌─────────────────┐
│  Result         │  ← 診断結果表示
│  + Share        │     SNSシェア機能
└─────────────────┘
```

---

## 📚 ドキュメント

### 設計ドキュメント

| ドキュメント | 概要 |
|------------|------|
| [**要件定義書**](./docs/requirements.md) | プロジェクトの全体要件 |
| [**質問セット**](./docs/questions.md) | Phase 1〜3の全質問詳細 |
| [**デザイン仕様書**](./docs/design-spec.md) | カラー、フォント、アニメーション |
| [**AIプロンプト設計書**](./docs/ai-prompt-spec.md) | Gemini API用プロンプト |
| [**技術仕様書**](./docs/technical-spec.md) | システムアーキテクチャ |
| [**実装ガイド**](./docs/implementation-guide.md) | 実装時の依頼テンプレート |

### データファイル

| ファイル | 内容 |
|---------|------|
| [`phase1.json`](./data/phase1.json) | 直感スワイプ50問 |
| [`phase2.json`](./data/phase2.json) | シチュエーション選択6問 |
| [`phase3.json`](./data/phase3.json) | 自由記述2問 |
| [`scoring_config.json`](./data/scoring_config.json) | スコアリング設定・診断タイプ定義 |

---

## 🎨 デザインシステム

### カラーパレット

```css
--bg-primary: #05070A;      /* Deep Midnight Black */
--bg-accent: #1A2B48;       /* Abyssal Blue */
--text-primary: #FFFFFF;    /* Pure White */
--text-secondary: #B8C5D6;  /* Muted Silver */
```

### タイポグラフィ

- **和文**: Shippori Mincho（優美な明朝体）
- **欧文**: Cinzel（威厳あるセリフ体）

### 演出

- **静寂と波紋**: クリック時に暗闇に広がる波紋エフェクト
- **浮遊感**: 要素がy軸方向に微かに揺れる
- **暗転**: 深い青へのフェードアウト遷移

---

## 🚀 開発ステータス

### Phase 1: 設計・ドキュメント化 ✅
- [x] プロジェクト要件定義
- [x] 質問セット作成（Phase 1〜3）
- [x] デザイン仕様書
- [x] AIプロンプト設計書
- [x] 技術仕様書
- [x] 実装ガイド

### Phase 2: フロントエンド実装 🚧
- [ ] プロジェクトセットアップ
- [ ] スワイプカードUI
- [ ] シチュエーション選択画面
- [ ] 自由記述フォーム
- [ ] ローディング画面
- [ ] 結果表示画面

### Phase 3: バックエンド実装 ⏳
- [ ] Lambda関数セットアップ
- [ ] スコアリングロジック
- [ ] Gemini API連携
- [ ] エラーハンドリング

### Phase 4: テスト・調整 ⏳
- [ ] ユーザーテスト
- [ ] パフォーマンス最適化
- [ ] バグ修正
- [ ] モバイル動作確認

### Phase 5: リリース・運用 ⏳
- [ ] 本番デプロイ
- [ ] 広告設定
- [ ] SNSマーケティング
- [ ] KPI測定

---

## 💡 実装を始めるには

### 1. ドキュメントを読む

```bash
# 最初に読むべきドキュメント
1. docs/requirements.md        # 全体像を理解
2. docs/implementation-guide.md # 実装の進め方
3. docs/design-spec.md         # デザイン要件
```

### 2. フロントエンド開発

```bash
# プロジェクトセットアップ
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install framer-motion zustand react-router-dom axios tailwindcss

# 開発サーバー起動
npm run dev
```

### 3. バックエンド開発

```bash
# Serverless Frameworkセットアップ
npm install -g serverless
serverless create --template aws-nodejs-typescript --path backend
cd backend
npm install @google/generative-ai

# ローカルテスト
serverless offline start
```

---

## 📞 サポート

### トラブルシューティング

問題が発生した場合は、以下のドキュメントを確認してください：

- [実装ガイド - トラブルシューティング](./docs/implementation-guide.md#9-トラブルシューティング)
- [技術仕様書 - よくある質問](./docs/technical-spec.md)

---

## 📄 ライセンス

**All Rights Reserved**

このプロジェクトのすべてのコンテンツ、デザイン、コードは著作権により保護されています。

---

## 🎯 プロジェクトビジョン

> 「自分の秘密をAIにだけ打ち明ける」という背徳感を、  
> ノーリスクで楽しめる、美しく没入感のある体験を提供する。

**Bain de Secret Miroir** - あなたの深淵を映す鏡。

---

**Last Updated**: 2026-05-07
