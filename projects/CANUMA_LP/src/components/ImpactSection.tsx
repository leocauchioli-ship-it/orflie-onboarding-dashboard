const stats = [
  { value: "500k -> 60k", label: "Exemplo de impacto financeiro citado na operacao comercial" },
  { value: "ISO 14001", label: "Argumento de compliance e sustentabilidade para contas corporativas" },
  { value: "2 perfis", label: "Mensagem central preparada para decisor B2B sem perder leitura tecnica" },
];

const ImpactSection = () => {
  return (
    <section className="section-pad" id="impacto">
      <div className="container-shell space-y-10">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl space-y-4">
            <span className="eyebrow">Prova de impacto</span>
            <h2 className="text-3xl font-extrabold text-white md:text-5xl">
              A conversa nao comeca em encanamento. Comeca em prejuizo evitavel.
            </h2>
          </div>
          <p className="max-w-xl text-base leading-8 text-slate-300">
            A nova LP reposiciona a CANUMA para falar com empresas que precisam de previsibilidade, dado e argumento
            tecnico para sustentar decisao.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {stats.map((stat) => (
            <article key={stat.value} className="glass-card p-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Indicador</p>
              <p className="mt-6 text-4xl font-extrabold text-white">{stat.value}</p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{stat.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;
