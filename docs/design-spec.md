# デザイン仕様書：Bain de Secret Miroir

## 1. デザインコンセプト

### サービスの本質
**「秘密の鏡に浸る」** - 世界観への没入が生命線

このサービスは、ユーザーが自分の深層心理と向き合う「聖域」です。  
デザインは単なる装飾ではなく、心理的安全性と背徳的な魅力を同時に演出する**体験設計**そのものです。

---

## 2. カラーパレット

### プライマリーカラー

```css
/* メイン背景 */
--bg-primary: #05070A;        /* Deep Midnight Black */

/* アクセント・グラデーション */
--bg-accent: #1A2B48;         /* Abyssal Blue */

/* テキスト */
--text-primary: #FFFFFF;      /* Pure White */
--text-secondary: #B8C5D6;    /* Muted Silver */

/* インタラクティブ要素 */
--interactive-hover: #2A3B58; /* Hover State Blue */
--interactive-active: #3A4B68; /* Active State Blue */
```

### グラデーション定義

```css
/* 背景グラデーション（全画面共通） */
background: linear-gradient(
  135deg,
  #05070A 0%,
  #0A0E14 25%,
  #1A2B48 75%,
  #05070A 100%
);

/* カードエッジグロー */
box-shadow: 0 0 40px rgba(26, 43, 72, 0.6);

/* テキストグラデーション（タイトル用） */
background: linear-gradient(
  90deg,
  #FFFFFF 0%,
  #B8C5D6 100%
);
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
```

---

## 3. タイポグラフィ

### フォントファミリー

```css
/* 和文：優美な明朝体 */
--font-japanese: 'Shippori Mincho', serif;

/* 欧文：威厳あるセリフ体 */
--font-english: 'Cinzel', serif;

/* システムフォント（フォールバック） */
--font-fallback: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### フォントサイズスケール（モバイルファースト）

```css
/* モバイル */
--text-xs: 0.75rem;    /* 12px - 注釈 */
--text-sm: 0.875rem;   /* 14px - 本文補足 */
--text-base: 1rem;     /* 16px - 本文 */
--text-lg: 1.125rem;   /* 18px - 小見出し */
--text-xl: 1.5rem;     /* 24px - 見出し */
--text-2xl: 2rem;      /* 32px - 大見出し */
--text-3xl: 2.5rem;    /* 40px - タイトル */

/* デスクトップ（768px以上） */
@media (min-width: 768px) {
  --text-xl: 1.75rem;  /* 28px */
  --text-2xl: 2.5rem;  /* 40px */
  --text-3xl: 3.5rem;  /* 56px */
}
```

### フォントウェイト

```css
--weight-light: 300;   /* 極細 - メインテキスト */
--weight-regular: 400; /* 通常 - 本文 */
--weight-medium: 500;  /* 中太 - 強調 */
--weight-bold: 700;    /* 太字 - タイトル */
```

### 行間・文字間

```css
--line-height-tight: 1.25;   /* タイトル用 */
--line-height-normal: 1.6;   /* 本文用 */
--line-height-relaxed: 1.8;  /* 読みやすさ重視 */

--letter-spacing-tight: -0.02em;  /* タイトル */
--letter-spacing-normal: 0;       /* 本文 */
--letter-spacing-wide: 0.05em;    /* 英文大文字 */
```

---

## 4. レイアウト・スペーシング

### コンテナ幅

```css
--container-mobile: 100%;
--container-tablet: 640px;
--container-desktop: 800px;
--container-wide: 1200px;

