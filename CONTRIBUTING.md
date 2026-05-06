# Contributing to Bain de Secret Miroir

## 開発の進め方

### 1. リポジトリのクローン

```bash
git clone https://github.com/yourusername/bain-de-secret-miroir.git
cd bain-de-secret-miroir
```

### 2. ブランチ戦略

- `main` - 本番環境（常に動作する状態）
- `develop` - 開発環境（統合ブランチ）
- `feature/*` - 機能開発ブランチ
- `fix/*` - バグ修正ブランチ

### 3. 開発フロー

```bash
# 開発ブランチから新しいfeatureブランチを作成
git checkout develop
git pull origin develop
git checkout -b feature/your-feature-name

# 開発作業...

# コミット
git add .
git commit -m "feat: add swipe card component"

# プッシュ
git push origin feature/your-feature-name

# Pull Request作成
# GitHub上でdevelopブランチへのPRを作成
```

### 4. コミットメッセージ規約

コミットメッセージは以下の形式で記述してください：

```
<type>: <subject>

<body>
```

**Type:**
- `feat`: 新機能
- `fix`: バグ修正
- `docs`: ドキュメントのみの変更
- `style`: コードの意味に影響しない変更（空白、フォーマット等）
- `refactor`: リファクタリング
- `perf`: パフォーマンス改善
- `test`: テストの追加・修正
- `chore`: ビルドプロセスやツールの変更

**例:**
```
feat: add Phase 1 swipe card component

- Implement swipe gesture with Framer Motion
- Add left/right swipe detection
- Integrate with zustand store
```

### 5. Pull Request

PRを作成する際は以下を含めてください：

- [ ] 変更内容の説明
- [ ] スクリーンショット（UI変更の場合）
- [ ] テスト方法
- [ ] 関連するIssue番号

### 6. コードレビュー

- 少なくとも1人のレビュアーの承認が必要
- レビュアーのコメントには24時間以内に対応

### 7. マージ

- `develop`へのマージはSquash merge
- `main`へのマージはMerge commit

## 開発環境のセットアップ

### フロントエンド

```bash
cd frontend
npm install
cp ../.env.example .env
# .envファイルを編集
npm run dev
```

### バックエンド

```bash
cd backend
npm install
cp .env.example .env
# .envファイルを編集（GEMINI_API_KEYなど）
serverless offline start
```

## コーディング規約

### TypeScript

- 明示的な型定義を使用
- `any`の使用は避ける
- interfaceよりtypeを優先

### React

- 関数コンポーネントを使用
- Hooksを積極的に活用
- propsは分割代入で受け取る

### CSS

- Tailwind CSSのユーティリティクラスを使用
- カスタムCSSは最小限に
- CSS変数は`variables.css`で定義

## テスト

```bash
# ユニットテスト
npm run test

# E2Eテスト（実装後）
npm run test:e2e

# 型チェック
npm run type-check
```

## 質問・サポート

- Issueを作成してください
- または開発チームに連絡

---

**ご協力ありがとうございます！**
