const menu = [
  { name: "Köfte", price: "150 TL" },
  { name: "Tavuk Döner", price: "120 TL" },
  { name: "Hamburger", price: "130 TL" },
  { name: "Sosisli", price: "100 TL" },
];

export default function Menu() {
  return (
    <main className="min-h-screen bg-black text-white p-6">
      <h1 className="text-2xl font-bold mb-6">Menü</h1>

      <div className="space-y-4">
        {menu.map((item, i) => (
          <div
            key={i}
            className="flex justify-between border-b border-gray-600 pb-2"
          >
            <span>{item.name}</span>
            <span>{item.price}</span>
          </div>
        ))}
      </div>
    </main>
  );
}