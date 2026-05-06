# 実装ガイド：Bain de Secret Miroir

## 1. Claudeへの依頼テンプレート

このプロジェクトを実装する際に、Claude（AI）に依頼する際の効果的なプロンプト例です。

---

## 2. フロントエンド実装依頼

### 2.1 プロジェクトセットアップ

```
以下の要件でReact + Vite + TypeScriptプロジェクトをセットアップしてください：

【必須ライブラリ】
- framer-motion（アニメーション）
- zustand（状態管理）
- react-router-dom（ルーティング）
- axios（API通信）
- tailwindcss（スタイリング）

【デザイン要件】
- カラーパレット：
  - メイン背景: #05070A
  - アクセント: #1A2B48
  - テキスト: #FFFFFF
- フォント：
  - 和文: Shippori Mincho
  - 欧文: Cinzel
- 世界観：ダークでラグジュアリー、耽美で静謐

【重要な実装指針】
1. **State管理**：58問分の回答を一つのオブジェクトに集約し、最後にLambdaへPOSTするフローを構築してください
2. **Framer Motion**：ダークでラグジュアリーな世界観を出すために、カードの挙動やフェード演出に拘ってください
3. **Responsive**：スマホでの片手スワイプ操作を最優先したUIにしてください

プロジェクト構造も含めて、初期セットアップをお願いします。
```

---

### 2.2 スワイプカード実装

```
Tinder形式のスワイプカードUIを実装してください。

【要件】
- データ：`data/phase1.json`から50問の質問を読み込む
- UI：
  - カードは画面中央に表示
  - 左スワイプ：惹かれない（false）
  - 右スワイプ：惹かれる（true）
  - スワイプ閾値：100px以上
- アニメーション：
  - スワイプ時にカードが回転しながらフェードアウト
  - 次のカードが下から浮き上がるように登場
  - 微かな浮遊感（y軸に±5pxのゆらぎ）
- State：
  - zustandで回答を保存
  - 形式：`{ questionId: boolean }`

【デザイン】
- カード背景：グラデーション（#0A0E14 → #1A2B48）
- カードサイズ：90vw（最大400px）× 500px
- テキスト：Shippori Mincho、極細（font-weight: 300）
- エッジグロー：`box-shadow: 0 0 40px rgba(26, 43, 72, 0.6)`

Framer Motionを使って滑らかなアニメーションを実装してください。
```

---

### 2.3 シチュエーション選択画面

```
ノベルゲーム形式のシチュエーション選択画面を実装してください。

【要件】
- データ：`data/phase2.json`から6つのシナリオを読み込む
- UI：
  - シナリオタイトルと情景描写を表示
  - 4つの選択肢をボタンで表示
  - 選択したらフェードアウトして次のシナリオへ
- アニメーション：
  - ボタンホバー時に背景が明るくなり、上に2px浮く
  - 選択時に波紋エフェクトが広がる
  - 画面遷移は深い青へのフェードアウト
- State：
  - zustandで選択を保存
  - 形式：`{ scenarioId: choiceId }`

【デザイン】
- ボタン背景：`rgba(26, 43, 72, 0.3)`
- ボタンボーダー：`1px solid rgba(255, 255, 255, 0.1)`
- ホバー時：`rgba(26, 43, 72, 0.6)`
- テキスト：左揃え、行間1.8

没入感を高めるアニメーションを実装してください。
```

---

### 2.4 自由記述フォーム

```
心理分析用の自由記述フォームを実装してください。

【要件】
- データ：`data/phase3.json`から2つの質問を読み込む
- UI：
  - 質問を1つずつ表示
  - 最小200px、可変高さのtextarea
  - 文字数カウンター（20〜500文字）
  - バリデーション：最小20文字
- State：
  - zustandで回答を保存
  - 形式：`{ questionId: text }`

【デザイン】
- 背景：`rgba(5, 7, 10, 0.8)`（漆黒の入力フォーム）
- プレースホルダー：`rgba(184, 197, 214, 0.5)`、イタリック
- フォーカス時：白い微光のボーダー
- テキスト：Shippori Mincho、行間1.8

「自分と向き合う静かな時間」を演出してください。
```

