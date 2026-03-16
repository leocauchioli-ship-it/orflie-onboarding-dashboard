const faqs = [
  {
    q: "A CANUMA atende apenas industria?",
    a: "Nao. A operacao atende tambem condominios e outras estruturas com consumo relevante, mas a LP foi desenhada para atrair decisores com problema de escala e impacto real.",
  },
  {
    q: "Precisa quebrar tudo para localizar?",
    a: "Nao. O posicionamento da CANUMA parte justamente de localizacao precisa, reduzindo quebra desnecessaria e acelerando a correcao certa.",
  },
  {
    q: "Essa pagina ja envia para CRM?",
    a: "Ainda nao. Nesta entrega a captura esta pronta em front-end e a recomendacao operacional para GA4/Kentro ja foi incorporada ao fluxo.",
  },
];

const FAQSection = () => {
  return (
    <section className="section-pad">
      <div className="container-shell space-y-8">
        <div className="max-w-3xl space-y-4">
          <span className="eyebrow">FAQ</span>
          <h2 className="text-3xl font-extrabold text-white md:text-5xl">Perguntas que normalmente travam a decisao.</h2>
        </div>

        <div className="grid gap-5">
          {faqs.map((faq) => (
            <article key={faq.q} className="glass-card p-7">
              <h3 className="text-xl font-bold text-white">{faq.q}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-300">{faq.a}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
