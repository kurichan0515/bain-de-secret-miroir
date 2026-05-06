# トラブルシューティング：シンタックスエラー

## 🔍 Windows環境での一般的な問題

### 問題1: 改行コードの違い

**症状**: 
- シンタックスエラーが表示される
- ファイルが正しく読み込めない

**原因**: 
Windows (CRLF) と Unix (LF) の改行コードの違い

**解決方法**:

#### VS Code / Cursorで修正

1. 問題のファイルを開く
2. 右下のステータスバーで `CRLF` をクリック
3. `LF` を選択
4. ファイルを保存

または、コマンドパレット (Ctrl+Shift+P) で：
```
Change End of Line Sequence → LF
```

#### Git設定で自動変換

```bash
# Windowsで推奨設定
git config --global core.autocrlf true

# リポジトリを再クローン
git clone https://github.com/kurichan0515/bain-de-secret-miroir.git
```

---

### 問題2: JSONシンタックスエラー

**エラーが出ているファイルを特定**:

```bash
# すべてのJSONファイルを検証
cd bain-de-secret-miroir

# Windows (PowerShell)
Get-ChildItem -Recurse -Filter *.json | ForEach-Object { 
    python -m json.tool $_.FullName > $null 2>&1
    if ($?) { Write-Host "$($_.Name): OK" } 
    else { Write-Host "$($_.Name): ERROR" }
}

# Mac/Linux
for file in $(find . -name "*.json"); do
    python3 -m json.tool "$file" > /dev/null 2>&1 && echo "$file: OK" || echo "$file: ERROR"
done
```

---

### 問題3: スクリプトファイルの実行権限

**症状**: 
`bash: permission denied`

**解決方法**:

```bash
# 実行権限を付与
chmod +x scripts/*.sh

# または個別に
chmod +x scripts/init-git.sh
chmod +x scripts/setup-remote.sh
```

---

## 🛠️ ファイル別の確認方法

### JSONファイルの検証

```bash
# phase1.json
python -m json.tool data/phase1.json

# phase2.json
python -m json.tool data/phase2.json

# phase3.json
python -m json.tool data/phase3.json

# scoring_config.json
python -m json.tool data/scoring_config.json
```

エラーが出た場合、行番号が表示されます。

---

### YAMLファイルの検証

```bash
# GitHub Actions workflow
python -m yaml .github/workflows/ci-cd.yml

# またはオンラインツール
# https://www.yamllint.com/
```

---

## 📝 よくあるエラーと解決方法

### エラー1: `Expecting property name enclosed in double quotes`

**原因**: JSONの末尾にカンマが余分にある

**修正例**:
```json
// ❌ 間違い
{
  "key1": "value1",
  "key2": "value2",  // ← この末尾カンマがエラー
}

// ✅ 正しい
{
  "key1": "value1",
  "key2": "value2"
}
```

---

### エラー2: `SyntaxError: Unexpected token`

**原因**: 全角文字が混入している

**確認方法**:
Cursor/VS Codeで該当ファイルを開き、全角スペースをハイライト表示

**設定**:
```json
// settings.json
{
  "editor.renderWhitespace": "all"
}
```

---

### エラー3: `command not found`

**原因**: シェルスクリプトの改行コードがCRLF

**解決方法**:
```bash
# dos2unixをインストール（Mac）
brew install dos2unix

# 変換
dos2unix scripts/init-git.sh
dos2unix scripts/setup-remote.sh

# またはVS Code/Cursorで開いて LF に変更
```

---

## 🔧 完全クリーンセットアップ

すべてリセットしてやり直す場合：

```bash
# 1. プロジェクトフォルダを削除
rm -rf bain-de-secret-miroir

# 2. GitHubから新規クローン
git clone https://github.com/kurichan0515/bain-de-secret-miroir.git
cd bain-de-secret-miroir

# 3. Git設定（改行コード自動変換）
git config core.autocrlf input  # Mac/Linux
git config core.autocrlf true   # Windows

# 4. ファイル検証
python -m json.tool data/phase1.json
```

---

## 💡 Cursorでの確認方法

### 1. 問題ファイルを特定

Cursorのターミナルで：
```bash
# エラーメッセージを確認
# どのファイルの何行目でエラーが出ているか
```

### 2. Cursorに聞く

Cursorチャット (Cmd+L) で：
```
このエラーを修正してください：
[エラーメッセージをコピペ]
```

### 3. ファイルを開いて確認

- エラーが出ているファイルを開く
- 右下で改行コードを確認 (CRLF → LF に変更)
- 保存

---

## 🆘 それでも解決しない場合

### エラーメッセージを共有してください

以下の情報があると解決しやすいです：

1. **エラーメッセージ全文**
2. **どのファイルでエラーが出ているか**
3. **OS**: Windows / Mac / Linux
4. **使用ツール**: Cursor / VS Code / その他

---

## ✅ 動作確認

すべて修正したら：

```bash
# JSONファイル検証
for file in data/*.json; do python -m json.tool "$file" > /dev/null && echo "$file: OK" || echo "$file: ERROR"; done

# Git状態確認
git status

# Cursor/VS Codeでプロジェクトを開く
```

---

**具体的なエラーメッセージを教えていただければ、ピンポイントで解決策を提示できます！**
