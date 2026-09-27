# T-AI vs YOU — テトリス30秒アタック

遺伝的アルゴリズムで学習したテトリスAI（6重み線形評価・GPU学習）と対戦する、
30秒タイムアタックのブラウザゲーム。Cloudflare Pages + D1 で公開。

- プレイ: https://tetris-vs-ai.pages.dev
- スマホはフリックパッド操作対応
- ランキングの記録は端末内（localStorage）に保存。クラウド参照は初回読み込み時のみ

## 開発

```sh
npm install
npm run dev     # ローカル起動 (Pages + D1ローカル)
npm run deploy  # 本番デプロイ
```
