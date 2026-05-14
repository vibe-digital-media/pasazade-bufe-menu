"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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

const categoriesTR = [
  "Tümü",
  "Yarım Ekmek",
  "Pide Arası",
  "Sandviçler",
  "Tostlar",
  "Dürümler",
  "Soğuk İçecekler",
  "Sıcak İçecekler",
];

const categoryOrder = [
  "Yarım Ekmek",
  "Pide Arası",
  "Sandviçler",
  "Tostlar",
  "Dürümler",
  "Soğuk İçecekler",
  "Sıcak İçecekler",
];

const ui = {
  tr: {
    menu: "Menü",
    subtitle: "Beyazıt’ın hızlı, taze ve lezzetli büfe menüsü.",
    all: "Tümü",
    view: "İncele",
    empty: "Bu kategoride ürün yok.",
    home: "Ana Sayfa",
    contact: "İletişim",
  },
  en: {
    menu: "Menu",
    subtitle: "Fresh and fast local street food in Beyazıt.",
    all: "All",
    view: "View",
    empty: "No products in this category.",
    home: "Home",
    contact: "Contact",
  },
  de: {
    menu: "Speisekarte",
    subtitle: "Frische und schnelle lokale Küche in Beyazıt.",
    all: "Alle",
    view: "Ansehen",
    empty: "Keine Produkte in dieser Kategorie.",
    home: "Startseite",
    contact: "Kontakt",
  },
  ru: {
    menu: "Меню",
    subtitle: "Свежая и быстрая местная кухня в Беязыте.",
    all: "Все",
    view: "Подробнее",
    empty: "В этой категории пока нет товаров.",
    home: "Главная",
    contact: "Контакт",
  },
};

const categoryTranslate: Record<string, Record<string, string>> = {
  en: {
    "Tümü": "All",
    "Yarım Ekmek": "Half Bread",
    "Pide Arası": "Burger Bread",
    Sandviçler: "Sandwiches",
    Tostlar: "Toasts",
    Dürümler: "Wraps",
    "Soğuk İçecekler": "Cold Drinks",
    "Sıcak İçecekler": "Hot Drinks",
  },
  de: {
    "Tümü": "Alle",
    "Yarım Ekmek": "Halbes Brot",
    "Pide Arası": "Pide-Brot",
    Sandviçler: "Sandwiches",
    Tostlar: "Toasts",
    Dürümler: "Wraps",
    "Soğuk İçecekler": "Kalte Getränke",
    "Sıcak İçecekler": "Heiße Getränke",
  },
  ru: {
    "Tümü": "Все",
    "Yarım Ekmek": "Половина хлеба",
    "Pide Arası": "В лепёшке",
    Sandviçler: "Сэндвичи",
    Tostlar: "Тосты",
    Dürümler: "Роллы",
    "Soğuk İçecekler": "Холодные напитки",
    "Sıcak İçecekler": "Горячие напитки",
  },
};

const productTranslate: Record<string, Record<string, string>> = {
  en: {
    Köfte: "Meatball Sandwich",
    Döner: "Doner",
    "Tavuk Döner": "Chicken Doner",
    "Dürüm Tavuk Döner": "Chicken Doner Wrap",
    "Köfte Dürüm": "Meatball Wrap",
    Ciğer: "Liver",
    "Ciğer Dürüm": "Liver Wrap",
    "Soya Soslu Tavuk": "Soy Sauce Chicken",
    "Kaşarlı Tost": "Cheese Toast",
    "Karışık Tost": "Mixed Toast",
    "Kavurmalı Tost": "Roasted Meat Toast",
    "Sucuklu Tost": "Turkish Sausage Toast",
    "Salamlı Tost": "Salami Toast",
    "Kavurma Kaşarlı Tost": "Roasted Meat & Cheese Toast",
    "Kavurma Kaşarlı": "Roasted Meat & Cheese",
    "Ton Balıklı": "Tuna Sandwich",
    "Arnavut Ciğeri": "Albanian Liver",
    Hamburger: "Hamburger",
    Sosisli: "Hot Dog",
    "Sosisli (Amerikan salata ile)": "Hot Dog with American Salad",
    Kaşarlı: "Cheese Sandwich",
    Karışık: "Mixed Sandwich",
    Vejetaryen: "Vegetarian",
    Patso: "Fries Sandwich",
    "Greyfurt Suyu": "Grapefruit Juice",
    "Portakal Suyu": "Orange Juice",
    Ayran: "Ayran",
    Kola: "Cola",
    Fanta: "Fanta",
    Soda: "Sparkling Water",
    Cappy: "Fruit Juice",
    "0,5 Lt Su": "0.5 L Water",
    "1,5 Lt Su": "1.5 L Water",
    "Nar Suyu": "Pomegranate Juice",
    Çay: "Tea",
    Nescafe: "Nescafe",
    Kapuçino: "Cappuccino",
    Salep: "Salep",
    "Elma Çayı": "Apple Tea",
    Kuşburnu: "Rosehip Tea",
  },
  de: {},
  ru: {},
};

