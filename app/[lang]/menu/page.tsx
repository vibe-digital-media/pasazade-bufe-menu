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
    subtitle: "Taze, hızlı ve esnaf lezzetinin en iyi hali.",
    all: "Tümü",
    view: "İncele",
    empty: "Bu kategoride ürün yok.",
    home: "Ana Sayfa",
    contact: "İletişim",
  },
  en: {
    menu: "Menu",
    subtitle: "Fresh, fast and the best taste of local street food.",
    all: "All",
    view: "View",
    empty: "No products in this category.",
    home: "Home",
    contact: "Contact",
  },
  de: {
    menu: "Speisekarte",
    subtitle: "Frisch, schnell und der beste Geschmack lokaler Küche.",
    all: "Alle",
    view: "Ansehen",
    empty: "Keine Produkte in dieser Kategorie.",
    home: "Startseite",
    contact: "Kontakt",
  },
  ru: {
    menu: "Меню",
    subtitle: "Свежо, быстро и лучший вкус местной кухни.",
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
    <main className="min-h-screen bg-[#f7efe4] px-4 py-6 text-[#24170f]">
      <div className="fixed right-4 top-4 z-50 flex gap-2">
        <a
          href="/"
          className="rounded-full bg-white/90 px-4 py-2 text-sm font-black text-[#24170f] shadow-lg backdrop-blur transition hover:-translate-y-0.5"
        >
          {t.home}
        </a>

        <a
          href="https://wa.me/902125178513"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gradient-to-r from-[#7a3b16] to-[#e88938] px-4 py-2 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5"
        >
          {t.contact}
        </a>
      </div>

      <div className="mx-auto max-w-6xl">
        <header className="relative mb-7 overflow-hidden rounded-[2.5rem] bg-[#1b130f] p-8 text-white shadow-2xl">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#e88938]/20 blur-3xl" />
          <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-[#7a3b16]/30 blur-3xl" />

          <div className="relative">
            <p className="mb-3 text-xs font-black tracking-[0.45em] text-[#f0a24c]">
              PAŞAZADE BÜFE
            </p>
            <h1 className="text-5xl font-black tracking-tight">{t.menu}</h1>
            <p className="mt-3 max-w-xl text-sm text-white/60">{t.subtitle}</p>
          </div>
        </header>

        <div className="sticky top-0 z-40 -mx-4 mb-7 bg-[#f7efe4]/90 px-4 py-3 backdrop-blur">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categoriesTR.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-black shadow-sm transition-all ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#6b3516] to-[#e88938] text-white shadow-lg"
                    : "border border-black/10 bg-white/80 text-[#24170f] hover:-translate-y-0.5 hover:bg-white"
                }`}
              >
                {cat === "Tümü" ? t.all : translateCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="group animate-[fadeUp_0.45s_ease_both] overflow-hidden rounded-[2rem] border border-black/5 bg-white/85 shadow-md backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <div className="relative h-52 overflow-hidden bg-[#ead8c4]">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={translateProduct(item.name)}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-5xl">
                    🍽️
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent" />

                <p className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#bf5a19] shadow-sm">
                  {translateCategory(item.category)}
                </p>
              </div>

              <div className="p-5">
                <h2 className="text-2xl font-black leading-tight text-[#1b130f]">
                  {translateProduct(item.name)}
                </h2>

                {item.description && (
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-black/55">
                    {item.description}
                  </p>
                )}

                <div className="mt-5 flex items-center justify-between gap-3">
                  <p className="text-3xl font-black text-[#7a3b16]">
                    {item.price || ""}
                  </p>

                  <button className="rounded-full bg-[#1b130f] px-5 py-3 text-xs font-black text-white shadow-md transition group-hover:bg-gradient-to-r group-hover:from-[#7a3b16] group-hover:to-[#e88938]">
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
        </div>
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