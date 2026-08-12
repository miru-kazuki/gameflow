import { createClient } from '@supabase/supabase-js';
import AdmZip from 'adm-zip';
import { NextResponse } from 'next/server';

// Inisialisasi Supabase client (gunakan Service Role Key agar bisa bypass akses bucket private)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    // 1. Download file zip dari Supabase Storage
    const { data, error } = await supabase.storage
      .from('builds')
      .download('deck-recycle/latest.zip');

    if (error || !data) {
      throw new Error(error?.message || 'Gagal mengunduh file');
    }

    // 2. Ubah Blob menjadi Buffer
    const arrayBuffer = await data.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 3. Ekstrak file zip
    const zip = new AdmZip(buffer);
    
    // Tentukan folder tujuan ekstraksi di dalam server Next.js (misal folder public/game)
    const targetPath = './public/game'; 
    zip.extractAllTo(targetPath, true);

    return NextResponse.json({ message: 'Game berhasil di-deploy ke Dashboard!' });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}