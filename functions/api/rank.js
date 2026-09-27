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

export async function onRequestPost(context) {
  let body;
  try {
    body = await context.request.json();
  } catch {
    return json({ ok: false, error: "invalid json" }, 400);
  }
  const name = String(body.name ?? "").trim().slice(0, 12);
  const lines = Number(body.lines);
  const won = body.won ? 1 : 0;
  const mode = ["versus", "watch", "timeattack"].includes(body.mode) ? body.mode : "versus";

  if (!name) return json({ ok: false, error: "name required" }, 400);
  if (!Number.isInteger(lines) || lines < 0 || lines > 99999)
    return json({ ok: false, error: "invalid lines" }, 400);

  try {
    const r = await context.env.DB.prepare(
      "INSERT INTO scores (name, lines, won, mode) VALUES (?, ?, ?, ?)"
    )
      .bind(name, lines, won, mode)
      .run();
    // 登録後の順位を返す
    const rank = await context.env.DB.prepare(
      "SELECT COUNT(*) + 1 AS rank FROM scores WHERE lines > ?"
    )
      .bind(lines)
      .first("rank");
    return json({ ok: true, id: r.meta.last_row_id, rank });
  } catch (e) {
    return json({ ok: false, error: String((e && e.message) || e) }, 500);
  }
}
