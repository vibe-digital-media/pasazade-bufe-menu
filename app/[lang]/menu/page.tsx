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

const ui = {
  tr: {
    menu: "Menü",
    subtitle: "Taze, hızlı ve esnaf lezzetinin en iyi hali.",
    all: "Tümü",
    view: "İncele",
    empty: "Bu kategoride ürün yok.",
  },
  en: {
    menu: "Menu",
    subtitle: "Fresh, fast and the best taste of local street food.",
    all: "All",
    view: "View",
    empty: "No products in this category.",
  },
  de: {
    menu: "Speisekarte",
    subtitle: "Frisch, schnell und der beste Geschmack lokaler Küche.",
    all: "Alle",
    view: "Ansehen",
    empty: "Keine Produkte in dieser Kategorie.",
  },
  ru: {
    menu: "Меню",
    subtitle: "Свежо, быстро и лучший вкус местной кухни.",
    all: "Все",
    view: "Подробнее",
    empty: "В этой категории пока нет товаров.",
  },
};

const categoryTranslate: Record<string, Record<string, string>> = {
  en: {
    "Tümü": "All",
    "Yarım Ekmek": "Half Bread",
    "Pide Arası": "Burger Bread",
    "Sandviçler": "Sandwiches",
    "Tostlar": "Toasts",
    "Dürümler": "Wraps",
    "Soğuk İçecekler": "Cold Drinks",
    "Sıcak İçecekler": "Hot Drinks",
  },
  de: {
    "Tümü": "Alle",
    "Yarım Ekmek": "Halbes Brot",
    "Pide Arası": "Pide-Brot",
    "Sandviçler": "Sandwiches",
    "Tostlar": "Toasts",
    "Dürümler": "Wraps",
    "Soğuk İçecekler": "Kalte Getränke",
    "Sıcak İçecekler": "Heiße Getränke",
  },
  ru: {
    "Tümü": "Все",
    "Yarım Ekmek": "Половина хлеба",
    "Pide Arası": "В лепёшке",
    "Sandviçler": "Сэндвичи",
    "Tostlar": "Тосты",
    "Dürümler": "Роллы",
    "Soğuk İçecekler": "Холодные напитки",
    "Sıcak İçecekler": "Горячие напитки",
  },
};

