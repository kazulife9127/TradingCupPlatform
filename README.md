# Trading Cup Platform

IZKYトークンのトレーディング大会プラットフォーム。

## 構成

| パス | 説明 | ポート |
|---|---|---|
| `apps/web` | ユーザー向け (モバイルファースト) | 3000 |
| `apps/admin` | 管理画面 (PC) | 3001 |
| `packages/database` | Prisma + Supabase (PostgreSQL) | - |
| `packages/types` | 共有型定義 | - |

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

```bash
cp .env.example .env
```

`.env` を編集し、Supabase の接続情報と NextAuth のシークレットを設定。

### 3. Prisma Client の生成

```bash
npm run db:generate
```

### 4. データベースのスキーマ反映

```bash
npm run db:push
```

### 5. 初期管理者ユーザーの作成

```bash
npm run db:seed
```

デフォルト管理者:
- Email: `admin@tradingcup.io`
- Password: `admin123`

### 6. 開発サーバーの起動

```bash
# 両方同時に起動
npm run dev

# 個別起動
npm run dev:web    # http://localhost:3000
npm run dev:admin  # http://localhost:3001
```

## Vercel デプロイ

### Web (ユーザー向け)

1. Vercel で新規プロジェクト作成
2. リポジトリを接続
3. Root Directory: `apps/web`
4. Framework Preset: Next.js
5. 環境変数を設定:
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL` (デプロイ先のURL)

### Admin (管理画面)

1. Vercel で新規プロジェクト作成
2. 同じリポジトリを接続
3. Root Directory: `apps/admin`
4. Framework Preset: Next.js
5. 環境変数を設定 (上記と同じ + `NEXTAUTH_URL` はadmin側のURL)

## 技術スタック

- Next.js 15 (App Router)
- Turborepo
- Supabase (PostgreSQL)
- Prisma ORM
- NextAuth.js v5
- Tailwind CSS v4
- TypeScript
