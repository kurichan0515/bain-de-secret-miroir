#!/bin/bash

# Bain de Secret Miroir - Git初期化スクリプト

echo "🎭 Bain de Secret Miroir - Gitリポジトリ初期化"
echo ""

# 現在のディレクトリを確認
if [ ! -f "README.md" ]; then
    echo "❌ エラー: README.mdが見つかりません。プロジェクトルートで実行してください。"
    exit 1
fi

# Gitリポジトリを初期化
echo "📦 Gitリポジトリを初期化中..."
git init

# .gitignoreの確認
if [ ! -f ".gitignore" ]; then
    echo "❌ エラー: .gitignoreが見つかりません。"
    exit 1
fi

# すべてのファイルをステージング
echo "📝 ファイルをステージング中..."
git add .

# 初期コミット
echo "✅ 初期コミットを作成中..."
git commit -m "feat: initial commit - project setup with complete documentation

- Add project requirements and specifications
- Add all 58 questions (Phase 1-3) in JSON format
- Add design specifications (colors, fonts, animations)
- Add AI prompt design for Gemini API
- Add technical specifications (frontend/backend)
- Add implementation guide
- Add scoring configuration and diagnostic types"

# ブランチ名をmainに変更
echo "🌿 デフォルトブランチをmainに設定..."
git branch -M main

echo ""
echo "✨ 初期化完了！"
echo ""
echo "次のステップ："
echo "1. GitHubでリポジトリを作成"
echo "2. リモートリポジトリを追加："
echo "   git remote add origin https://github.com/yourusername/bain-de-secret-miroir.git"
echo "3. プッシュ："
echo "   git push -u origin main"
echo ""
echo "または、以下のコマンドで対話的にセットアップ："
echo "   bash scripts/setup-remote.sh"
echo ""