const productTranslate: Record<string, Record<string, string>> = {
  en: {
    "Köfte": "Meatball Sandwich",
    "Döner": "Doner",
    "Tavuk Döner": "Chicken Doner",
    "Dürüm Tavuk Döner": "Chicken Doner Wrap",
    "Köfte Dürüm": "Meatball Wrap",
    "Ciğer": "Liver",
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
    "Hamburger": "Hamburger",
    "Sosisli": "Hot Dog",
    "Sosisli (Amerikan salata ile)": "Hot Dog with American Salad",
    "Kaşarlı": "Cheese Sandwich",
    "Karışık": "Mixed Sandwich",
    "Vejetaryen": "Vegetarian",
    "Patso": "Fries Sandwich",
    "Greyfurt Suyu": "Grapefruit Juice",
    "Portakal Suyu": "Orange Juice",
    "Ayran": "Ayran",
    "Kola": "Cola",
    "Fanta": "Fanta",
    "Soda": "Sparkling Water",
    "Cappy": "Fruit Juice",
    "0,5 Lt Su": "0.5 L Water",
    "1,5 Lt Su": "1.5 L Water",
    "Nar Suyu": "Pomegranate Juice",
    "Çay": "Tea",
    "Nescafe": "Nescafe",
    "Kapuçino": "Cappuccino",
    "Salep": "Salep",
    "Elma Çayı": "Apple Tea",
    "Kuşburnu": "Rosehip Tea",
  },
  de: {
    "Köfte": "Frikadellen-Sandwich",
    "Döner": "Döner",
    "Tavuk Döner": "Hähnchen-Döner",
    "Dürüm Tavuk Döner": "Hähnchen-Döner Wrap",
    "Köfte Dürüm": "Frikadellen Wrap",
    "Ciğer": "Leber",
    "Ciğer Dürüm": "Leber Wrap",
    "Soya Soslu Tavuk": "Hähnchen mit Sojasauce",
    "Kaşarlı Tost": "Käse-Toast",
    "Karışık Tost": "Gemischter Toast",
    "Kavurmalı Tost": "Toast mit Röstfleisch",
    "Sucuklu Tost": "Toast mit türkischer Wurst",
    "Salamlı Tost": "Salami-Toast",
    "Kavurma Kaşarlı Tost": "Toast mit Röstfleisch & Käse",
    "Kavurma Kaşarlı": "Röstfleisch & Käse",
    "Ton Balıklı": "Thunfisch-Sandwich",
    "Arnavut Ciğeri": "Albanische Leber",
    "Hamburger": "Hamburger",
    "Sosisli": "Hot Dog",
    "Sosisli (Amerikan salata ile)": "Hot Dog mit amerikanischem Salat",
    "Kaşarlı": "Käse-Sandwich",
    "Karışık": "Gemischtes Sandwich",
    "Vejetaryen": "Vegetarisch",
    "Patso": "Pommes-Sandwich",
    "Greyfurt Suyu": "Grapefruitsaft",
    "Portakal Suyu": "Orangensaft",
    "Ayran": "Ayran",
    "Kola": "Cola",
    "Fanta": "Fanta",
    "Soda": "Mineralwasser",
    "Cappy": "Fruchtsaft",
    "0,5 Lt Su": "0,5 L Wasser",
    "1,5 Lt Su": "1,5 L Wasser",
    "Nar Suyu": "Granatapfelsaft",
    "Çay": "Tee",
    "Nescafe": "Nescafe",
    "Kapuçino": "Cappuccino",
    "Salep": "Salep",
    "Elma Çayı": "Apfeltee",
    "Kuşburnu": "Hagebuttentee",
  },
  ru: {
    "Köfte": "Сэндвич с кёфте",
    "Döner": "Донер",
    "Tavuk Döner": "Куриный донер",
    "Dürüm Tavuk Döner": "Ролл с куриным донером",
    "Köfte Dürüm": "Ролл с кёфте",
    "Ciğer": "Печень",
    "Ciğer Dürüm": "Ролл с печенью",
    "Soya Soslu Tavuk": "Курица в соевом соусе",
    "Kaşarlı Tost": "Тост с сыром",
    "Karışık Tost": "Смешанный тост",
    "Kavurmalı Tost": "Тост с жареным мясом",
    "Sucuklu Tost": "Тост с турецкой колбасой",
    "Salamlı Tost": "Тост с салями",
    "Kavurma Kaşarlı Tost": "Тост с мясом и сыром",
    "Kavurma Kaşarlı": "Мясо с сыром",
    "Ton Balıklı": "Сэндвич с тунцом",
    "Arnavut Ciğeri": "Албанская печень",
    "Hamburger": "Гамбургер",
    "Sosisli": "Хот-дог",
    "Sosisli (Amerikan salata ile)": "Хот-дог с американским салатом",
    "Kaşarlı": "Сэндвич с сыром",
    "Karışık": "Смешанный сэндвич",
    "Vejetaryen": "Вегетарианский",
    "Patso": "Сэндвич с картофелем фри",
    "Greyfurt Suyu": "Грейпфрутовый сок",
    "Portakal Suyu": "Апельсиновый сок",
    "Ayran": "Айран",
    "Kola": "Кола",
    "Fanta": "Фанта",
    "Soda": "Газированная вода",
    "Cappy": "Фруктовый сок",
    "0,5 Lt Su": "Вода 0,5 л",
    "1,5 Lt Su": "Вода 1,5 л",
    "Nar Suyu": "Гранатовый сок",
    "Çay": "Чай",
    "Nescafe": "Нескафе",
    "Kapuçino": "Капучино",
    "Salep": "Салеп",
    "Elma Çayı": "Яблочный чай",
    "Kuşburnu": "Чай из шиповника",
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
          <h1 className="text-4xl font-black tracking-tight">{t.menu}</h1>
          <p className="mt-3 max-w-xl text-sm text-white/55">{t.subtitle}</p>
        </header>

        <div className="sticky top-0 z-20 -mx-4 mb-6 bg-[#f8f5ef]/90 px-4 py-3 backdrop-blur">
          <div className="flex gap-3 overflow-x-auto pb-1">
            {categoriesTR.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-extrabold shadow-sm transition ${
                  activeCategory === cat
                    ? "bg-[#151515] text-white"
                    : "border border-black/10 bg-white text-[#171717]"
                }`}
              >
                {cat === "Tümü" ? t.all : translateCategory(cat)}
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
                    alt={translateProduct(item.name)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl">🍽️</span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-center">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-600">
                  {translateCategory(item.category)}
                </p>

                <h2 className="mt-1 text-2xl font-black leading-tight text-[#151515]">
                  {translateProduct(item.name)}
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
                    {t.view}
                  </button>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-3xl bg-white p-8 text-center text-sm text-black/50 shadow-sm">
              {t.empty}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}