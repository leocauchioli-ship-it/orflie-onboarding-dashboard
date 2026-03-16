const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="container-shell flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.24em] text-white">CANUMA</p>
          <p className="mt-2 text-sm text-slate-400">Gestao e otimizacao do uso da agua para operacoes que nao podem perder previsibilidade.</p>
        </div>
        <div className="text-sm text-slate-500">LP B2B criada no fluxo AIOS para iteracao comercial e validacao de mensagem.</div>
      </div>
    </footer>
  );
};

export default Footer;