---

### 2.5 ローディング画面（広告表示タイミング）

```
AI解析中のローディング画面を実装してください。

【要件】
- 表示時間：5〜10秒（実際のAPI応答時間）
- アニメーション：
  - 中央に波紋が広がるエフェクト
  - 「AIが深淵を解析中...」のテキストがフェードイン/アウト
  - プログレスバーまたはスピナー
- 広告タイミング：
  - この画面表示中にインタースティシャル広告を呼び出す
  - 広告完了後にAPI呼び出し
  - API完了後に結果画面へ遷移

【デザイン】
- 背景：完全な黒（#05070A）
- 波紋：ディープブルー（#1A2B48）
- テキスト：ゆっくりとしたフェード（2秒周期）

神秘的で瞑想的な雰囲気を出してください。
```

---

### 2.6 結果表示画面

```
診断結果を美しく表示する画面を実装してください。

【要件】
- データ：APIからのJSON結果を表示
- UI：
  - タイプ名（大きく、グラデーション）
  - キャッチコピー（イタリック、中央揃え）
  - 本文（150-200文字の分析）
  - 核となる属性（箇条書き）
  - 相性の良いタイプ
  - SNSシェアボタン（X/Twitter）
- アニメーション：
  - フェードインで登場
  - 各要素が順番に現れる（stagger effect）
- OGP画像：
  - タイプ名を動的に生成した画像
  - シェア時に使用

【デザイン】
- カード背景：グラデーション（#0A0E14 → #1A2B48）
- タイトル：Cinzel、グラデーションテキスト
- 本文：Shippori Mincho、極細
- シェアボタン：控えめなボーダーボタン

ユーザーが「これは自分だ」と感じられる演出を。
```

---

## 3. バックエンド実装依頼

### 3.1 Lambda関数セットアップ

```
AWS Lambda + API Gateway + TypeScriptでバックエンドを構築してください。

【要件】
- Framework：Serverless Framework
- Runtime：Node.js 18.x
- エンドポイント：POST /api/analyze
- 処理フロー：
  1. リクエストのバリデーション
  2. スコアリング計算
  3. Gemini API呼び出し
  4. JSON結果を返却
- CORS対応必須

【環境変数】
- GEMINI_API_KEY

【レスポンスフォーマット】
```json
{
  "type_name": "静寂なる支配の観察者",
  "catchphrase": "あなたの瞳は...",
  "description": "...",
  "core_attributes": [...],
  "compatible_type": "..."
}
```

serverless.ymlも含めて実装してください。
```

---

### 3.2 スコアリングロジック

```
Phase 1とPhase 2の回答からスコアを計算するロジックを実装してください。

【入力】
- phase1Answers: `{ questionId: boolean }`
- phase2Answers: `{ scenarioId: choiceId }`

【処理】
1. `data/scoring_config.json`から属性マッピングを読み込む
2. Phase 1の回答から各軸のポイントを加算（weight: 1）
3. Phase 2の回答から各軸のポイントを加算（weight: 2）
4. 0〜100のスケールに正規化

【出力】
```json
{
  "dominance": 72,
  "submission": 45,
  "bondage": 88,
  ...
}
```

TypeScriptで型安全に実装してください。
```

---

### 3.3 Gemini API連携

```
Google Gemini APIを使って診断結果を生成する関数を実装してください。

【要件】
- モデル：gemini-1.5-pro-latest（推奨）または gemini-1.5-flash-latest
- Temperature：0.8
- プロンプト：`docs/ai-prompt-spec.md`に記載の通り
- 出力：JSON形式を強制
- エラーハンドリング：
  - JSON解析失敗時のフォールバック
  - タイムアウト（30秒）
  - 不適切な内容フィルタリング

【実装】
- @google/generative-ai パッケージを使用
- システムプロンプトとユーザープロンプトを分離
- レスポンスから```json ... ```ブロックを抽出

エラー時にも必ず結果を返すようにしてください。
```

---

## 4. デザイン実装のコツ

