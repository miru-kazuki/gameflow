export interface SyncProgressUpdate {
  percent: number;
  stage: string;
  loaded?: number;
  total?: number;
}

export interface SyncOptions {
  repo?: string;
  onProgress?: (progress: SyncProgressUpdate) => void;
  signal?: AbortSignal;
}

export async function fetchSyncWithProgress(
  options: SyncOptions = {}
): Promise<{ success: boolean; cancelled?: boolean; message: string }> {
  const { repo = "gameflow-builds", onProgress, signal } = options;

  onProgress?.({
    percent: 5,
    stage: "Menghubungkan ke Supabase Storage...",
  });

  try {
    const response = await fetch("/api/builds/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ repo }),
      signal,
    });

    if (!response.ok && !response.body) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP Error ${response.status}`);
    }

    if (!response.body) {
      throw new Error("Response body tidak mendukung streaming.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let lastMessage = "Sync berhasil!";

    while (true) {
      if (signal?.aborted) {
        reader.cancel();
        return { success: false, cancelled: true, message: "Sync dibatalkan oleh pengguna." };
      }

      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        try {
          const data = JSON.parse(trimmed);
          if (data.type === "progress") {
            onProgress?.({
              percent: data.percent,
              stage: data.stage || "Mengunduh build...",
              loaded: data.loaded,
              total: data.total,
            });
          } else if (data.type === "complete") {
            lastMessage = data.message || "Berhasil sync!";
            onProgress?.({
              percent: 100,
              stage: "Sync selesai!",
            });
            return { success: true, message: lastMessage };
          } else if (data.type === "error" || data.error) {
            throw new Error(data.error || "Gagal melakukan sync build.");
          }
        } catch (err: any) {
          if (err.message && !err.message.includes("Unexpected token")) {
            throw err;
          }
        }
      }
    }

    return { success: true, message: lastMessage };
  } catch (err: any) {
    if (err.name === "AbortError" || signal?.aborted) {
      return { success: false, cancelled: true, message: "Sync dibatalkan oleh pengguna." };
    }
    throw err;
  }
}
