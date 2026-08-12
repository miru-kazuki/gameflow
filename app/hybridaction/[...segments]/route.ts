import { NextRequest } from "next/server";

function isSafeCallback(callback: string | null) {
  return Boolean(callback && /^[A-Za-z0-9_$\.\[\]]+$/.test(callback));
}

export async function GET(request: NextRequest) {
  const url = request.nextUrl;
  const callback = url.searchParams.get("__callback__") || url.searchParams.get("callback");
  const dataParam = url.searchParams.get("data") || "{}";

  let payload = { status: "ok", data: {} };
  try {
    payload.data = JSON.parse(dataParam || "{}");
  } catch {
    payload.data = { raw: dataParam };
  }

  const body = isSafeCallback(callback)
    ? `${callback}(${JSON.stringify(payload)});`
    : `/* hybridaction no-op */`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
