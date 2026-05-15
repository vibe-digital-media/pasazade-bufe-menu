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
    Köfte: "Grilled meatballs served in fresh bread with special sauces.",
    Döner: "Daily prepared doner meat served in warm bread.",
    "Tavuk Döner": "Flavorful chicken doner served with soft bread.",
    Ciğer: "Seasoned liver served as a warm and filling option.",
    "Soya Soslu Tavuk": "Chicken marinated with soy sauce for a rich flavor.",
    "Kaşarlı Tost": "Classic toast with melted Turkish kashar cheese.",
    "Karışık Tost": "A rich toast with sausage, salami and cheese.",
    "Kavurmalı Tost": "Special toast prepared with roasted meat.",
    "Sucuklu Tost": "Hot toast with spicy Turkish sausage.",
    "Salamlı Tost": "Classic toast with salami and cheese.",
    "Kavurma Kaşarlı Tost": "Roasted meat and cheese in a warm crispy toast.",
    "Kavurma Kaşarlı": "A filling option with roasted meat and cheese.",
    "Ton Balıklı": "Prepared with tuna and a fresh special mix.",
    "Arnavut Ciğeri": "Classic Albanian liver prepared with special spices.",
    Hamburger: "A filling hamburger prepared with fresh ingredients.",
    Sosisli: "Classic hot dog with warm sausage and soft bread.",
    "Sosisli (Amerikan salata ile)": "Hot dog served with American salad.",
    Kaşarlı: "Simple and tasty sandwich with melted cheese.",
    Karışık: "A rich sandwich with assorted deli ingredients.",
    Vejetaryen: "A light and tasty option prepared with vegetables.",
    Patso: "A filling sandwich packed with crispy fries.",
    "Dürüm Tavuk Döner": "Chicken doner wrapped in thin lavash bread.",
    "Köfte Dürüm": "Grilled meatballs wrapped in lavash for a filling taste.",
    "Ciğer Dürüm": "Seasoned liver served in warm lavash.",
    "Greyfurt Suyu": "Refreshing grapefruit flavor.",
    "Portakal Suyu": "Fresh and energetic orange flavor.",
    Ayran: "Traditional refreshing yogurt drink.",
    Kola: "Cold and refreshing carbonated drink.",
    Fanta: "Orange flavored carbonated drink.",
    Soda: "Natural sparkling mineral water.",
    Cappy: "Refreshing fruit drink with different flavors.",
    "0,5 Lt Su": "Ideal daily drinking water.",
    "1,5 Lt Su": "Large bottle water option.",
    "Nar Suyu": "Rich and natural pomegranate flavor.",
    Çay: "Traditional Turkish tea for any time of day.",
    Nescafe: "Practical and rich coffee taste.",
    Kapuçino: "Smooth coffee with milk foam.",
    Salep: "A warm traditional winter drink.",
    "Elma Çayı": "Light and aromatic apple tea.",
    Kuşburnu: "Natural rosehip tea rich in flavor.",
  },
  de: {
    Köfte: "Gegrillte Frikadellen im frischen Brot mit speziellen Saucen.",
    Döner: "Täglich zubereitetes Dönerfleisch im warmen Brot.",
    "Tavuk Döner": "Leckerer Hähnchen-Döner mit weichem Brot.",
    Ciğer: "Gewürzte Leber als warme und sättigende Option.",
    "Soya Soslu Tavuk": "Hähnchen mit Sojasauce mariniert, aromatisch und herzhaft.",
    "Kaşarlı Tost": "Klassischer Toast mit geschmolzenem Käse.",
    "Karışık Tost": "Reichhaltiger Toast mit Wurst, Salami und Käse.",
    "Kavurmalı Tost": "Spezialtoast mit geröstetem Fleisch.",
    "Sucuklu Tost": "Warmer Toast mit würziger türkischer Wurst.",
    "Salamlı Tost": "Klassischer Toast mit Salami und Käse.",
    "Kavurma Kaşarlı Tost": "Geröstetes Fleisch und Käse im knusprigen Toast.",
    "Kavurma Kaşarlı": "Sättigende Option mit geröstetem Fleisch und Käse.",
    "Ton Balıklı": "Mit Thunfisch und frischer Spezialmischung zubereitet.",
    "Arnavut Ciğeri": "Klassische albanische Leber mit besonderen Gewürzen.",
    Hamburger: "Sättigender Hamburger mit frischen Zutaten.",
    Sosisli: "Klassischer Hot Dog mit warmer Wurst und weichem Brot.",
    "Sosisli (Amerikan salata ile)": "Hot Dog mit amerikanischem Salat.",
    Kaşarlı: "Einfaches und leckeres Sandwich mit geschmolzenem Käse.",
    Karışık: "Reichhaltiges Sandwich mit verschiedenen Zutaten.",
    Vejetaryen: "Leichte und leckere Option mit Gemüse.",
    Patso: "Sättigendes Sandwich mit knusprigen Pommes.",
    "Dürüm Tavuk Döner": "Hähnchen-Döner in dünnem Lavash-Brot.",
    "Köfte Dürüm": "Gegrillte Frikadellen im Lavash-Wrap.",
    "Ciğer Dürüm": "Gewürzte Leber im warmen Lavash.",
    "Greyfurt Suyu": "Erfrischender Grapefruitgeschmack.",
    "Portakal Suyu": "Frischer und lebendiger Orangengeschmack.",
    Ayran: "Traditionelles erfrischendes Joghurtgetränk.",
    Kola: "Kaltes und erfrischendes kohlensäurehaltiges Getränk.",
    Fanta: "Kohlensäurehaltiges Getränk mit Orangengeschmack.",
    Soda: "Natürliches Mineralwasser mit Kohlensäure.",
    Cappy: "Erfrischendes Fruchtgetränk in verschiedenen Sorten.",
    "0,5 Lt Su": "Ideales Wasser für den täglichen Bedarf.",
    "1,5 Lt Su": "Große Wasserflasche.",
    "Nar Suyu": "Intensiver natürlicher Granatapfelgeschmack.",
    Çay: "Traditioneller türkischer Tee für jede Tageszeit.",
    Nescafe: "Praktischer und kräftiger Kaffeegenuss.",
    Kapuçino: "Milder Kaffee mit Milchschaum.",
    Salep: "Traditionelles warmes Wintergetränk.",
    "Elma Çayı": "Leichter und aromatischer Apfeltee.",
    Kuşburnu: "Natürlicher Hagebuttentee mit vollem Geschmack.",
  },
  ru: {
    Köfte: "Кёфте на гриле в свежем хлебе со специальными соусами.",
    Döner: "Свежий донер, приготовленный ежедневно, в тёплом хлебе.",
    "Tavuk Döner": "Ароматный куриный донер с мягким хлебом.",
    Ciğer: "Пряная печень, тёплый и сытный вариант.",
    "Soya Soslu Tavuk": "Курица, маринованная в соевом соусе, с насыщенным вкусом.",
    "Kaşarlı Tost": "Классический тост с расплавленным сыром.",
    "Karışık Tost": "Сытный тост с колбасой, салями и сыром.",
    "Kavurmalı Tost": "Особый тост с жареным мясом.",
    "Sucuklu Tost": "Горячий тост с пряной турецкой колбасой.",
    "Salamlı Tost": "Классический тост с салями и сыром.",
    "Kavurma Kaşarlı Tost": "Тост с жареным мясом и сыром.",
    "Kavurma Kaşarlı": "Сытный вариант с жареным мясом и сыром.",
    "Ton Balıklı": "Приготовлен с тунцом и свежей специальной смесью.",
    "Arnavut Ciğeri": "Классическая албанская печень со специями.",
    Hamburger: "Сытный гамбургер со свежими ингредиентами.",
    Sosisli: "Классический хот-дог с тёплой сосиской и мягким хлебом.",
    "Sosisli (Amerikan salata ile)": "Хот-дог с американским салатом.",
    Kaşarlı: "Простой и вкусный сэндвич с расплавленным сыром.",
    Karışık: "Сытный сэндвич с разными ингредиентами.",
    Vejetaryen: "Лёгкий и вкусный вариант с овощами.",
    Patso: "Сытный сэндвич с хрустящим картофелем фри.",
    "Dürüm Tavuk Döner": "Куриный донер, завёрнутый в тонкий лаваш.",
    "Köfte Dürüm": "Кёфте на гриле в лаваше.",
    "Ciğer Dürüm": "Пряная печень в тёплом лаваше.",
    "Greyfurt Suyu": "Освежающий вкус грейпфрута.",
    "Portakal Suyu": "Свежий и яркий вкус апельсина.",
    Ayran: "Традиционный освежающий йогуртовый напиток.",
    Kola: "Холодный освежающий газированный напиток.",
    Fanta: "Газированный напиток со вкусом апельсина.",
    Soda: "Натуральная газированная минеральная вода.",
    Cappy: "Освежающий фруктовый напиток с разными вкусами.",
    "0,5 Lt Su": "Вода для ежедневного употребления.",
    "1,5 Lt Su": "Большая бутылка воды.",
    "Nar Suyu": "Насыщенный натуральный вкус граната.",
    Çay: "Традиционный турецкий чай для любого времени дня.",
    Nescafe: "Практичный и насыщенный вкус кофе.",
    Kapuçino: "Мягкий кофе с молочной пенкой.",
    Salep: "Традиционный горячий зимний напиток.",
    "Elma Çayı": "Лёгкий ароматный яблочный чай.",
    Kuşburnu: "Натуральный чай из шиповника с насыщенным вкусом.",
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
            <div className="text-center md:text-left">
              <p className="mb-3 text-xs font-black tracking-[0.48em] text-[#b85b20]">
                PAŞAZADE BÜFE
              </p>

              <h1 className="text-5xl font-black tracking-tight text-[#1b100b] md:text-7xl">
                {t.menu}
              </h1>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-black/55 md:mx-0 md:text-base">
                {t.subtitle}
              </p>
            </div>

            <div className="hidden h-28 w-52 items-center justify-center overflow-hidden md:flex md:h-36 md:w-64">
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

                <p className="mt-2 line-clamp-2 min-h-[44px] text-sm leading-relaxed text-black/55">
                  {translateDescription(item.name, item.description)}
                </p>

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