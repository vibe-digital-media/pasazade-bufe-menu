export default function Home() {
  const languages = [
    { code: "tr", flag: "🇹🇷", title: "Türkçe", subtitle: "Turkish" },
    { code: "en", flag: "🇬🇧", title: "English", subtitle: "İngilizce" },
    { code: "de", flag: "🇩🇪", title: "Deutsch", subtitle: "Almanca" },
    { code: "ru", flag: "🇷🇺", title: "Русский", subtitle: "Rusça" },
  ];

  return (
    <main
      className="relative min-h-screen overflow-hidden text-[#111] flex items-center justify-center px-5 py-10"
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
          className="mx-auto mb-16 w-[520px] max-w-[92vw] h-auto drop-shadow-xl md:w-[680px]"
        />

        <p className="mb-8 text-xs md:text-sm tracking-[0.45em] text-gray-400 font-semibold">
          DİLİNİZİ SEÇİN
        </p>

        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
          {languages.map((lang) => (
            <a
              key={lang.code}
              href={`/${lang.code}/menu`}
              className="group rounded-[2rem] border border-black/10 bg-white/90 px-5 py-7 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-2xl active:scale-95"
            >
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3eee6] text-3xl shadow-inner transition group-hover:scale-110">
                {lang.flag}
              </div>

              <h2 className="text-lg font-extrabold text-[#171717] md:text-xl">
                {lang.title}
              </h2>

              <p className="mt-1 text-sm font-medium text-gray-400">
                {lang.subtitle}
              </p>
            </a>
          ))}
        </div>
      </div>

      <a
        href="https://wa.me/905XXXXXXXXX"
        target="_blank"
        className="fixed bottom-6 right-6 z-50 flex h-20 w-20 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl transition hover:scale-110 active:scale-95"
        aria-label="WhatsApp"
      >
        <svg
          viewBox="0 0 32 32"
          className="h-10 w-10 fill-current"
          aria-hidden="true"
        >
          <path d="M16.04 3C8.86 3 3.03 8.82 3.03 16c0 2.29.6 4.53 1.74 6.5L3 29l6.66-1.75A12.93 12.93 0 0 0 16.04 29C23.22 29 29 23.18 29 16S23.22 3 16.04 3Zm0 23.78c-2.05 0-4.06-.55-5.82-1.58l-.42-.25-3.95 1.04 1.05-3.85-.27-.44A10.68 10.68 0 0 1 5.25 16c0-5.95 4.84-10.78 10.8-10.78 5.94 0 10.74 4.83 10.74 10.78s-4.8 10.78-10.75 10.78Zm5.9-8.08c-.32-.16-1.9-.94-2.2-1.05-.3-.11-.52-.16-.74.16-.21.32-.85 1.05-1.04 1.27-.19.21-.38.24-.7.08-.32-.16-1.36-.5-2.6-1.6-.96-.86-1.61-1.92-1.8-2.24-.19-.32-.02-.5.14-.66.15-.14.32-.38.48-.57.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.74-1.78-1.01-2.44-.27-.64-.54-.55-.74-.56h-.63c-.21 0-.56.08-.85.4-.29.32-1.12 1.1-1.12 2.68s1.15 3.1 1.31 3.31c.16.21 2.27 3.47 5.5 4.87.77.33 1.37.53 1.84.68.77.24 1.48.21 2.04.13.62-.09 1.9-.78 2.17-1.53.27-.75.27-1.4.19-1.53-.08-.13-.29-.21-.61-.37Z" />
        </svg>
      </a>
    </main>
  );
}