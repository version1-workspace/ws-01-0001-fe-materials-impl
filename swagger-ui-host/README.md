# swagger-ui-host

Swagger UI を Next.js 上で配信するためのホストアプリです。  
`src/resources/swagger-ui/<id>/swagger.yaml` に配置した OpenAPI 定義を、`/specs?id=<id>` でブラウザ表示できます。

例)
- https://vws-api-spec-host.netlify.app/specs?id=express-web-api

## 概要

- ルート `/` にアクセスすると `/specs` へリダイレクトします
- `/specs?id=<id>` で Swagger UI の HTML を返します
- `/specs/yml?id=<id>` で対象の `swagger.yaml` を返します
- Swagger UI 本体は CDN の `swagger-ui-dist` を利用しています

現状は以下の API 定義が同梱されています。

- `express-web-api`

## ディレクトリ構成

```text
src/
├── app/
│   ├── page.tsx                # / -> /specs へリダイレクト
│   └── specs/
│       ├── route.ts            # Swagger UI HTML を返す
│       └── yml/
│           └── route.ts        # swagger.yaml を返す
└── resources/
    └── swagger-ui/
        ├── index.html          # Swagger UI テンプレート
        └── express-web-api/
            └── swagger.yaml    # OpenAPI 定義
```

## セットアップ

```bash
npm install
```

## 起動方法

開発サーバー:

```bash
npm run dev
```

本番ビルド:

```bash
npm run build
npm run start
```

Lint:

```bash
npm run lint
```

Format:

```bash
npm run format
```

## デプロイ

デプロイ先は Netlify を想定しています。

### 環境変数

Swagger UI が参照する API のホストは `NEXT_PUBLIC_API_URL` で指定します。未指定時は `http://localhost:3000` が使われます。
本番環境では本番ドメインに合わせて Netlify で環境変数を設定してください。

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

この値は `/specs?id=<id>` で返す HTML 内の Swagger UI 設定に埋め込まれます。

## 確認用リンク

ローカルで `npm run dev` 実行後:

- Swagger UI: `http://localhost:3000/specs?id=express-web-api`
- OpenAPI YAML: `http://localhost:3000/specs/yml?id=express-web-api`

