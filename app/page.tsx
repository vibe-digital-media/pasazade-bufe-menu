export default function Home() {
  const languages = [
    { code: "tr", flag: "🇹🇷", title: "Türkçe", subtitle: "Turkish" },
    { code: "en", flag: "🇬🇧", title: "English", subtitle: "İngilizce" },
    { code: "de", flag: "🇩🇪", title: "Deutsch", subtitle: "Almanca" },
    { code: "ru", flag: "🇷🇺", title: "Русский", subtitle: "Rusça" },
  ];

  return (
    <main className="min-h-screen bg-white text-[#111] flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-3xl text-center">
        
        {/* LOGO */}
        <img
          src="/logo.png"
          alt="Paşazade Büfe Logo"
          className="mx-auto mb-8 w-56 h-auto drop-shadow-md"
        />

        {/* BAŞLIK */}
        <h1 className="text-5xl font-extrabold tracking-tight">
          Paşazade Büfe
        </h1>

        {/* ALT BAŞLIK */}
        <p className="mt-2 text-2xl text-gray-400">
          İstanbul&apos;un lezzeti
        </p>

        {/* SEÇİM YAZISI */}
        <p className="mt-16 mb-8 text-sm tracking-[0.45em] text-gray-400 font-semibold">
          DİLİNİZİ SEÇİN
        </p>

        {/* DİL KARTLARI */}
        <div className="grid grid-cols-2 gap-6">
          {languages.map((lang) => (
            <a
              key={lang.code}
              href={`/${lang.code}/menu`}
              className="rounded-3xl border border-gray-200 bg-[#fafafa] p-10 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-4xl mb-6">{lang.flag}</div>
              <h2 className="text-2xl font-extrabold">{lang.title}</h2>
              <p className="mt-3 text-xl text-gray-400">
                {lang.subtitle}
              </p>
            </a>
          ))}
        </div>

      </div>
    </main>
  );
}