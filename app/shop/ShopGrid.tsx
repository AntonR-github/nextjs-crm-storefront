"use client";

import { useState } from "react";
import ProductCard from "../components/ProductCard";
import type { StoreProduct } from "../../lib/products-data";
import type { Category } from "../../lib/categories";

export default function ShopGrid({ products, categories }: { products: StoreProduct[]; categories: Category[] }) {
  const [filter, setFilter] = useState<string>("all");
  const visible = filter === "all" ? products : products.filter((p) => p.category.slug === filter);

  return (
    <>
      <section className="shop-toolbar" aria-label="סינון מוצרים">
        <div className="shell">
          <div>
            <span>{products.length} דגמים</span>
            <b>הקולקציה הרשמית בישראל</b>
          </div>
          <div className="shop-filters">
            <button className={filter === "all" ? "is-active" : undefined} type="button" onClick={() => setFilter("all")}>
              הכול
            </button>
            {categories.map((category) => (
              <button
                key={category.slug}
                className={filter === category.slug ? "is-active" : undefined}
                type="button"
                onClick={() => setFilter(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="products shop-catalog" id="catalog">
        <div className="shell">
          <div className="product-grid">
            {visible.map((product) => (
              <ProductCard key={product.id} product={product} featured={product.handle === "at-799"} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