/* パディング */
--padding-mobile: 1rem;    /* 16px */
--padding-tablet: 2rem;    /* 32px */
--padding-desktop: 3rem;   /* 48px */
```

### スペーシングスケール

```css
--space-1: 0.25rem;  /* 4px */
--space-2: 0.5rem;   /* 8px */
--space-3: 0.75rem;  /* 12px */
--space-4: 1rem;     /* 16px */
--space-6: 1.5rem;   /* 24px */
--space-8: 2rem;     /* 32px */
--space-12: 3rem;    /* 48px */
--space-16: 4rem;    /* 64px */
--space-24: 6rem;    /* 96px */
```

---

## 5. アニメーション・モーション

### 演出ガイドライン

#### 5.1 静寂と波紋
クリックや遷移時に、**暗闇に広がる波紋のようなエフェクト**を実装。

```javascript
// Framer Motion設定例
const rippleVariants = {
  initial: { scale: 0, opacity: 0.8 },
  animate: { 
    scale: 2, 
    opacity: 0,
    transition: { duration: 1.2, ease: "easeOut" }
  }
};
```

#### 5.2 浮遊感
要素は**y軸方向に微かに揺れる**ようなアニメーション。

```javascript
// 浮遊アニメーション
const floatingVariants = {
  animate: {
    y: [-5, 5, -5],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

#### 5.3 暗転（フェードアウト）
画面遷移は**深い青へのフェードアウト（溶暗）**を基本とする。

```javascript
// ページ遷移
const pageTransition = {
  initial: { opacity: 0, backgroundColor: "#05070A" },
  animate: { opacity: 1, backgroundColor: "#1A2B48" },
  exit: { opacity: 0, backgroundColor: "#05070A" },
  transition: { duration: 0.8, ease: "easeInOut" }
};
```

### イージング関数

```css
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
--ease-elegant: cubic-bezier(0.25, 0.1, 0.25, 1);  /* カスタム */
```

### アニメーション時間

```css
--duration-fast: 200ms;
--duration-normal: 400ms;
--duration-slow: 600ms;
--duration-elegant: 800ms;
```

---

## 6. コンポーネント仕様

### 6.1 スワイプカード（Phase 1）

#### レイアウト
```
┌─────────────────────────┐
│                         │
│    [質問テキスト]        │ <- 中央揃え、極細フォント
│                         │
│                         │
│    ← 惹かれない  惹かれる → │ <- 半透明ヒント
│                         │
└─────────────────────────┘
```

#### スタイル仕様

```css
.swipe-card {
  width: 90vw;
  max-width: 400px;
  height: 500px;
  background: linear-gradient(135deg, #0A0E14, #1A2B48);
  border-radius: 16px;
  box-shadow: 0 0 40px rgba(26, 43, 72, 0.6);
  padding: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swipe-card-text {
  font-family: 'Shippori Mincho', serif;
  font-size: 1.5rem;
  font-weight: 300;
  line-height: 1.8;
  text-align: center;
  color: #FFFFFF;
}
```

#### スワイプアニメーション

```javascript
const swipeVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    rotate: direction > 0 ? 20 : -20
  }),
  center: {
    x: 0,
    opacity: 1,
    rotate: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    rotate: direction > 0 ? 30 : -30,
    transition: { duration: 0.3, ease: "easeIn" }
  })
};
```

---

### 6.2 シチュエーション選択ボタン（Phase 2）

#### レイアウト
```
┌───────────────────────────┐
│  [シナリオタイトル]        │
│  情景の描写テキスト...     │
│                           │
│  ┌─────────────────────┐ │
│  │  選択肢A              │ │
│  └─────────────────────┘ │
│  ┌─────────────────────┐ │
│  │  選択肢B              │ │
│  └─────────────────────┘ │
│  ┌─────────────────────┐ │
│  │  選択肢C              │ │
│  └─────────────────────┘ │
│  ┌─────────────────────┐ │
│  │  選択肢D              │ │
│  └─────────────────────┘ │
└───────────────────────────┘
```

#### スタイル仕様

```css
.scenario-button {
  width: 100%;
  padding: 1.5rem;
  background: rgba(26, 43, 72, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #FFFFFF;
  font-family: 'Shippori Mincho', serif;
  font-size: 1rem;
  font-weight: 300;
  text-align: left;
  transition: all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1);
  cursor: pointer;
}

.scenario-button:hover {
  background: rgba(26, 43, 72, 0.6);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(26, 43, 72, 0.8);
  transform: translateY(-2px);
}

.scenario-button:active {
  transform: translateY(0);
}
```

---

### 6.3 自由記述フォーム（Phase 3）

#### スタイル仕様

```css
.text-input {
  width: 100%;
  min-height: 200px;
  background: rgba(5, 7, 10, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 1.5rem;
  color: #FFFFFF;
  font-family: 'Shippori Mincho', serif;
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.8;
  resize: vertical;
}

.text-input::placeholder {
  color: rgba(184, 197, 214, 0.5);
  font-style: italic;
}

.text-input:focus {
  outline: none;
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 20px rgba(26, 43, 72, 0.8);
}
```

---

### 6.4 ローディング画面（AI解析中）

#### レイアウト
```
┌───────────────────────────┐
│                           │
│        [波紋アニメ]        │
│                           │
│   AIが深淵を解析中...      │
│                           │
│   [プログレスバー/スピナー] │
│                           │
└───────────────────────────┘
```

#### アニメーション

```javascript
const analyzeVariants = {
  animate: {
    scale: [1, 1.2, 1],
    opacity: [0.5, 1, 0.5],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};
```

---

### 6.5 結果カード

#### レイアウト
```
┌───────────────────────────┐
│                           │
│   [診断タイプ名]           │
│   「〜〜〜〜」             │  <- キャッチコピー
│                           │
│   [本文テキスト]           │
│   あなたは...              │
│                           │
│   ◆ 核となる属性           │
│   • 心理的支配             │
│   • 視線への執着           │
│                           │
│   ◆ 相性の良いタイプ       │
│   「静寂なる服従者」        │
│                           │
│   [シェアボタン]           │
│                           │
└───────────────────────────┘
```

#### スタイル仕様

```css
.result-card {
  max-width: 600px;
  margin: 0 auto;
  padding: 3rem;
  background: linear-gradient(135deg, #0A0E14, #1A2B48);
  border-radius: 16px;
  box-shadow: 0 0 60px rgba(26, 43, 72, 0.8);
}

.result-title {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 1rem;
  background: linear-gradient(90deg, #FFFFFF, #B8C5D6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.result-catchphrase {
  font-family: 'Shippori Mincho', serif;
  font-size: 1.125rem;
  font-weight: 300;
  font-style: italic;
  text-align: center;
  color: #B8C5D6;
  margin-bottom: 2rem;
}
```

---

## 7. レスポンシブ対応

### ブレークポイント

```css
/* モバイル（デフォルト） */
@media (max-width: 767px) {
  /* スマホでの片手スワイプ操作を最優先 */
}

/* タブレット */
@media (min-width: 768px) and (max-width: 1023px) {
  /* 横持ちタブレット対応 */
}

/* デスクトップ */
@media (min-width: 1024px) {
  /* マウス操作を考慮したホバーエフェクト */
}
```

### モバイル最適化

- **タッチ領域**: 最小44×44px
- **スワイプ閾値**: 100px以上の移動で確定
- **スクロール無効化**: Phase 1ではスクロール禁止
- **Safe Area対応**: `env(safe-area-inset-*)`を使用

---

## 8. アクセシビリティ

### コントラスト比
- 通常テキスト: 最低4.5:1（WCAG AA）
- 大きなテキスト: 最低3:1

### フォーカス表示

```css
:focus-visible {
  outline: 2px solid rgba(255, 255, 255, 0.6);
  outline-offset: 4px;
}
```

### スクリーンリーダー対応

```html
<!-- 例：スワイプカード -->
<div role="button" aria-label="質問1：鈍く光る銀の手錠">
  <p>鈍く光る銀の手錠</p>
</div>
```

---

## 9. パフォーマンス最適化

### 画像最適化
- WebP形式を優先
- 遅延読み込み（Lazy Loading）
- レスポンシブ画像（srcset）

### アニメーション最適化
- GPU加速（transform, opacity）
- `will-change`プロパティの適切な使用
- 60fps維持

### フォント読み込み

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preload" as="style" href="path/to/fonts.css">
```

---

## 10. 実装チェックリスト

### 必須項目
- [ ] カラーパレットを CSS変数で定義
- [ ] Shippori Mincho, Cinzel フォントの読み込み
- [ ] Framer Motion による浮遊感・波紋エフェクト
- [ ] スワイプカードのアニメーション実装
- [ ] 深い青へのフェードアウト遷移
- [ ] モバイルファーストのレスポンシブ対応
- [ ] タッチ操作の最適化

### 推奨項目
- [ ] ダークモード完全対応（既定）
- [ ] プリロードアニメーション
- [ ] エラーステートのデザイン
- [ ] 404ページのデザイン
- [ ] OGP画像の動的生成

---

**このデザイン仕様書は、「世界観への没入」を実現するための設計書です。すべての要素が、ユーザーを深淵へと誘う体験を形作ります。**
