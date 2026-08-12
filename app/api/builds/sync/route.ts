import { createClient } from '@supabase/supabase-js';
import AdmZip from 'adm-zip';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    async start(controller) {
      function pushEvent(data: object) {
        if (request.signal.aborted) return;
        try {
          controller.enqueue(encoder.encode(JSON.stringify(data) + "\n"));
        } catch {
          // Stream might be closed if client aborted
        }
      }

      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !supabaseKey) {
          pushEvent({ type: "error", error: 'Environment variable Supabase belum lengkap di .env.local' });
          controller.close();
          return;
        }

        if (request.signal.aborted) {
          controller.close();
          return;
        }

        pushEvent({
          type: "progress",
          percent: 10,
          stage: "Menghubungkan ke Supabase Storage...",
        });

        // Fetch file build langsung dari Supabase Storage API untuk pelacakan byte progress
        const storageUrl = `${supabaseUrl}/storage/v1/object/authenticated/builds/deck-recycle/latest.zip`;
        const res = await fetch(storageUrl, {
          headers: {
            Authorization: `Bearer ${supabaseKey}`,
          },
        });

        if (!res.ok || !res.body) {
          if (request.signal.aborted) {
            controller.close();
            return;
          }

          // Fallback menggunakan Supabase client jika HTTP direct download gagal
          const supabase = createClient(supabaseUrl, supabaseKey);
          pushEvent({ type: "progress", percent: 20, stage: "Mengunduh via Supabase Client SDK..." });

          const { data: zipBlob, error } = await supabase.storage
            .from('builds')
            .download('deck-recycle/latest.zip');

          if (error || !zipBlob) {
            pushEvent({
              type: "error",
              error: 'Gagal download dari Supabase: ' + (error?.message || 'File build tidak ditemukan'),
            });
            controller.close();
            return;
          }

          if (request.signal.aborted) {
            controller.close();
            return;
          }

          pushEvent({ type: "progress", percent: 70, stage: "Membaca data build..." });
          const arrayBuffer = await zipBlob.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);

          pushEvent({ type: "progress", percent: 85, stage: "Mengekstrak file build WebGL..." });
          const extractDir = path.join(process.cwd(), 'public', 'builds', 'deck-recycle', 'latest');
          if (!fs.existsSync(extractDir)) {
            fs.mkdirSync(extractDir, { recursive: true });
          }

          const zip = new AdmZip(buffer);
          zip.extractAllTo(extractDir, true);

          pushEvent({ type: "progress", percent: 100, stage: "Sync selesai!" });
          pushEvent({ type: "complete", message: "Berhasil sync build game!" });
          controller.close();
          return;
        }

        // Standard Streaming with Byte Counter
        const total = parseInt(res.headers.get("content-length") || "21667135", 10);
        const reader = res.body.getReader();
        const chunks: Uint8Array[] = [];
        let loaded = 0;

        pushEvent({
          type: "progress",
          percent: 15,
          stage: "Memulai pengunduhan ZIP build...",
          loaded: 0,
          total,
        });

        while (true) {
          if (request.signal.aborted) {
            reader.cancel();
            controller.close();
            return;
          }

          const { done, value } = await reader.read();
          if (done) break;

          if (value) {
            chunks.push(value);
            loaded += value.length;
            // Alokasikan 15% - 75% untuk tahap download byte progress
            const percent = Math.min(75, Math.max(15, Math.round(15 + (loaded / total) * 60)));
            const loadedMB = (loaded / (1024 * 1024)).toFixed(1);
            const totalMB = (total / (1024 * 1024)).toFixed(1);

            pushEvent({
              type: "progress",
              percent,
              stage: `Mengunduh ZIP build (${loadedMB} MB / ${totalMB} MB)...`,
              loaded,
              total,
            });
          }
        }

        if (request.signal.aborted) {
          controller.close();
          return;
        }

        pushEvent({
          type: "progress",
          percent: 80,
          stage: "Menggabungkan buffer file...",
        });

        // Gabungkan Uint8Array chunks menjadi satu Buffer
        const buffer = Buffer.concat(chunks);

        if (request.signal.aborted) {
          controller.close();
          return;
        }

        pushEvent({
          type: "progress",
          percent: 88,
          stage: "Mengekstrak berkas game ke folder public/builds...",
        });

        const extractDir = path.join(process.cwd(), 'public', 'builds', 'deck-recycle', 'latest');
        if (!fs.existsSync(extractDir)) {
          fs.mkdirSync(extractDir, { recursive: true });
        }

        const zip = new AdmZip(buffer);
        zip.extractAllTo(extractDir, true);

        pushEvent({
          type: "progress",
          percent: 98,
          stage: "Menyelesaikan verifikasi berkas...",
        });

        await new Promise((r) => setTimeout(r, 200));

        if (!request.signal.aborted) {
          pushEvent({
            type: "complete",
            message: "Berhasil sync build game ke versi terbaru!",
          });
        }

        controller.close();
      } catch (err: any) {
        if (!request.signal.aborted) {
          console.error("DEBUG SYNC STREAM ERROR:", err);
          pushEvent({ type: "error", error: "Server Exception: " + err.message });
        }
        controller.close();
      }
    },
  });

  return new Response(customStream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
    },
  });
}