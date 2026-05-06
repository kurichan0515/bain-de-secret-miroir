#!/bin/bash

# Bain de Secret Miroir - リモートリポジトリセットアップスクリプト

echo "🎭 Bain de Secret Miroir - リモートリポジトリセットアップ"
echo ""

# GitHubユーザー名を入力
read -p "GitHubユーザー名を入力してください: " github_username

if [ -z "$github_username" ]; then
    echo "❌ エラー: ユーザー名が入力されていません。"
    exit 1
fi

# リポジトリ名（デフォルト: bain-de-secret-miroir）
read -p "リポジトリ名 [bain-de-secret-miroir]: " repo_name
repo_name=${repo_name:-bain-de-secret-miroir}

# リモートURLを構築
remote_url="https://github.com/${github_username}/${repo_name}.git"

echo ""
echo "📍 リモートURL: $remote_url"
echo ""

# 既存のリモートを確認
if git remote | grep -q "origin"; then
    echo "⚠️  既存のリモート 'origin' が見つかりました。"
    read -p "上書きしますか？ (y/N): " overwrite
    
    if [ "$overwrite" = "y" ] || [ "$overwrite" = "Y" ]; then
        git remote remove origin
        echo "✅ 既存のリモートを削除しました。"
    else
        echo "❌ キャンセルしました。"
        exit 0
    fi
fi

# リモートを追加
echo "📡 リモートリポジトリを追加中..."
git remote add origin "$remote_url"

echo "✅ リモートリポジトリを追加しました。"
echo ""
echo "次のステップ："
echo "1. GitHubで以下のURLにアクセスし、リポジトリを作成してください："
echo "   https://github.com/new"
echo ""
echo "   Repository name: $repo_name"
echo "   Description: AIによる深層心理分析を用いた、耽美な大人のための性癖自己発見診断"
echo "   Private/Public: お好みで選択"
echo "   ⚠️ 「Initialize this repository with」は何もチェックしない"
echo ""
echo "2. リポジトリ作成後、以下のコマンドでプッシュ："
echo "   git push -u origin main"
echo ""
echo "3. developブランチを作成："
echo "   git checkout -b develop"
echo "   git push -u origin develop"
echo ""
