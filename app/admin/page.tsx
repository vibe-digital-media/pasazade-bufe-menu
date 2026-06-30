"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | null;
  category: string | null;
  image_url: string | null;
  is_active: boolean;
};

// ============================================================
// AUTH HOOK
// ============================================================
function useAdminAuth() {
  const [session, setSession] = useState<any>(undefined); // undefined = yükleniyor
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async () => {
    setAuthError("");
    setAuthLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (error) setAuthError("Email veya şifre hatalı.");
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return { session, email, setEmail, password, setPassword, login, logout, authError, authLoading };
}

// ============================================================
// LOGIN EKRANI
// ============================================================
function AdminLogin({ auth }: { auth: ReturnType<typeof useAdminAuth> }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef] p-5">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm">
        <img src="/logo.png" alt="Paşazade Büfe" className="mx-auto mb-6 w-40" />
        <h1 className="mb-5 text-center text-xl font-extrabold">Admin Girişi</h1>

        <input
          type="email"
          placeholder="Email"
          value={auth.email}
          onChange={(e) => auth.setEmail(e.target.value)}
          className="mb-3 w-full rounded-xl border border-black/10 p-3 outline-none"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={auth.password}
          onChange={(e) => auth.setPassword(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && auth.login()}
          className="mb-3 w-full rounded-xl border border-black/10 p-3 outline-none"
        />

        {auth.authError && (
          <p className="mb-3 text-sm font-bold text-red-600">{auth.authError}</p>
        )}

        <button
          onClick={auth.login}
          disabled={auth.authLoading}
          className="w-full rounded-xl bg-black px-7 py-3 font-bold text-white disabled:opacity-50"
        >
          {auth.authLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// ASIL ADMİN PANELİ (sadece giriş yapanlar görür)
// ============================================================
function AdminPanel({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"home" | "add" | "list" | "bulk">("home");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Yarım Ekmek");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [bulkFiles, setBulkFiles] = useState<FileList | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredProducts =
    selectedCategory === "Tümü"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  const getProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Ürün çekme hatası:", error);
      alert("Ürünler çekilemedi.");
      return;
    }

    setProducts(data || []);
  };

  const getUploadedImages = async () => {
    const { data, error } = await supabase.storage.from("products").list("", {
      limit: 200,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      console.log("Fotoğraf listeleme hatası:", error);
      return;
    }

    setUploadedImages(data?.map((file) => file.name) || []);
  };

  useEffect(() => {
    getProducts();
    getUploadedImages();
  }, []);

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .replace(/ı/g, "i")
      .replace(/ğ/g, "g")
      .replace(/ü/g, "u")
      .replace(/ş/g, "s")
      .replace(/ö/g, "o")
      .replace(/ç/g, "c")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  };

  const uploadSingleImage = async () => {
    if (!imageFile) return "";

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error } = await supabase.storage
      .from("products")
      .upload(fileName, imageFile, { upsert: true });

    if (error) {
      console.log("Tekil foto upload hatası:", error);
      alert("Fotoğraf yüklenemedi.");
      return "";
    }

    const { data } = supabase.storage.from("products").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setCategory("Yarım Ekmek");
    setImageFile(null);
    setEditingProduct(null);
  };

  const startEdit = (product: Product) => {
    setEditingProduct(product);
    setName(product.name || "");
    setDescription(product.description || "");
    setPrice(product.price || "");
    setCategory(product.category || "Yarım Ekmek");
    setImageFile(null);
    setActiveTab("add");
  };

  const saveProduct = async () => {
    if (!name || !price) {
      alert("Ürün adı ve fiyat zorunlu.");
      return;
    }

    setLoading(true);

    const uploadedImageUrl = await uploadSingleImage();

    const productData = {
      name,
      description,
      price,
      category,
      image_url: uploadedImageUrl || editingProduct?.image_url || "",
      is_active: editingProduct?.is_active ?? true,
    };

    const { error } = editingProduct
      ? await supabase.from("products").update(productData).eq("id", editingProduct.id)
      : await supabase.from("products").insert(productData);

    setLoading(false);

    if (error) {
      console.log("Ürün kayıt hatası:", error);
      alert(editingProduct ? "Ürün güncellenemedi." : "Ürün eklenemedi.");
      return;
    }

    resetForm();
    await getProducts();
    await getUploadedImages();
    setActiveTab("list");
    alert(editingProduct ? "Ürün güncellendi." : "Ürün eklendi.");
  };

  const handleBulkUpload = async () => {
    if (!bulkFiles) {
      alert("Fotoğraf seçmelisin.");
      return;
    }

    setLoading(true);

    let uploadedCount = 0;
    let matchedCount = 0;
    let errorCount = 0;

    for (const file of Array.from(bulkFiles)) {
      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const rawFileName = file.name.replace(/\.[^/.]+$/, "");
      const cleanFileName = slugify(rawFileName);
      const storageFileName = `${cleanFileName}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("products")
        .upload(storageFileName, file, { upsert: true });

      if (uploadError) {
        console.log("Toplu upload hatası:", uploadError);
        errorCount++;
        continue;
      }

      uploadedCount++;

      const { data } = supabase.storage.from("products").getPublicUrl(storageFileName);
      const imageUrl = data.publicUrl;

      const matchedProduct = products.find((product) => {
        const productSlug = slugify(product.name);
        return (
          productSlug === cleanFileName ||
          productSlug.includes(cleanFileName) ||
          cleanFileName.includes(productSlug)
        );
      });

      if (matchedProduct) {
        const { error: updateError } = await supabase
          .from("products")
          .update({ image_url: imageUrl })
          .eq("id", matchedProduct.id);

        if (!updateError) matchedCount++;
        else console.log("Ürün foto eşleştirme hatası:", updateError);
      }
    }

    setLoading(false);
    setBulkFiles(null);

    await getProducts();
    await getUploadedImages();

    alert(
      `Toplu işlem tamamlandı.\nYüklenen fotoğraf: ${uploadedCount}\nEşleşen ürün: ${matchedCount}\nHata: ${errorCount}`
    );
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Bu ürünü silmek istediğine emin misin?")) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.log(error);
      alert("Ürün silinemedi.");
      return;
    }

    await getProducts();
  };

  const toggleActive = async (product: Product) => {
    const { error } = await supabase
      .from("products")
      .update({ is_active: !product.is_active })
      .eq("id", product.id);

    if (error) {
      console.log(error);
      alert("Durum güncellenemedi.");
      return;
    }

    await getProducts();
  };

  return (
    <main className="min-h-screen bg-[#f8f5ef] p-5 text-[#171717]">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 flex flex-col items-center text-center relative">
          <button
            onClick={onLogout}
            className="absolute right-0 top-0 rounded-full bg-black/80 px-4 py-2 text-xs font-bold text-white"
          >
            Çıkış Yap
          </button>
          <img src="/logo.png" alt="Paşazade Büfe" className="mb-4 w-64" />
          <h1 className="text-3xl font-extrabold">Admin Panel</h1>
          <p className="mt-2 text-sm text-black/50">
            Menü ürünlerini buradan ekleyebilir ve yönetebilirsin.
          </p>
        </header>

        {activeTab === "home" && (
          <section className="grid gap-4 md:grid-cols-4">
            <button onClick={() => { resetForm(); setActiveTab("add"); }} className="rounded-3xl bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-4xl">➕</p>
              <h2 className="mt-4 text-2xl font-extrabold">Ürün Ekle</h2>
              <p className="mt-2 text-sm text-black/50">Yeni ürün, fiyat, kategori ve fotoğraf ekle.</p>
            </button>

            <button onClick={() => setActiveTab("list")} className="rounded-3xl bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-4xl">🍽️</p>
              <h2 className="mt-4 text-2xl font-extrabold">Ürünler</h2>
              <p className="mt-2 text-sm text-black/50">Menüdeki tüm ürünleri görüntüle.</p>
            </button>

            <button onClick={() => setActiveTab("list")} className="rounded-3xl bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-4xl">✏️</p>
              <h2 className="mt-4 text-2xl font-extrabold">Ürünleri Düzenle</h2>
              <p className="mt-2 text-sm text-black/50">Fiyat, kategori, açıklama ve fotoğraf düzenle.</p>
            </button>

            <button onClick={() => setActiveTab("bulk")} className="rounded-3xl bg-white p-8 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <p className="text-4xl">🖼️</p>
              <h2 className="mt-4 text-2xl font-extrabold">Toplu Fotoğraf</h2>
              <p className="mt-2 text-sm text-black/50">Fotoğrafları ürün adlarına göre otomatik eşleştir.</p>
            </button>
          </section>
        )}

        {activeTab !== "home" && (
          <button onClick={() => { resetForm(); setActiveTab("home"); }} className="mb-5 rounded-full bg-black px-5 py-2 text-sm font-bold text-white">
            ← Panele Dön
          </button>
        )}

        {activeTab === "add" && (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-extrabold">
              {editingProduct ? "Ürünü Düzenle" : "Yeni Ürün Ekle"}
            </h2>

            {editingProduct?.image_url && (
              <div className="mb-5 h-40 w-40 overflow-hidden rounded-2xl bg-gray-100">
                <img src={editingProduct.image_url} alt={editingProduct.name} className="h-full w-full object-cover" />
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2">
              <input placeholder="Ürün adı" value={name} onChange={(e) => setName(e.target.value)} className="rounded-xl border border-black/10 p-3 outline-none" />
              <input placeholder="Fiyat" value={price} onChange={(e) => setPrice(e.target.value)} className="rounded-xl border border-black/10 p-3 outline-none" />

              <select value={category} onChange={(e) => setCategory(e.target.value)} className="rounded-xl border border-black/10 p-3 outline-none">
                {categories.filter((cat) => cat !== "Tümü").map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>

              <label className="rounded-xl border border-dashed border-black/20 p-3 text-sm text-black/50">
                {editingProduct ? "Yeni Fotoğraf Yükle" : "Ürün Fotoğrafı"}
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} className="mt-2 block w-full text-sm" />
                <span className="mt-2 block text-xs">Önerilen ölçü: 1200x900 px, 4:3 oran, JPG veya PNG.</span>
              </label>

              <textarea placeholder="Açıklama" value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-28 rounded-xl border border-black/10 p-3 outline-none md:col-span-2" />
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={saveProduct} disabled={loading} className="rounded-xl bg-black px-7 py-3 font-bold text-white disabled:opacity-50">
                {loading ? "Kaydediliyor..." : editingProduct ? "Güncelle" : "Ürün Ekle"}
              </button>

              {editingProduct && (
                <button onClick={resetForm} className="rounded-xl border border-black/10 px-7 py-3 font-bold">
                  Vazgeç
                </button>
              )}
            </div>
          </section>
        )}

        {activeTab === "bulk" && (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-3 text-2xl font-extrabold">Toplu Fotoğraf Yükle</h2>
            <p className="mb-5 text-sm text-black/50">
              Fotoğraf isimleri ürün adlarıyla aynı olmalı. Örnek: <b>kofte.jpg</b>, <b>tavuk-doner.jpg</b>, <b>karisik-tost.jpg</b>
            </p>

            <label className="block rounded-2xl border border-dashed border-black/20 bg-[#f8f5ef] p-6">
              <span className="block text-sm font-bold">Fotoğrafları seç</span>
              <input type="file" accept="image/*" multiple onChange={(e) => setBulkFiles(e.target.files)} className="mt-3 block w-full text-sm" />
              <span className="mt-3 block text-xs text-black/50">Önerilen ölçü: 1200x900 px, 4:3 oran, JPG veya PNG.</span>
            </label>

            <button onClick={handleBulkUpload} disabled={loading} className="mt-5 rounded-xl bg-black px-7 py-3 font-bold text-white disabled:opacity-50">
              {loading ? "Yükleniyor..." : "Toplu Fotoğrafları Yükle"}
            </button>

            <button onClick={getUploadedImages} className="ml-3 mt-5 rounded-xl border border-black/10 px-7 py-3 font-bold">
              Fotoğrafları Yenile
            </button>

            <div className="mt-8">
              <h3 className="mb-4 text-lg font-extrabold">Yüklenen Fotoğraflar</h3>

              {uploadedImages.length === 0 && (
                <p className="text-sm text-black/50">Henüz yüklenen fotoğraf yok.</p>
              )}

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {uploadedImages.map((fileName) => {
                  const { data } = supabase.storage.from("products").getPublicUrl(fileName);

                  return (
                    <div key={fileName} className="rounded-2xl bg-[#f8f5ef] p-3">
                      <img src={data.publicUrl} alt={fileName} className="h-32 w-full rounded-xl object-cover" />
                      <p className="mt-2 truncate text-xs font-bold">{fileName}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {activeTab === "list" && (
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-2xl font-extrabold">Ürünler</h2>

            <div className="mb-5 flex gap-3 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${selectedCategory === cat ? "bg-black text-white" : "border border-black/10 bg-[#f8f5ef] text-black"}`}>
                  {cat}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredProducts.length === 0 && (
                <p className="text-sm text-black/50">Bu kategoride ürün yok.</p>
              )}

              {filteredProducts.map((product) => (
                <div key={product.id} className="flex flex-col gap-4 rounded-2xl border border-black/10 p-4 md:flex-row md:items-center">
                  <div className="h-24 w-24 overflow-hidden rounded-xl bg-gray-100">
                    {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}
                  </div>

                  <div className="flex-1">
                    <p className="text-xs font-bold uppercase text-orange-600">{product.category || "Kategori Yok"}</p>
                    <h3 className="text-lg font-extrabold">{product.name}</h3>
                    <p className="text-sm text-black/50">{product.description || "Açıklama yok"}</p>
                    <p className="mt-1 font-bold">{product.price}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => startEdit(product)} className="rounded-xl bg-black px-4 py-2 text-sm font-bold text-white">
                      Düzenle
                    </button>

                    <button onClick={() => toggleActive(product)} className="rounded-xl border px-4 py-2 text-sm font-bold">
                      {product.is_active ? "Yayında" : "Pasif"}
                    </button>

                    <button onClick={() => deleteProduct(product.id)} className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white">
                      Sil
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

// ============================================================
// DIŞARIYA AÇILAN ASIL COMPONENT
// ============================================================
export default function AdminPage() {
  const auth = useAdminAuth();

  if (auth.session === undefined) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ef]">
        <p className="text-sm text-black/50">Yükleniyor...</p>
      </div>
    );
  }

  if (!auth.session) {
    return <AdminLogin auth={auth} />;
  }

  return <AdminPanel onLogout={auth.logout} />;
}