
# RPGツクールMV アクターストレージプラグイン

[[English]](docs/README.en.md)

RPGツクールMVで、パーティメンバーを保管・管理できるシステムを追加するプラグインです。

## 機能

- パーティメンバーの保管と取り出し
- 保管中のアクターのステータス確認
- 「お別れ」機能でアクターを完全に除外
- パーティ最大人数の設定
- アクター管理用の使いやすいメニュー画面

## インストール方法

1. `dist`フォルダから`ActorStorage.js`を、プロジェクトの`js/plugins`フォルダにコピー
2. プラグイン管理で有効化

## 使い方

### プラグインコマンド

- `ActorStorage open` - アクター保管庫メニューを開く

### メニュー操作

- パーティメンバーと保管アクターの切り替え
- アクターの詳細ステータス確認
- パーティへの追加/削除
- アクターの永続的な除外（確認あり）

## 開発手順

ソースからビルドする:
```sh
npm install
npm run build
```
