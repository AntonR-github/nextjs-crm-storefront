import { NextRequest, NextResponse } from "next/server";
import { finalizeOrder } from "../../../lib/orders";

// Client-side backup — the server-side finalize on the success page's
// initial load (Task 22) is the primary path, but if that whole request
// never completed (browser closed mid-redirect, etc.), this fires once the
// page actually renders. Idempotent server-side, safe to call more than once.
export async function POST(req: NextRequest) {
  const { orderId } = await req.json();
  if (typeof orderId !== "string" || !orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }
  const ok = await finalizeOrder(orderId);
  return NextResponse.json({ ok });
}
