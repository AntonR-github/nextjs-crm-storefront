import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "crypto";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export async function POST(request: Request) {
  const { secret, path } = await request.json();
  const expected = process.env.REVALIDATE_SECRET;
  if (!expected || typeof secret !== "string" || !safeEqual(secret, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidatePath(path ?? "/");
  return NextResponse.json({ revalidated: true, path });
}
