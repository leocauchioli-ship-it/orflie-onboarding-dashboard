import { ArrowRight, CheckCircle2, Waves } from "lucide-react";

const metrics = [
  "Quase 30 anos de operacao tecnica",
  "Leitura B2B para industria e condominio",
  "Diagnostico antes do WhatsApp",
];

const HeroSection = () => {
  return (
    <section className="section-pad relative" id="top">
      <div className="container-shell">
        <div className="grid items-center gap-8 rounded-[32px] bg-white px-7 py-10 shadow-[0_24px_64px_rgba(3,61,107,0.08)] md:px-10 md:py-14 lg:grid-cols-[1.2fr_0.8fr] lg:px-14">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1872b3]/12 bg-[#1872b3]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#1872b3]">
              <Waves className="h-4 w-4" />
              Gestao e otimizacao do uso da agua
            </span>

            <div className="space-y-4">
              <h1 className="text-4xl font-extrabold leading-tight text-[#1a1a1a] md:text-6xl">
                Nosso foco e <span className="text-[#1872b3]">agua</span>. O seu, previsibilidade operacional.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-[#4a4a4a] md:text-xl">
                Localizamos desperdicios invisiveis, reduzimos perdas e organizamos a conversa tecnica com empresas e
                condominios que precisam de economia real, leitura de risco e menos improviso.
              </p>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row">
              <a className="primary-button" href="#captura">
                Solicitar diagnostico tecnico
                <ArrowRight className="h-4 w-4" />
              </a>
              <a className="secondary-button" href="#autoridade">
                Ver abordagem especialista
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              {metrics.map((metric) => (
                <span
                  key={metric}
                  className="rounded-full border border-[#e5e5e5] bg-[#f7f7f7] px-4 py-2 text-sm font-semibold text-[#4a4a4a]"
                >
                  {metric}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#e5e5e5] bg-[#f7f7f7] p-7 md:p-8">
            <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#1872b3]">Leitura executiva</p>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-[#1a1a1a]">
              Reducao de perdas com linguagem de engenharia.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#4a4a4a]">
              A hero agora resume a proposta em uma leitura simples: agua, economia e decisao tecnica. Sem excesso de
              cards, sem ruído visual.
            </p>

            <div className="mt-7 space-y-3 border-t border-[#e5e5e5] pt-6">
              {[
                "Azul principal e azul escuro puxados do site de referencia.",
                "Neutros claros para deixar a dobra mais respirada.",
                "Acento verde-lima reservado para pontos de apoio, nao para poluir a hero.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm leading-7 text-[#4a4a4a]">
                  <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-[#b0c800]" />
                  {item}
                </div>
              ))}
            </div>

            <div className="mt-7 grid grid-cols-2 gap-4 border-t border-[#e5e5e5] pt-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1872b3]">Impacto citado</p>
                <p className="mt-2 text-2xl font-extrabold text-[#033d6b]">500k {"->"} 60k</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#1872b3]">Metodo</p>
                <p className="mt-2 text-2xl font-extrabold text-[#033d6b]">3 fases</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
