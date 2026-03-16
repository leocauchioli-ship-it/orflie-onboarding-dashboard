import { Mic, ShieldCheck, Video } from "lucide-react";

const points = [
  "A voz do especialista como ativo central de autoridade da marca.",
  "Narrativa de gestao de recursos em vez de discurso de desespero residencial.",
  "Espaco pronto para receber video institucional, palestra ou case tecnico.",
];

const AuthoritySection = () => {
  return (
    <section className="section-pad" id="autoridade">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="glass-card overflow-hidden p-8 md:p-10">
            <div className="flex items-center gap-3 text-cyan-200">
              <Video className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-[0.22em]">Voz do especialista</span>
            </div>
            <h2 className="mt-5 text-3xl font-extrabold text-white md:text-5xl">
              "Voce nao precisa de um encanador. Precisa de um gestor de recursos."
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
              Esta secao funciona como placeholder premium para o video do Mario em operacao, reuniao tecnica ou
              palestra. O objetivo aqui e converter autoridade acumulada em confianca comercial.
            </p>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-slate-950/60 p-6">
              <div className="flex aspect-video items-center justify-center rounded-[22px] border border-dashed border-cyan-200/30 bg-gradient-to-br from-cyan-300/15 to-emerald-300/10 text-center">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.25em] text-cyan-100">Area de video hero</p>
                  <p className="mt-3 text-sm leading-7 text-slate-300">
                    Inserir video institucional ou demonstracao tecnica da CANUMA.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { icon: Mic, title: "Autoridade convertida em copy", body: points[0] },
              { icon: ShieldCheck, title: "Confianca para ticket maior", body: points[1] },
              { icon: Video, title: "Ativo pronto para midia paga", body: points[2] },
            ].map(({ icon: Icon, title, body }) => (
              <article key={title} className="glass-card p-7">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-200">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-300">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthoritySection;
