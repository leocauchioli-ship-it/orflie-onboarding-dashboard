import { BadgeAlert, Building2, Leaf, Pickaxe } from "lucide-react";

const pains = [
  {
    icon: BadgeAlert,
    title: "Risco estrutural e passivo ambiental",
    body: "Em grandes plantas, vazamento e infiltracao viram problema de operacao, desgaste de ativo e exposicao ambiental.",
  },
  {
    icon: Pickaxe,
    title: "Custo oculto recorrente",
    body: "Sem localizacao precisa, o dinheiro sai pelo ralo por meses enquanto a equipe tenta atacar sintoma em vez da origem.",
  },
  {
    icon: Leaf,
    title: "Pressao por ESG e eficiencia",
    body: "A agua deixou de ser item invisivel. O decisor precisa responder por consumo, desperdicio e melhoria continua.",
  },
  {
    icon: Building2,
    title: "Lead errado, discurso errado",
    body: "Visual de varejo e captura rasa afastam o CNPJ qualificado e deixam o comercial com lead sem fit operacional.",
  },
];

const PainSection = () => {
  return (
    <section className="section-pad" id="dores">
      <div className="container-shell">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-5">
            <span className="eyebrow">Diagnostico B2B</span>
            <h2 className="text-3xl font-extrabold text-white md:text-5xl">
              Vazamento em industria e condominio nao e manutencao domestica. E risco operacional.
            </h2>
            <p className="text-base leading-8 text-slate-300">
              A LP foi desenhada para cortar a leitura de varejo e abrir a conversa certa com facilities, sindicancia
              tecnica, engenharia, sustentabilidade e diretoria.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {pains.map(({ icon: Icon, title, body }) => (
              <article key={title} className="glass-card p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-300/12 text-cyan-200">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PainSection;
