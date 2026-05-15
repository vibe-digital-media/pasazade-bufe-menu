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
    loading: "Menü hazırlanıyor...",
  },
  en: {
    menu: "Menu",
    subtitle: "Fresh and fast local street food in Beyazıt.",
    all: "All",
    view: "View",
    empty: "No products in this category.",
    home: "Home",
    contact: "Contact",
    loading: "Preparing menu...",
  },
  de: {
    menu: "Speisekarte",
    subtitle: "Frische und schnelle lokale Küche in Beyazıt.",
    all: "Alle",
    view: "Ansehen",
    empty: "Keine Produkte in dieser Kategorie.",
    home: "Startseite",
    contact: "Kontakt",
    loading: "Menü wird vorbereitet...",
  },
  ru: {
    menu: "Меню",
    subtitle: "Свежая и быстрая местная кухня в Беязыте.",
    all: "Все",
    view: "Подробнее",
    empty: "В этой категории пока нет товаров.",
    home: "Главная",
    contact: "Контакт",
    loading: "Меню загружается...",
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
  de: {
  Köfte: "Frikadellen Sandwich",
  Döner: "Döner",
  "Tavuk Döner": "Hähnchen Döner",
  "Dürüm Tavuk Döner": "Hähnchen Döner Wrap",
  "Köfte Dürüm": "Frikadellen Wrap",
  Ciğer: "Leber",
  "Ciğer Dürüm": "Leber Wrap",
  "Soya Soslu Tavuk": "Hähnchen mit Sojasauce",
  "Kaşarlı Tost": "Käse Toast",
  "Karışık Tost": "Gemischter Toast",
  "Kavurmalı Tost": "Toast mit Fleisch",
  "Sucuklu Tost": "Toast mit türkischer Wurst",
  "Salamlı Tost": "Salami Toast",
  "Kavurma Kaşarlı Tost": "Fleisch & Käse Toast",
  "Ton Balıklı": "Thunfisch Sandwich",
  "Arnavut Ciğeri": "Albanische Leber",
  Hamburger: "Hamburger",
  Sosisli: "Hot Dog",
  Kaşarlı: "Käse Sandwich",
  Karışık: "Gemischtes Sandwich",
  Vejetaryen: "Vegetarisch",
  Patso: "Pommes Sandwich",
  Ayran: "Ayran",
  Kola: "Cola",
  Fanta: "Fanta",
  Soda: "Mineralwasser",
  "0,5 Lt Su": "0,5L Wasser",
  "1,5 Lt Su": "1,5L Wasser",
  Çay: "Tee",
  Nescafe: "Nescafe",
  Kapuçino: "Cappuccino",
  Salep: "Salep",
},

ru: {
  Köfte: "Сэндвич с кёфте",
  Döner: "Донер",
  "Tavuk Döner": "Куриный донер",
  "Dürüm Tavuk Döner": "Ролл с куриным донером",
  "Köfte Dürüm": "Ролл с кёфте",
  Ciğer: "Печень",
  "Ciğer Dürüm": "Ролл с печенью",
  "Soya Soslu Tavuk": "Курица в соевом соусе",
  "Kaşarlı Tost": "Тост с сыром",
  "Karışık Tost": "Смешанный тост",
  "Kavurmalı Tost": "Тост с мясом",
  "Sucuklu Tost": "Тост с колбасой",
  "Salamlı Tost": "Тост с салями",
  "Kavurma Kaşarlı Tost": "Тост с мясом и сыром",
  "Ton Balıklı": "Сэндвич с тунцом",
  "Arnavut Ciğeri": "Албанская печень",
  Hamburger: "Гамбургер",
  Sosisli: "Хот-дог",
  Kaşarlı: "Сэндвич с сыром",
  Karışık: "Смешанный сэндвич",
  Vejetaryen: "Вегетарианский",
  Patso: "Сэндвич с картошкой фри",
  Ayran: "Айран",
  Kola: "Кола",
  Fanta: "Фанта",
  Soda: "Газированная вода",
  "0,5 Lt Su": "Вода 0,5 л",
  "1,5 Lt Su": "Вода 1,5 л",
  Çay: "Чай",
  Nescafe: "Нескафе",
  Kapuçino: "Капучино",
  Salep: "Салеп",
},
};

