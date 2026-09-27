// ランキングAPI: GET=上位取得 / POST=登録
// D1 binding: DB (table: scores)

const json = (data, status = 200) =>
  Response.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });

export async function onRequestGet(context) {
  const url = new URL(context.request.url);
  const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "10", 10) || 10, 1), 50);
  try {
    const { results } = await context.env.DB.prepare(
      "SELECT id, name, lines, won, mode, created_at FROM scores ORDER BY lines DESC, id ASC LIMIT ?"
    )
      .bind(limit)
      .all();
    return json({ ok: true, ranking: results ?? [] });
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) }, 500);
  }
}

export async function onRequestPost() {
  // 記録の書き込みは端末ローカルのみ。リンク経由の荒らし防止のためAPI書込は無効。
  return Response.json({ ok: false, error: "score submission is local-only" }, { status: 403 });
}
