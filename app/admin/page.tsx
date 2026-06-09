export default function AdminDashboardPage() {
  const sections = [
    {
      title: "Site Text",
      description: "Edit the hero heading, descriptions, footer tagline, and other copy shown on the public site.",
      href: "/admin/site-text",
      icon: "✎",
    },
    {
      title: "Menu",
      description: "Add, edit, or remove dishes. Upload multiple photos per dish, set prices, and toggle visibility.",
      href: "/admin/menu",
      icon: "☰",
    },
    {
      title: "Customizable Cakes",
      description: "Manage the design gallery. Upload cake and bento photos, edit design codes, reorder tiles.",
      href: "/admin/customizable",
      icon: "◈",
    },
  ];

  return (
    <div className="px-8 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[#2d1b0e]">Dashboard</h1>
        <p className="mt-1 text-sm text-[#9a7c5c]">Manage your Miele Kitchen site from here.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {sections.map((s) => (
          <a
            key={s.href}
            href={s.href}
            className="group rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 transition hover:shadow-md hover:ring-[#c8873a]/30"
          >
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#fdf3e8] text-xl text-[#c8873a]">
              {s.icon}
            </div>
            <h2 className="mb-1 font-serif text-lg text-[#2d1b0e] group-hover:text-[#c8873a]">{s.title}</h2>
            <p className="text-sm leading-relaxed text-[#7a5c40]">{s.description}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