export default function MenuPage() {
  const params = useParams();
  const currentLang = params.lang as string;

  const lang = ["tr", "en", "de", "ru"].includes(currentLang)
    ? currentLang
    : "tr";

  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState("Tümü");
  const [loading, setLoading] = useState(true);

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
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true);

    if (error) {
      console.log(error);
      setLoading(false);
      return;
    }

    setProducts(data || []);

    setTimeout(() => {
      setLoading(false);
    }, 600);
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

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6eadb] px-5">
        <div className="relative flex flex-col items-center">
          <div className="absolute h-44 w-44 animate-spin rounded-full border-4 border-[#ead8c4] border-t-[#b85b20]" />

          <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full bg-white shadow-2xl">
            <img
              src="/logo.png"
              alt="Paşazade Büfe"
              className="h-full w-full scale-[1.9] object-contain"
            />
          </div>

          <p className="mt-10 text-sm font-black tracking-[0.25em] text-[#7a3b16]/70">
            {t.loading}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6eadb] px-4 py-5 text-[#23150d]">
      <div className="fixed right-4 top-4 z-50 flex gap-2">
        <a
          href="/"
          className="rounded-full border border-black/10 bg-white/90 px-4 py-2 text-xs font-black shadow-lg backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-white"
        >
          {t.home}
        </a>

        <a
          href="https://wa.me/902125178513"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-gradient-to-r from-[#6b2f12] via-[#b85b20] to-[#f2a23a] px-4 py-2 text-xs font-black text-white shadow-lg transition hover:-translate-y-0.5"
        >
          {t.contact}
        </a>
      </div>

      <div className="mx-auto max-w-7xl">
        <header className="mb-7 rounded-[2.5rem] border border-black/10 bg-white/70 p-6 shadow-xl backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="mb-3 text-xs font-black tracking-[0.48em] text-[#b85b20]">
                PAŞAZADE BÜFE
              </p>

              <h1 className="text-5xl font-black tracking-tight text-[#1b100b] md:text-7xl">
                {t.menu}
              </h1>

              <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/55 md:text-base">
                {t.subtitle}
              </p>
            </div>

            <div className="flex h-28 w-52 items-center justify-center overflow-hidden md:h-36 md:w-64">
              <img
                src="/logo.png"
                alt="Paşazade Büfe"
                className="h-full w-full scale-[1.65] object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </header>

        <div className="sticky top-0 z-40 -mx-4 mb-7 bg-[#f6eadb]/85 px-4 py-4 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto pb-1">
            {categoriesTR.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-5 py-3 text-sm font-black transition-all duration-300 ${
                  activeCategory === cat
                    ? "scale-105 bg-gradient-to-r from-[#6b2f12] via-[#b85b20] to-[#f2a23a] text-white shadow-xl"
                    : "border border-black/10 bg-white/80 text-[#2a190f] shadow-sm hover:-translate-y-0.5 hover:bg-white hover:shadow-md"
                }`}
              >
                {cat === "Tümü" ? t.all : translateCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="group animate-[fadeUp_0.45s_ease_both] overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-lg backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <div className="relative h-56 overflow-hidden bg-[#ead2b9]">
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

                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />

                <p className="absolute left-4 top-4 rounded-full bg-white/90 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#bd5a19] shadow-md backdrop-blur">
                  {translateCategory(item.category)}
                </p>
              </div>

              <div className="p-5">
                <h2 className="min-h-[60px] text-2xl font-black leading-tight text-[#1b100b]">
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