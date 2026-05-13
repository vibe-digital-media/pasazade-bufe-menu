export default function Home() {
  const languages = [
    { code: "tr", flag: "🇹🇷", title: "Türkçe", subtitle: "Turkish" },
    { code: "en", flag: "🇬🇧", title: "English", subtitle: "İngilizce" },
    { code: "de", flag: "🇩🇪", title: "Deutsch", subtitle: "Almanca" },
    { code: "ru", flag: "🇷🇺", title: "Русский", subtitle: "Rusça" },
  ];

  const mapUrl =
    "https://www.google.com/maps/search/?api=1&query=Mimar+Hayrettin+Mahallesi+Beyazıt+Sucu+Baki+Sk.+No:2/1+34126+İstanbul";

  return (
    <main
      className="min-h-screen text-[#111] flex items-center justify-center px-5 py-8"
      style={{
        backgroundColor: "#f8f5ef",
        backgroundImage:
          "radial-gradient(circle at 1px 1px, rgba(0,0,0,0.055) 1px, transparent 0)",
        backgroundSize: "24px 24px",
      }}
    >
      <div className="w-full max-w-6xl text-center">
        <img
          src="/logo.png"
          alt="Paşazade Büfe Logo"
          className="mx-auto mb-10 w-[360px] max-w-[85%] h-auto drop-shadow-md"
        />

        <p className="mb-6 text-sm tracking-[0.45em] text-gray-400 font-semibold">
          DİLİNİZİ SEÇİN
        </p>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {languages.map((lang) => (
            <a
              key={lang.code}
              href={`/${lang.code}/menu`}
              className="group rounded-3xl border border-black/10 bg-white/90 p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f8f5ef] text-2xl">
                {lang.flag}
              </div>
              <h2 className="text-lg font-extrabold">{lang.title}</h2>
              <p className="mt-1 text-sm text-gray-400">{lang.subtitle}</p>
            </a>
          ))}
        </div>

        <section className="mx-auto mt-10 max-w-3xl rounded-3xl border border-black/10 bg-white/90 p-5 text-left shadow-sm">
          <h3 className="text-xl font-extrabold">Paşazade Büfe</h3>

          <p className="mt-2 text-sm leading-relaxed text-black/60">
            Mimar Hayrettin Mah, Beyazıt, Sucu Baki Sk. No:2/1, 34126 İstanbul
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
        </section>

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