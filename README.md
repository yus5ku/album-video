# Album Video

ビデオ処理機能を持つアルバムアプリケーションです。Web、API、2つの主要コンポーネントで構成されたモノレポ構造になっています。

## 技術スタック

### Frontend (Web)
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- React Hook Form
- NextAuth.js (LINE認証)

### Backend (API)
- Node.js v22 (Voltaで管理)
- Express.js
- TypeScript
- MySQL 8.0
- Prisma ORM
- Passport.js (LINE認証)

### Infrastructure
- Docker & Docker Compose
- MySQL 8.0

### デプロイ
- **Frontend**: Vercel
- **Backend**: Nginx + PM2
- **Database**: MySQL (本番環境)

### 開発環境
- Node.js v22系 (Voltaで管理)
- Docker & Docker Compose
- GitHub (バージョン管理)

### 認証
- LINE認証のみのログイン機能
- NextAuth.js (フロントエンド)
- Passport.js (バックエンド)

## 📁 プロジェクト構成

```
album-video/
├── web/                    # フロントエンド (Next.js)
├── api/                    # バックエンド (Node.js/Express)
├── docs/                   # ドキュメント
│   ├── ui/                # 画面設計図
│   └── requirements/      # 要件定義書
├── test/                   # 単体テスト
├── docker-compose.yml      # Docker Compose設定
├── Makefile               # 開発用コマンド
└── README.md
```

## 🛠️ 開発環境セットアップ

### 前提条件
- Node.js v22 (Voltaで管理)
- Docker & Docker Compose
- Make
- GitHub アカウント

### 環境変数設定

```bash
# .envファイルを作成
cp .env.example .env

# 必要な環境変数を設定
# - LINE_CLIENT_ID: LINE Developers Consoleで取得
# - LINE_CLIENT_SECRET: LINE Developers Consoleで取得
# - JWT_SECRET: ランダムな文字列
# - NEXTAUTH_SECRET: ランダムな文字列
```

### 起動方法

```bash
# コンテナ起動
make up

# コンテナ終了
make down

# 開発環境セットアップ（初回）
make setup
```

### アクセス
- **フロントエンド**: http://localhost:3000
- **API**: http://localhost:3001
- **データベース**: localhost:3306

## 📚 ドキュメント

- **APIドキュメント**: `api/docs/` ディレクトリ内で都度更新
- **画面設計図**: `docs/ui/` ディレクトリに格納
- **要件定義書**: `docs/requirements/` ディレクトリに格納

## 🧪 テスト

- **単体テスト**: `test/` ディレクトリに格納
- **E2Eテスト**: `web/e2e/` ディレクトリに格納

## 🔧 開発用コマンド

```bash
# コンテナ起動
make up

# コンテナ終了
make down

# コンテナ再起動
make restart

# ビルド
make build

# ログ確認
make logs

# クリーンアップ
make clean

# データベースリセット
make reset-db
```

## 📋 機能

- **認証機能**
  - LINE認証のみのログイン機能
  - セッション管理
- **ビデオ機能**
  - ビデオアップロード・管理
  - ビデオ処理機能
  - プレビュー機能
- **アルバム機能**
  - アルバム作成・編集
  - ビデオの整理・分類
- **UI/UX**
  - レスポンシブデザイン
  - モバイルファースト設計

## 🤝 コントリビューション

1. このリポジトリをフォーク
2. フィーチャーブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add some amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを作成

## 📄 ライセンス

このプロジェクトはMITライセンスの下で公開されています。
