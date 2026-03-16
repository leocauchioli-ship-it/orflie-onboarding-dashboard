import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2, MessageCircleMore } from "lucide-react";

const whatsappHref =
  "https://wa.me/5511999999999?text=Quero%20agendar%20um%20diagnostico%20tecnico%20com%20a%20CANUMA";

const CaptureSection = () => {
  const [qualified, setQualified] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setQualified(true);
  };

  return (
    <section className="section-pad" id="captura">
      <div className="container-shell">
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-5">
            <span className="eyebrow">Captura anti-gap</span>
            <h2 className="text-3xl font-extrabold text-white md:text-5xl">Inicie sua auditoria hidrica com dados minimos, nao com clique perdido.</h2>
            <p className="text-base leading-8 text-slate-300">
              Esta etapa pre-qualifica o lead e cria um caminho logico antes do WhatsApp. O proximo passo de producao
              e ligar esse formulario ao CRM e ao evento de conversao real.
            </p>

            <div className="glass-card p-6">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">Recomendacao operacional</p>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Disparar a conversao de ads na confirmacao de envio ou em pagina intermediaria, nao no clique bruto para
                `wa.me`.
              </p>
            </div>
          </div>

          <div className="glass-card p-8 md:p-10">
            {!qualified ? (
              <form className="grid gap-4" onSubmit={handleSubmit}>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="field" name="nome" placeholder="Nome" required />
                  <input className="field" name="empresa" placeholder="Empresa / Condominio" required />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <input className="field" name="porte" placeholder="Numero de unidades ou colaboradores" required />
                  <input className="field" name="conta" placeholder="Valor medio da conta atual" required />
                </div>
                <input className="field" name="whatsapp" placeholder="WhatsApp para contato" required />
                <textarea
                  className="field min-h-32 resize-none"
                  name="cenario"
                  placeholder="Descreva o tipo de planta, suspeita de vazamento ou dor principal"
                />
                <button className="primary-button mt-2 w-full sm:w-fit" type="submit">
                  Liberar diagnostico inicial
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-300/12 text-emerald-200">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">Captura concluida</p>
                  <h3 className="mt-3 text-3xl font-extrabold text-white">Lead pronto para conversa tecnica.</h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                    Para esta versao da LP, a qualificacao e visual no front-end. Na etapa seguinte, basta integrar
                    essa saida com CRM, automacao e evento real de conversao.
                  </p>
                </div>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <a className="primary-button" href={whatsappHref} rel="noreferrer" target="_blank">
                    Falar com consultor no WhatsApp
                    <MessageCircleMore className="h-4 w-4" />
                  </a>
                  <button className="secondary-button" onClick={() => setQualified(false)} type="button">
                    Editar informacoes
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CaptureSection;
