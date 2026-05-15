"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
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
    all: "Tümü",
    view: "İncele",
    empty: "Bu kategoride ürün yok.",
    home: "Ana Sayfa",
    contact: "İletişim",
    loading: "Menü hazırlanıyor...",
  },
  en: {
    all: "All",
    view: "View",
    empty: "No products in this category.",
    home: "Home",
    contact: "Contact",
    loading: "Preparing menu...",
  },
  de: {
    all: "Alle",
    view: "Ansehen",
    empty: "Keine Produkte in dieser Kategorie.",
    home: "Startseite",
    contact: "Kontakt",
    loading: "Menü wird vorbereitet...",
  },
  ru: {
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
    Ciğer: "Liver",
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
    "Dürüm Tavuk Döner": "Chicken Doner Wrap",
    "Köfte Dürüm": "Meatball Wrap",
    "Ciğer Dürüm": "Liver Wrap",
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
    Ciğer: "Leber",
    "Soya Soslu Tavuk": "Hähnchen mit Sojasauce",
    "Kaşarlı Tost": "Käse Toast",
    "Karışık Tost": "Gemischter Toast",
    "Kavurmalı Tost": "Toast mit Fleisch",
    "Sucuklu Tost": "Toast mit türkischer Wurst",
    "Salamlı Tost": "Salami Toast",
    "Kavurma Kaşarlı Tost": "Fleisch & Käse Toast",
    "Kavurma Kaşarlı": "Fleisch & Käse",
    "Ton Balıklı": "Thunfisch Sandwich",
    "Arnavut Ciğeri": "Albanische Leber",
    Hamburger: "Hamburger",
    Sosisli: "Hot Dog",
    "Sosisli (Amerikan salata ile)": "Hot Dog mit amerikanischem Salat",
    Kaşarlı: "Käse Sandwich",
    Karışık: "Gemischtes Sandwich",
    Vejetaryen: "Vegetarisch",
    Patso: "Pommes Sandwich",
    "Dürüm Tavuk Döner": "Hähnchen Döner Wrap",
    "Köfte Dürüm": "Frikadellen Wrap",
    "Ciğer Dürüm": "Leber Wrap",
    "Greyfurt Suyu": "Grapefruitsaft",
    "Portakal Suyu": "Orangensaft",
    Ayran: "Ayran",
    Kola: "Cola",
    Fanta: "Fanta",
    Soda: "Mineralwasser",
    Cappy: "Fruchtsaft",
    "0,5 Lt Su": "0,5L Wasser",
    "1,5 Lt Su": "1,5L Wasser",
    "Nar Suyu": "Granatapfelsaft",
    Çay: "Tee",
    Nescafe: "Nescafe",
    Kapuçino: "Cappuccino",
    Salep: "Salep",
    "Elma Çayı": "Apfeltee",
    Kuşburnu: "Hagebuttentee",
  },
  ru: {
    Köfte: "Сэндвич с кёфте",
    Döner: "Донер",
    "Tavuk Döner": "Куриный донер",
    Ciğer: "Печень",
    "Soya Soslu Tavuk": "Курица в соевом соусе",
    "Kaşarlı Tost": "Тост с сыром",
    "Karışık Tost": "Смешанный тост",
    "Kavurmalı Tost": "Тост с мясом",
    "Sucuklu Tost": "Тост с колбасой",
    "Salamlı Tost": "Тост с салями",
    "Kavurma Kaşarlı Tost": "Тост с мясом и сыром",
    "Kavurma Kaşarlı": "Мясо с сыром",
    "Ton Balıklı": "Сэндвич с тунцом",
    "Arnavut Ciğeri": "Албанская печень",
    Hamburger: "Гамбургер",
    Sosisli: "Хот-дог",
    "Sosisli (Amerikan salata ile)": "Хот-дог с американским салатом",
    Kaşarlı: "Сэндвич с сыром",
    Karışık: "Смешанный сэндвич",
    Vejetaryen: "Вегетарианский",
    Patso: "Сэндвич с картошкой фри",
    "Dürüm Tavuk Döner": "Ролл с куриным донером",
    "Köfte Dürüm": "Ролл с кёфте",
    "Ciğer Dürüm": "Ролл с печенью",
    "Greyfurt Suyu": "Грейпфрутовый сок",
    "Portakal Suyu": "Апельсиновый сок",
    Ayran: "Айран",
    Kola: "Кола",
    Fanta: "Фанта",
    Soda: "Газированная вода",
    Cappy: "Фруктовый сок",
    "0,5 Lt Su": "Вода 0,5 л",
    "1,5 Lt Su": "Вода 1,5 л",
    "Nar Suyu": "Гранатовый сок",
    Çay: "Чай",
    Nescafe: "Нескафе",
    Kapuçino: "Капучино",
    Salep: "Салеп",
    "Elma Çayı": "Яблочный чай",
    Kuşburnu: "Чай из шиповника",
  },
};

