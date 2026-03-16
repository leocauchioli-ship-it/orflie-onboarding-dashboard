const steps = [
  {
    id: "01",
    title: "Diagnostico digital",
    body: "Leitura inicial da conta, comportamento de consumo e contexto da planta para separar sintoma de causa.",
  },
  {
    id: "02",
    title: "Varredura tecnica",
    body: "Equipe em campo com sensores acusticos e termicos para localizar o ponto certo sem destruir a operacao.",
  },
  {
    id: "03",
    title: "Relatorio de correcao",
    body: "Entrega objetiva para manutencao e decisor, com localizacao, prioridade e linha de acao.",
  },
];

const ProcessSection = () => {
  return (
    <section className="section-pad" id="processo">
      <div className="container-shell space-y-10">
        <div className="max-w-3xl space-y-4">
          <span className="eyebrow">Metodo</span>
          <h2 className="text-3xl font-extrabold text-white md:text-5xl">Como a CANUMA transforma suspeita em acao tecnica.</h2>
          <p className="text-base leading-8 text-slate-300">
            O fluxo comercial da LP nao joga o visitante direto para um clique vazio. Primeiro organiza contexto,
            depois leva para a conversa certa.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step) => (
            <article key={step.id} className="glass-card p-8">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Fase {step.id}</p>
              <h3 className="mt-6 text-2xl font-bold text-white">{step.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
