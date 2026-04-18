
# Real TODO Sample API

https://github.com/version1-workspace/ws-01-0100-fe-materials/tree/main/0600-next-context-api

こちらの課題で使用する API を管理するためのリポジトリです。

src/app/api 配下を zip にして、学習者が自分のローカル環境で確認できるようにしています。
api で使用するモジュールは全て api 配下に配置しているため、ローカルで起動する際は src/app/api 配下を zip にして展開してください。

## ローカルでの起動方法

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

## アクセス方法

開発サーバー起動後、以下の URL にアクセスできます。

| URL | 説明 |
| --- | --- |
| http://localhost:3000 | API 仕様書へリダイレクト |
| http://localhost:3000/api/v1 | API ルート (`{ "message": "ok" }`) |
| http://localhost:3000/api/v1/spec | API 仕様書 (Swagger UI) |

## API の配布用 zip 作成

```bash
make zip
```

`src/app/api` 配下を `dist/api.zip` としてまとめます。解凍すると `api/` ディレクトリが展開されます。
