import { NextResponse } from "next/server";
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, extname } from "node:path";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { MENU_ITEMS } from "@/lib/mock-data";

export const runtime = "nodejs";

function mime(filename: string): string {
  const ext = extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".webp": "image/webp",
  };
  return map[ext] ?? "image/jpeg";
}

async function uploadFile(
  service: Awaited<ReturnType<typeof createServiceClient>>,
  localPath: string,
  storagePath: string
): Promise<string | null> {
  if (!existsSync(localPath)) return null;
  const buffer = readFileSync(localPath);
  const { error } = await service.storage
    .from("media")
    .upload(storagePath, buffer, {
      contentType: mime(localPath),
      upsert: true,
    });
  if (error) return null;
  const { data } = service.storage.from("media").getPublicUrl(storagePath);
  return data.publicUrl;
}

export async function POST() {
  // Require authenticated session
  const auth = await createClient();
  const { data: { user } } = await auth.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const service = await createServiceClient();
  const log: string[] = [];
  let productsSeeded = 0;
  let cakesSeeded = 0;
  let bentoSeeded = 0;

  // ── Products ──────────────────────────────────────────────────────────────
  const { count: existingProducts } = await service
    .from("products")
    .select("*", { count: "exact", head: true });

  if (existingProducts && existingProducts > 0) {
    log.push(`Products: already have ${existingProducts} rows — skipped`);
  } else {
    for (const [idx, item] of MENU_ITEMS.entries()) {
      const { data: product, error: pErr } = await service
        .from("products")
        .insert({
          name: item.name,
          description: item.description,
          category: item.category,
          sort_order: idx,
          status: "active",
          featured: item.featured ?? false,
        })
        .select("id")
        .single();

      if (pErr || !product) {
        log.push(`  ✗ ${item.name}: ${pErr?.message}`);
        continue;
      }

      const localPath = join(process.cwd(), "public", item.image);
      const storagePath = `products/${product.id}/${item.image.split("/").pop()}`;
      const url = await uploadFile(service, localPath, storagePath);

      if (url) {
        await service.from("product_images").insert({
          product_id: product.id,
          url,
          sort_order: 0,
          is_cover: true,
        });
        log.push(`  ✓ ${item.name}`);
        productsSeeded++;
      } else {
        log.push(`  ✓ ${item.name} (no image file found)`);
        productsSeeded++;
      }
    }
  }

  // ── Customizable items ────────────────────────────────────────────────────
  const { count: existingCus } = await service
    .from("customizable_items")
    .select("*", { count: "exact", head: true });

  if (existingCus && existingCus > 0) {
    log.push(`Customizable: already have ${existingCus} rows — skipped`);
  } else {
    // Cakes
    const cakesDir = join(process.cwd(), "public", "customizable", "cakes");
    const cakeFiles = existsSync(cakesDir)
      ? readdirSync(cakesDir)
          .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
          .sort()
      : [];

    for (let i = 0; i < cakeFiles.length; i++) {
      const code = `C${i + 1}`;
      const { data: cusItem, error: cErr } = await service
        .from("customizable_items")
        .insert({ gallery: "cakes", code, sort_order: i })
        .select("id")
        .single();

      if (cErr || !cusItem) {
        log.push(`  ✗ Cake ${code}: ${cErr?.message}`);
        continue;
      }

      const localPath = join(cakesDir, cakeFiles[i]);
      const storagePath = `customizable/cakes/${cakeFiles[i]}`;
      const url = await uploadFile(service, localPath, storagePath);

      if (url) {
        await service.from("customizable_images").insert({
          item_id: cusItem.id,
          url,
          sort_order: 0,
        });
      }
      log.push(`  ✓ ${code} — ${cakeFiles[i]}`);
      cakesSeeded++;
    }

    // Bento
    const bentoDir = join(process.cwd(), "public", "customizable", "bento");
    const bentoFiles = existsSync(bentoDir)
      ? readdirSync(bentoDir)
          .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))
          .sort()
      : [];

    for (let i = 0; i < bentoFiles.length; i++) {
      const code = `B${i + 1}`;
      const { data: bentoItem, error: bErr } = await service
        .from("customizable_items")
        .insert({ gallery: "bento", code, sort_order: i })
        .select("id")
        .single();

      if (bErr || !bentoItem) {
        log.push(`  ✗ Bento ${code}: ${bErr?.message}`);
        continue;
      }

      const localPath = join(bentoDir, bentoFiles[i]);
      const storagePath = `customizable/bento/${bentoFiles[i]}`;
      const url = await uploadFile(service, localPath, storagePath);

      if (url) {
        await service.from("customizable_images").insert({
          item_id: bentoItem.id,
          url,
          sort_order: 0,
        });
      }
      log.push(`  ✓ ${code} — ${bentoFiles[i]}`);
      bentoSeeded++;
    }
  }

  return NextResponse.json({
    productsSeeded,
    cakesSeeded,
    bentoSeeded,
    log,
  });
}