const descriptionTranslate: Record<string, Record<string, string>> = {
  tr: {
    Köfte: "Izgara köfte, taze ekmek ve özel soslarla hazırlanır.",
    Döner: "Günlük hazırlanan döner eti, sıcak ekmek arasında servis edilir.",
    "Tavuk Döner": "Lezzetli tavuk döner, yumuşak ekmekle buluşur.",
    Ciğer: "Baharatlı ciğer, sıcak ve doyurucu bir lezzet sunar.",
    "Soya Soslu Tavuk": "Soya sosuyla marine edilmiş tavuk, yoğun aromalı lezzet.",
    "Kaşarlı Tost": "Eritilmiş kaşar peyniriyle klasik tost keyfi.",
    "Karışık Tost": "Sucuk, salam ve kaşar peyniriyle zengin lezzet.",
    "Kavurmalı Tost": "Kavurma etiyle hazırlanan özel tost.",
    "Sucuklu Tost": "Baharatlı sucukla hazırlanan sıcak tost.",
    "Salamlı Tost": "Salam ve kaşar uyumuyla klasik seçenek.",
    "Kavurma Kaşarlı Tost": "Kavurma ve kaşar peyniriyle güçlü lezzet.",
    "Kavurma Kaşarlı": "Kavurma ve kaşar peyniriyle doyurucu lezzet.",
    "Ton Balıklı": "Taze ton balığı ve özel karışımla hazırlanır.",
    "Arnavut Ciğeri": "Özel baharatlarla hazırlanan klasik ciğer lezzeti.",
    Hamburger: "Taze malzemelerle hazırlanan doyurucu hamburger.",
    Sosisli: "Sıcak sosis ve yumuşak ekmekle klasik lezzet.",
    "Sosisli (Amerikan salata ile)": "Sosisli sandviç, Amerikan salatasıyla servis edilir.",
    Kaşarlı: "Eritilmiş kaşar peyniriyle sade ve lezzetli.",
    Karışık: "Farklı şarküteri ürünleriyle zengin içerik.",
    Vejetaryen: "Sebzelerle hazırlanan hafif ve lezzetli seçenek.",
    Patso: "Patates kızartmasıyla dolu doyurucu sandviç.",
    "Dürüm Tavuk Döner": "Tavuk döner, ince lavaşla sarılarak sunulur.",
    "Köfte Dürüm": "Izgara köfte, lavaş içinde doyurucu bir lezzet sunar.",
    "Ciğer Dürüm": "Baharatlı ciğer, sıcak lavaşla servis edilir.",
    "Greyfurt Suyu": "Ferahlatıcı ve doğal greyfurt aroması.",
    "Portakal Suyu": "Taze ve enerjik portakal lezzeti.",
    Ayran: "Yemeklerin yanında ferahlatıcı geleneksel içecek.",
    Kola: "Soğuk ve ferahlatıcı gazlı içecek.",
    Fanta: "Portakal aromalı gazlı içecek.",
    Soda: "Doğal maden suyu.",
    Cappy: "Farklı meyve aromalarıyla ferah içecek.",
    "0,5 Lt Su": "Günlük tüketim için ideal su.",
    "1,5 Lt Su": "Büyük boy su seçeneği.",
    "Nar Suyu": "Doğal ve yoğun nar aroması.",
    Çay: "Geleneksel Türk çayı, her anın vazgeçilmezi.",
    Nescafe: "Pratik ve yoğun kahve keyfi.",
    Kapuçino: "Süt köpüğüyle yumuşak içimli kahve.",
    Salep: "Kış aylarının vazgeçilmez sıcak içeceği.",
    "Elma Çayı": "Hafif ve aromatik bitki çayı.",
    Kuşburnu: "Vitaminli ve doğal bitki çayı.",
  },
  en: {
    Köfte: "Grilled meatballs in fresh bread.",
    Döner: "Daily doner served in warm bread.",
    "Tavuk Döner": "Chicken doner with soft bread.",
    Ciğer: "Seasoned liver, warm and filling.",
    "Soya Soslu Tavuk": "Soy-marinated chicken with rich flavor.",
    "Kaşarlı Tost": "Classic toast with melted cheese.",
    "Karışık Tost": "Toast with sausage, salami and cheese.",
    "Kavurmalı Tost": "Special toast with roasted meat.",
    "Sucuklu Tost": "Hot toast with Turkish sausage.",
    "Salamlı Tost": "Toast with salami and cheese.",
    "Kavurma Kaşarlı Tost": "Roasted meat and cheese toast.",
    "Kavurma Kaşarlı": "Roasted meat and cheese.",
    "Ton Balıklı": "Tuna sandwich with fresh mix.",
    "Arnavut Ciğeri": "Classic Albanian liver.",
    Hamburger: "Hamburger with fresh ingredients.",
    Sosisli: "Classic hot dog.",
    "Sosisli (Amerikan salata ile)": "Hot dog with American salad.",
    Kaşarlı: "Simple cheese sandwich.",
    Karışık: "Mixed deli sandwich.",
    Vejetaryen: "Light vegetable option.",
    Patso: "Fries sandwich.",
    "Dürüm Tavuk Döner": "Chicken doner wrap.",
    "Köfte Dürüm": "Grilled meatball wrap.",
    "Ciğer Dürüm": "Seasoned liver wrap.",
    "Greyfurt Suyu": "Refreshing grapefruit flavor.",
    "Portakal Suyu": "Fresh orange flavor.",
    Ayran: "Traditional yogurt drink.",
    Kola: "Cold carbonated drink.",
    Fanta: "Orange flavored soda.",
    Soda: "Sparkling mineral water.",
    Cappy: "Refreshing fruit drink.",
    "0,5 Lt Su": "0.5L water.",
    "1,5 Lt Su": "1.5L water.",
    "Nar Suyu": "Pomegranate flavor.",
    Çay: "Traditional Turkish tea.",
    Nescafe: "Rich coffee taste.",
    Kapuçino: "Smooth coffee with milk foam.",
    Salep: "Warm winter drink.",
    "Elma Çayı": "Aromatic apple tea.",
    Kuşburnu: "Natural rosehip tea.",
  },
  de: {
    Köfte: "Gegrillte Frikadellen im Brot.",
    Döner: "Täglicher Döner im warmen Brot.",
    "Tavuk Döner": "Hähnchen-Döner mit weichem Brot.",
    Ciğer: "Gewürzte Leber, warm und sättigend.",
    "Soya Soslu Tavuk": "Hähnchen mit Sojasauce.",
    "Kaşarlı Tost": "Toast mit geschmolzenem Käse.",
    "Karışık Tost": "Toast mit Wurst, Salami und Käse.",
    "Kavurmalı Tost": "Toast mit geröstetem Fleisch.",
    "Sucuklu Tost": "Toast mit türkischer Wurst.",
    "Salamlı Tost": "Toast mit Salami und Käse.",
    "Kavurma Kaşarlı Tost": "Fleisch und Käse Toast.",
    "Kavurma Kaşarlı": "Fleisch und Käse.",
    "Ton Balıklı": "Thunfisch Sandwich.",
    "Arnavut Ciğeri": "Albanische Leber.",
    Hamburger: "Hamburger mit frischen Zutaten.",
    Sosisli: "Klassischer Hot Dog.",
    "Sosisli (Amerikan salata ile)": "Hot Dog mit amerikanischem Salat.",
    Kaşarlı: "Einfaches Käse Sandwich.",
    Karışık: "Gemischtes Sandwich.",
    Vejetaryen: "Leichte Gemüseoption.",
    Patso: "Pommes Sandwich.",
    "Dürüm Tavuk Döner": "Hähnchen Döner Wrap.",
    "Köfte Dürüm": "Frikadellen Wrap.",
    "Ciğer Dürüm": "Leber Wrap.",
    "Greyfurt Suyu": "Erfrischender Grapefruitgeschmack.",
    "Portakal Suyu": "Frischer Orangengeschmack.",
    Ayran: "Traditionelles Joghurtgetränk.",
    Kola: "Kaltes Getränk.",
    Fanta: "Orangenlimonade.",
    Soda: "Mineralwasser.",
    Cappy: "Fruchtgetränk.",
    "0,5 Lt Su": "0,5L Wasser.",
    "1,5 Lt Su": "1,5L Wasser.",
    "Nar Suyu": "Granatapfelgeschmack.",
    Çay: "Türkischer Tee.",
    Nescafe: "Kräftiger Kaffee.",
    Kapuçino: "Kaffee mit Milchschaum.",
    Salep: "Warmes Wintergetränk.",
    "Elma Çayı": "Aromatischer Apfeltee.",
    Kuşburnu: "Hagebuttentee.",
  },
  ru: {
    Köfte: "Кёфте на гриле в свежем хлебе.",
    Döner: "Свежий донер в тёплом хлебе.",
    "Tavuk Döner": "Куриный донер с мягким хлебом.",
    Ciğer: "Пряная печень, тёплая и сытная.",
    "Soya Soslu Tavuk": "Курица в соевом соусе.",
    "Kaşarlı Tost": "Тост с расплавленным сыром.",
    "Karışık Tost": "Тост с колбасой, салями и сыром.",
    "Kavurmalı Tost": "Тост с жареным мясом.",
    "Sucuklu Tost": "Тост с турецкой колбасой.",
    "Salamlı Tost": "Тост с салями и сыром.",
    "Kavurma Kaşarlı Tost": "Тост с мясом и сыром.",
    "Kavurma Kaşarlı": "Мясо с сыром.",
    "Ton Balıklı": "Сэндвич с тунцом.",
    "Arnavut Ciğeri": "Албанская печень.",
    Hamburger: "Гамбургер со свежими ингредиентами.",
    Sosisli: "Классический хот-дог.",
    "Sosisli (Amerikan salata ile)": "Хот-дог с американским салатом.",
    Kaşarlı: "Сэндвич с сыром.",
    Karışık: "Смешанный сэндвич.",
    Vejetaryen: "Лёгкий овощной вариант.",
    Patso: "Сэндвич с картофелем фри.",
    "Dürüm Tavuk Döner": "Ролл с куриным донером.",
    "Köfte Dürüm": "Ролл с кёфте.",
    "Ciğer Dürüm": "Ролл с печенью.",
    "Greyfurt Suyu": "Освежающий грейпфрут.",
    "Portakal Suyu": "Свежий апельсиновый вкус.",
    Ayran: "Традиционный айран.",
    Kola: "Холодный газированный напиток.",
    Fanta: "Апельсиновая газировка.",
    Soda: "Минеральная вода.",
    Cappy: "Фруктовый напиток.",
    "0,5 Lt Su": "Вода 0,5 л.",
    "1,5 Lt Su": "Вода 1,5 л.",
    "Nar Suyu": "Гранатовый вкус.",
    Çay: "Турецкий чай.",
    Nescafe: "Насыщенный кофе.",
    Kapuçino: "Кофе с молочной пенкой.",
    Salep: "Горячий зимний напиток.",
    "Elma Çayı": "Яблочный чай.",
    Kuşburnu: "Чай из шиповника.",
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

  const translateDescription = (name: string, description: string | null) => {
    return descriptionTranslate[lang]?.[name] || description || "";
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
    }, 400);
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
      <main className="flex min-h-screen items-center justify-center bg-[#fbf8f3] px-5">
        <div className="relative flex flex-col items-center">
          <div className="absolute h-32 w-32 animate-spin rounded-full border-4 border-[#ead8c4] border-t-[#b85b20]" />
          <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full bg-white shadow-xl">
            <img
              src="/logo.png"
              alt="Paşazade Büfe"
              className="h-full w-full scale-[1.9] object-contain"
            />
          </div>
          <p className="mt-8 text-xs font-black tracking-[0.22em] text-[#7a3b16]/70">
            {t.loading}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#fbf8f3] px-3 pb-6 pt-[74px] text-[#23150d] md:px-4 md:pt-[92px]">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-black/5 bg-[#fbf8f3]/95 px-3 py-2 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-11 w-28 overflow-hidden md:h-14 md:w-36">
              <img
                src="/logo.png"
                alt="Paşazade Büfe"
                className="h-full w-full scale-[1.75] object-contain"
              />
            </div>
          </Link>

          <a
            href="https://wa.me/902125178513"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-[#1b100b] px-4 py-2 text-xs font-black text-white shadow-md transition hover:bg-[#b85b20] md:px-5 md:py-2.5 md:text-sm"
          >
            {t.contact}
          </a>
        </div>
      </header>

      <div className="mx-auto max-w-6xl">
        <div className="sticky top-[61px] z-40 -mx-3 mb-3 bg-[#fbf8f3]/95 px-3 py-2 backdrop-blur-xl md:top-[75px] md:mb-7 md:py-4">
          <div className="mx-auto flex max-w-6xl gap-2 overflow-x-auto pb-1 md:gap-3">
            {categoriesTR.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-black transition-all duration-300 md:px-5 md:py-3 md:text-sm ${
                  activeCategory === cat
                    ? "bg-[#1b100b] text-white shadow-md"
                    : "border border-black/10 bg-white text-[#2a190f] shadow-sm hover:bg-[#f6eadb]"
                }`}
              >
                {cat === "Tümü" ? t.all : translateCategory(cat)}
              </button>
            ))}
          </div>
        </div>

        <section className="space-y-2 md:space-y-8">
          {filtered.map((item, index) => (
            <article
              key={item.id}
              className="grid grid-cols-[82px_1fr] gap-3 rounded-2xl bg-white p-2 shadow-sm transition hover:shadow-md md:grid-cols-[42%_58%] md:overflow-hidden md:rounded-[2.2rem] md:p-0 md:shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
              style={{ animationDelay: `${index * 25}ms` }}
            >
              <div className="h-20 w-20 overflow-hidden rounded-xl bg-[#ead2b9] md:h-full md:w-full md:rounded-none">
                {item.image_url ? (
                  <img
                    src={item.image_url}
                    alt={translateProduct(item.name)}
                    className="h-full w-full object-cover transition duration-700 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl md:text-6xl">
                    🍽️
                  </div>
                )}
              </div>

              <div className="flex min-w-0 flex-col justify-center py-1 pr-1 md:min-h-[250px] md:p-10">
                <div className="flex items-start justify-between gap-2 md:mb-4 md:gap-5">
                  <div className="min-w-0">
                    <p className="mb-1 text-[9px] font-black uppercase tracking-[0.18em] text-[#b96324] md:mb-3 md:text-[11px] md:tracking-[0.28em]">
                      {translateCategory(item.category)}
                    </p>

                    <h2 className="truncate text-base font-black uppercase leading-tight text-[#1b100b] md:whitespace-normal md:text-4xl">
                      {translateProduct(item.name)}
                    </h2>
                  </div>

                  <p className="shrink-0 text-base font-black text-[#4a403a] md:text-4xl">
                    {item.price || ""}
                  </p>
                </div>

                <p className="mt-1 line-clamp-1 text-xs leading-relaxed text-black/55 md:mt-0 md:line-clamp-none md:max-w-xl md:text-2xl">
                  {translateDescription(item.name, item.description)}
                </p>

                <div className="mt-2 md:mt-7">
                  <Link
                    href={`/${lang}/menu/${item.id}`}
                    className="inline-flex rounded-full bg-[#1b100b] px-3 py-1.5 text-[10px] font-black text-white shadow-md transition hover:bg-[#b96324] md:px-6 md:py-3 md:text-sm"
                  >
                    {t.view}
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-3xl bg-white p-8 text-center text-sm text-black/50 shadow-sm">
              {t.empty}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}