export default function MenuPage() {
  const params = useParams();
  const currentLang = params.lang as string;

  const lang = ["tr", "en", "de", "ru"].includes(currentLang)
    ? currentLang
    : "tr";

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const t = ui[lang as keyof typeof ui];

  const translateCategory = (cat: string | null) => {
    if (!cat) return "";
    if (lang === "tr") return cat;
    return categoryTranslate[lang]?.[cat] || cat;
  };

  const translateProduct = (name: string) => {
    if (lang === "tr") return name;
    return productTranslate[lang]?.[name] || name;
  };

  const getProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.log(error);
      return;
    }

    setProducts(data || []);
  };

  useEffect(() => {
    getProducts();
  }, []);

  const sortedProducts = [...products].sort((a, b) => {
    const categoryA = categoryOrder.indexOf(a.category || "");
    const categoryB = categoryOrder.indexOf(b.category || "");

    if (categoryA !== categoryB) return categoryA - categoryB;

    return a.name.localeCompare(b.name, "tr");
  });

  const filtered =
    activeCategory === "Tümü"
      ? sortedProducts
      : sortedProducts.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6eadb] px-4 py-5 text-[#23150d]">
      <div className="fixed right-4 top-4 z-50 flex gap-2">
        <a
          href="/"
          className="rounded-full border border-white/40 bg-white/80 px-4 py-2 text-xs font-black shadow-xl backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
        >
          {t.home}
        </a>

        <a
          href="https://wa.me/902125178513"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gradient-to-r from-[#6b2f12] via-[#b85b20] to-[#f2a23a] px-4 py-2 text-xs font-black text-white shadow-xl transition hover:-translate-y-0.5"
        >
          {t.contact}
        </a>
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="relative mb-6 overflow-hidden rounded-[2.5rem] bg-[#1b100b] p-7 text-white shadow-2xl md:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(242,162,58,0.25),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(107,47,18,0.5),transparent_35%)]" />

          <div className="relative flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 text-xs font-black tracking-[0.48em] text-[#f2a23a]">
                PAŞAZADE BÜFE
              </p>

              <h1 className="text-5xl font-black tracking-tight md:text-7xl">
                {t.menu}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 md:text-base">
                {t.subtitle}
              </p>
            </div>

            <div className="flex h-28 w-52 items-center justify-center overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 backdrop-blur md:h-36 md:w-64">
              <img
                src="/logo.png"
                alt="Paşazade Büfe"
                className="h-full w-full scale-[1.55] object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </header>

        <div className="sticky top-0 z-40 -mx-4 mb-7 border-y border-black/5 bg-[#f6eadb]/80 px-4 py-3 backdrop-blur-2xl">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categoriesTR.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-2xl px-5 py-3 text-sm font-black transition-all duration-300 ${
                  activeCategory === cat
                    ? "scale-105 bg-gradient-to-r from-[#6b2f12] via-[#b85b20] to-[#f2a23a] text-white shadow-xl shadow-orange-900/20"
                    : "border border-black/10 bg-white/70 text-[#2a190f] shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-lg"
                }`}
              >
                {cat === "Tümü" ? t.all : translateCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="group animate-[fadeUp_0.45s_ease_both] overflow-hidden rounded-[2.2rem] border border-white/70 bg-white/75 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <div className="relative h-60 overflow-hidden bg-[#ead2b9]">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={translateProduct(item.name)}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl">
                    🍽️
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />

                <p className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#bd5a19] shadow-md backdrop-blur">
                  {translateCategory(item.category)}
                </p>
              </div>

              <div className="p-5">
                <h2 className="min-h-[64px] text-2xl font-black leading-tight text-[#1b100b]">
                  {translateProduct(item.name)}
                </h2>

                {item.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-black/55">
                    {item.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-3xl font-black text-[#733313]">
                    {item.price || ""}
                  </p>

                  <button className="rounded-full bg-[#1b100b] px-5 py-3 text-xs font-black text-white shadow-lg transition group-hover:bg-gradient-to-r group-hover:from-[#6b2f12] group-hover:to-[#f2a23a]">
                    {t.view}
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="col-span-full rounded-3xl bg-white p-8 text-center text-sm text-black/50 shadow-sm">
              {t.empty}
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </main>
  );
}