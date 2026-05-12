export default function Home() {
  const languages = [
    { code: "tr", label: "Türkçe" },
    { code: "en", label: "English" },
    { code: "de", label: "Deutsch" },
    { code: "ru", label: "Русский" },
  ];

  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-8">Paşazade Büfe</h1>

        <div className="flex flex-col gap-4">
          {languages.map((lang) => (
            <a
              key={lang.code}
              href={`/${lang.code}/menu`}
              className="px-6 py-3 border border-white rounded hover:bg-white hover:text-black transition"
            >
              {lang.label}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}