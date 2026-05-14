export default function Home() {
  const languages = [
    { code: "tr", flag: "🇹🇷", title: "Türkçe", subtitle: "Turkish" },
    { code: "en", flag: "🇬🇧", title: "English", subtitle: "İngilizce" },
    { code: "de", flag: "🇩🇪", title: "Deutsch", subtitle: "Almanca" },
    { code: "ru", flag: "🇷🇺", title: "Русский", subtitle: "Rusça" },
  ];

  const address =
    "Mimar Hayrettin Mah, Beyazıt, Sucu Baki Sk. No:2/1, 34126 İstanbul";

  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=Mimar+Hayrettin+Mah+Beyazıt+Sucu+Baki+Sk+No:2/1+34126+İstanbul";

  const mapEmbed =
    "https://www.google.com/maps?q=Mimar%20Hayrettin%20Mah%20Beyaz%C4%B1t%20Sucu%20Baki%20Sk%20No%3A2%2F1%2034126%20%C4%B0stanbul&output=embed";

  return (
    <main
      className="relative min-h-screen overflow-hidden px-5 py-8 text-[#111]"
      style={{
        backgroundColor: "#f8f5ef",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      {/* 🔥 ARKA PLAN FOTOĞRAF */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <img
          src="/bufe.png"
          alt=""
          className="h-full w-full object-cover opacity-[0.4]"
        />

        {/* Beyaz soft katman */}
        <div className="absolute inset-0 bg-white/45" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl flex-col items-center justify-center text-center">
        
        {/* LOGO */}
        <div className="mb-4 h-[210px] w-full max-w-[520px] overflow-hidden">
          <img
            src="/logo.png"
            alt="Paşazade Büfe Logo"
            className="mx-auto h-full w-full scale-[1.85] object-contain drop-shadow-md"
          />
        </div>

        <p className="mb-6 text-sm font-semibold tracking-[0.45em] text-gray-500">
          DİLİNİZİ SEÇİN
        </p>

        {/* DİL SEÇENEKLERİ */}
        <div className="grid w-full grid-cols-2 gap-4 md:grid-cols-4">
          {languages.map((lang) => (
            <a
              key={lang.code}
              href={`/${lang.code}/menu`}
              className="rounded-3xl border border-black/10 bg-white/90 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f5ef] text-2xl">
                {lang.flag}
              </div>
              <h2 className="text-lg font-extrabold">{lang.title}</h2>
              <p className="mt-1 text-sm text-gray-400">{lang.subtitle}</p>
            </a>
          ))}
        </div>

        {/* HARİTA + İLETİŞİM */}
        <section className="mt-10 w-full max-w-4xl overflow-hidden rounded-3xl border border-black/10 bg-white/95 text-left shadow-lg backdrop-blur">
          
          {/* HARİTA ÜSTTE */}
          <div className="h-[300px] w-full border-b border-black/10">
            <iframe
              src={mapEmbed}
              className="h-full w-full"
              loading="lazy"
            />
          </div>

          {/* İLETİŞİM ALTI */}
          <div className="p-5">
            <h3 className="text-xl font-extrabold">Paşazade Büfe</h3>

            <p className="mt-2 text-sm leading-relaxed text-black/60">
              {address}
            </p>

            <p className="mt-1 text-sm font-bold text-black/70">
              Telefon: 0212 517 85 13
            </p>

            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex rounded-full bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-[#222]"
            >
              Yol Tarifi Al
            </a>
          </div>
        </section>

        {/* WHATSAPP */}
        <a
          href="https://wa.me/902125178513"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-[#25D366] text-3xl text-white shadow-xl transition hover:scale-105"
        >
          ☎
        </a>
      </div>
    </main>
  );
}