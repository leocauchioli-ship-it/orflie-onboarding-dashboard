const links = [
  { label: "Impacto", href: "#impacto" },
  { label: "Diagnostico", href: "#dores" },
  { label: "Metodo", href: "#processo" },
  { label: "Captura", href: "#captura" },
];

const Navbar = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-slate-950/50 backdrop-blur-2xl">
      <div className="container-shell flex items-center justify-between py-4">
        <a className="flex items-center gap-3" href="#top">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-lg font-extrabold text-cyan-100">
            C
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.28em] text-white">CANUMA</p>
            <p className="text-xs text-slate-400">Gestao e otimizacao do uso da agua</p>
          </div>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              className="text-sm font-semibold text-slate-300 transition hover:text-cyan-200"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <a className="primary-button hidden md:inline-flex" href="#captura">
          Solicitar diagnostico
        </a>
      </div>
    </header>
  );
};

export default Navbar;