### 4.1 Framer Motionのベストプラクティス

```typescript
// 波紋エフェクト
const rippleVariants = {
  initial: { scale: 0, opacity: 0.8 },
  animate: { 
    scale: 2, 
    opacity: 0,
    transition: { duration: 1.2, ease: "easeOut" }
  }
};

// 浮遊感
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

// 深い青へのフェード
const pageTransition = {
  initial: { opacity: 0, backgroundColor: "#05070A" },
  animate: { opacity: 1, backgroundColor: "#1A2B48" },
  exit: { opacity: 0, backgroundColor: "#05070A" },
  transition: { duration: 0.8, ease: "easeInOut" }
};
```

### 4.2 レスポンシブ対応

```css
/* モバイルファースト */
.container {
  padding: 1rem;
}

/* タブレット以上 */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* デスクトップ */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
  }
}
```

---

## 5. テスト・デバッグ

### 5.1 フロントエンドのテスト

```bash
# 開発サーバー起動
npm run dev

# ビルド確認
npm run build
npm run preview

# 型チェック
npm run type-check
```

### 5.2 バックエンドのテスト

```bash
# ローカルでLambda実行
serverless offline start

# デプロイ前テスト
serverless invoke local -f analyze -p test/sample-request.json

# デプロイ
serverless deploy --stage dev
```

---

## 6. パフォーマンス最適化

### 6.1 フロントエンド

- [ ] 画像の遅延読み込み
- [ ] フォントのプリロード
- [ ] コードスプリッティング
- [ ] バンドルサイズの最適化
- [ ] Lighthouse スコア90以上

### 6.2 バックエンド

- [ ] Lambda コールドスタート対策
- [ ] Gemini API レスポンスキャッシュ（同一入力）
- [ ] CloudWatch ログの最適化
- [ ] タイムアウト設定の調整

---

## 7. リリースチェックリスト

### 7.1 フロントエンド

- [ ] 本番環境のAPI URLを設定
- [ ] Google Analytics設定
- [ ] OGP画像の確認
- [ ] 404ページの実装
- [ ] エラーハンドリングの確認
- [ ] モバイルでの動作確認（iOS / Android）

### 7.2 バックエンド

- [ ] 環境変数の設定（GEMINI_API_KEY）
- [ ] CORS設定の確認
- [ ] レート制限の設定
- [ ] ログ出力の最適化
- [ ] エラー通知の設定（CloudWatch Alarms）

### 7.3 広告設定

- [ ] Google AdSenseアカウント作成
- [ ] 広告ユニット作成
- [ ] インタースティシャル広告の実装
- [ ] ネイティブ広告の実装
- [ ] 広告表示のテスト

---

## 8. よくある質問

### Q1: Gemini APIのコストが心配です
**A**: 1診断あたり約0.001ドル（Gemini Pro使用時）。月間10万診断でも約100ドル。Flashを使えば1/10に削減可能。

### Q2: スマホでスワイプが反応しません
**A**: `dragConstraints`と`dragElastic`の調整、タッチイベントの処理を確認してください。

### Q3: Vercelのビルドが失敗します
**A**: `vite.config.ts`のビルド設定を確認。特に`base`と`outDir`の設定。

### Q4: Lambda関数がタイムアウトします
**A**: デフォルト3秒では不足。`serverless.yml`で30秒に設定してください。

---

## 9. トラブルシューティング

### 問題: カードのアニメーションがカクつく
**解決策**:
- GPU加速を使用（`transform`, `opacity`のみ）
- `will-change`プロパティの使用
- 60fpsを維持できているか確認

### 問題: Gemini APIからエラーが返る
**解決策**:
- APIキーの確認
- レート制限の確認
- プロンプトの長さ確認（最大トークン数）
- JSON出力の強制が正しく機能しているか

### 問題: 広告が表示されない
**解決策**:
- AdSenseの審査状況確認
- テストモードの確認
- ドメイン認証の確認
- 広告ブロッカーの無効化

---

**このガイドに従って実装すれば、美しく機能的なサービスが完成します。不明点があれば、各仕様書を参照してください。**
