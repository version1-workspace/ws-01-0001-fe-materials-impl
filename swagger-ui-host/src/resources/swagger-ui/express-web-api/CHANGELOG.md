# Changelog

## 2026-05-25

### Changed

- `/users/tasks/{id}` の path parameter `id` を `integer` から `string` の UUID に変更しました。
- `Task.id` が UUID として定義されているため、タスク詳細取得、更新、削除の URL パラメータも同じ型に揃えました。

### Added

- `/auth/signup` に `409 Conflict` レスポンスを追加しました。
- メールアドレス重複時のエラー例として `Email already exists` を追加しました。

### Compatibility

- `/users/tasks/{id}` は UUID を受け取る前提の API 定義になります。
- 数値 ID を前提に生成されたクライアントやテストは、UUID を渡すように更新が必要です。
