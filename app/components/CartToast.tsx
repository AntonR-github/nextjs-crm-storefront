"use client";

import { useEffect } from "react";
import { useCart } from "../context/CartContext";

export default function CartToast() {
  const { toast, dismissToast } = useCart();

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(dismissToast, 3200);
    return () => window.clearTimeout(timer);
  }, [toast, dismissToast]);

  if (!toast) return null;

  return (
    <div className="toast is-visible" role="status" aria-live="polite">
      <span>{toast.message}</span>
      {toast.actionLabel && toast.onAction && (
        <button
          type="button"
          onClick={() => {
            toast.onAction?.();
            dismissToast();
          }}
        >
          {toast.actionLabel}
        </button>
      )}
    </div>
  );
}
