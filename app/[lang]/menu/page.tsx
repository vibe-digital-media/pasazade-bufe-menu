"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
};

const categories = [
  "Tümü",
  "Yarım Ekmek",
  "Pide Arası",
  "Sandviçler",
  "Tostlar",
  "Dürümler",
  "Soğuk İçecekler",
  "Sıcak İçecekler",
];

export default function MenuPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const getProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("category", { ascending: true });

    if (error) {
      console.log(error);
      return;
    }

    setProducts(data || []);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const filtered =
    activeCategory === "Tümü"
      ? products
      : products.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-[#f8f5ef] px-4 py-6 text-[#171717]">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 overflow-hidden rounded-[2rem] bg-[#151515] p-7 text-white shadow-xl">
          <p className="mb-3 text-xs font-extrabold tracking-[0.35em] text-orange-500">
            PAŞAZADE BÜFE
          </p>
          <h1 className="text-4xl font-black tracking-tight">Menü</h1>
          <p className="mt-3 max-w-xl text-sm text-white/55">
            Taze, hızlı ve esnaf lezzetinin en iyi hali.
          </p>
        </header>

        <div className="sticky top-0 z-20 -mx-4 mb-6 bg-[#f8f5ef]/90 px-4 py-3 backdrop-blur">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold shadow-sm transition ${
                  activeCategory === cat
                    ? "bg-[#151515] text-white"
                    : "border border-black/10 bg-white text-[#171717]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="flex gap-4 rounded-[1.75rem] border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-3xl border border-black/10 bg-[#f3f0ea] shadow-inner">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">🍽️</span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                  {item.category}
                </p>

                <h2 className="mt-1 text-2xl font-black leading-tight text-[#151515]">
                  {item.name}
                </h2>

                {item.description && (
                  <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-black/55">
                    {item.description}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between gap-3">
                  <p className="text-2xl font-black text-[#151515]">
                    {item.price || ""}
                  </p>

                  <button className="rounded-full bg-[#151515] px-4 py-2 text-xs font-bold text-white">
                    İncele
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-3xl bg-white p-8 text-center text-sm text-black/50 shadow-sm">
              Bu kategoride ürün yok.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}