import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const project = body.project || "Deck Recycle";
    const version = body.version || `0.${Math.floor(Math.random() * 10 + 13)}.0`;
    const fileName = body.fileName || "deck-recycle/latest.zip";

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: "Kredensial Supabase tidak terkonfigurasi di environment." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Broadcast realtime event over Supabase Realtime channel
    const channel = supabase.channel("gameflow-builds");
    
    await channel.subscribe();
    
    await channel.send({
      type: "broadcast",
      event: "new-build",
      payload: {
        project,
        version,
        fileName,
        timestamp: new Date().toISOString(),
        message: `File build ${fileName} baru saja diperbarui di Supabase Storage.`,
      },
    });

    // Optionally update/upsert dummy metadata file in Supabase storage if storage bucket exists
    try {
      const dummyContent = JSON.stringify({ project, version, updatedAt: new Date().toISOString() });
      await supabase.storage
        .from("builds")
        .upload("build-manifest.json", Buffer.from(dummyContent), {
          contentType: "application/json",
          upsert: true,
        });
    } catch (storageErr) {
      console.warn("Storage upload warning (non-fatal):", storageErr);
    }

    return NextResponse.json({
      success: true,
      message: `Event build baru (${project} v${version}) berhasil disiarkan ke Supabase Realtime!`,
      data: { project, version, fileName },
    });
  } catch (error: any) {
    console.error("Notify API error:", error);
    return NextResponse.json({ error: error.message || "Server Error" }, { status: 500 });
  }
}
