'use client'
import { useState, useEffect } from 'react'

interface OnboardingData {
  receivedAt: string
  companyName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  companySegment: string
  payload: Record<string, unknown>
}

// Dados mock para desenvolvimento
const MOCK_DATA: OnboardingData[] = [
  {
    receivedAt: '2026-03-13T10:30:00Z',
    companyName: 'TechSell Solutions',
    contactName: 'Ricardo Silva',
    contactEmail: 'ricardo@techsell.com.br',
    contactPhone: '(11) 99999-0001',
    companySegment: 'SaaS B2B',
    payload: {
      sections: {
        'Dados da Empresa': {
          'CNPJ': '12.345.678/0001-90',
          'Site': 'https://techsell.com.br',
          'Tempo de Mercado': '8 anos',
          'Nº de Colaboradores': 45,
          'Cidade / Estado': 'São Paulo / SP',
          'Faturamento Médio Anual': 'R$ 5M - R$ 10M'
        },
        'Posicionamento de Mercado': {
          'Posição no Mercado': 'Produto Premium',
          'Principal diferencial competitivo': 'Tecnologia proprietária e suporte 24/7',
          'Como a empresa quer ser percebida': 'Parceiro estratégico de confiança',
          'Missão ou propósito declarado': 'Simplificar a venda B2B com inteligência'
        },
        'Cliente Ideal': {
          'Segmento-alvo': 'PMEs com 50-500 funcionários',
          'Porte da empresa cliente': 'Médio',
          'Faixa de faturamento do cliente ideal': 'R$ 5M - R$ 50M/ano',
          'Região de atuação': 'Sudeste, fokus em SP e RJ',
          'Quem toma a decisão de compra': ['Dono / Sócio', 'CEO / Diretor', 'Gerente Comercial'],
          'Principal gatilho': 'Crescimento acelerado que sobrecarrega a equipe de vendas'
        },
        'Dores do Cliente': {
          'Principais dores do cliente': [
            'Alto custo de aquisição de clientes',
            'Processo de venda manual e demorado',
            'Falta de visibilidade do pipeline'
          ],
          'Impacto financeiro/operacional': 'Perda de R$ 100k/mês em oportunidades não convertidas',
          'Como resolve hoje': 'Planilhas Excel e WhatsApp'
        },
        'Processo de Vendas': {
          'CRM': 'Parcialmente',
          'Qual CRM': 'HubSpot (mas mal utilizado)',
          'Canais de comunicação': ['WhatsApp', 'E-mail', 'LinkedIn'],
          'Como os leads chegam': ['Indicação', 'Marketing digital', 'Prospecção ativa']
        },
        'Equipe de Vendas': {
          'Total de vendedores': 8,
          'Estrutura da equipe': ['SDR', 'Closer', 'Executivo de Contas'],
          'Metas comerciais': 'Meta mensal de R$ 180k, 12 novos clientes/mês',
          'O time tem treinamento de vendas': 'Às vezes'
        },
        'Métricas': {
          'Ticket Médio': 'R$ 15.000',
          'Ciclo Médio de Vendas': '45 dias',
          'Taxa de Conversão Média': '12%',
          'Reuniões / mês': 35,
          'Novos clientes / mês': 6,
          'Churn mensal': '5%',
          'Métrica mais crítica': 'Taxa de conversão'
        },
        'Concorrência': {
          'Principais concorrentes': ['Salesforce', 'RD Station', 'Pipedrive'],
          'O que concorrentes fazem melhor': 'Marca consolidada e preço baixo',
          'O que a empresa faz melhor': 'Atendimento personalizado e implementação rápida'
        },
        'Objetivos': {
          'O que empresa espera alcançar': ['Aumentar geração de leads', 'Melhorar conversão', 'Estruturar processo comercial'],
          'Meta de faturamento desejada': 'R$ 800k/mês em 6 meses',
          'Prazo esperado': '3-6 meses'
        },
        'Marketing': {
          'Investe em marketing': 'Sim',
          'Canais ativos': ['Google Ads', 'LinkedIn Ads', 'Conteúdo / Blog'],
          'Investimento mensal em mídia': 'R$ 5.000 - R$ 10.000',
          'Agência de marketing': 'Gerenciamento interno'
        },
        'Materiais': {
          'A empresa já possui': ['Apresentação institucional', 'Proposta comercial padrão', 'Scripts de prospecção'],
          'Material precisa criar': 'Cases de sucesso e calculadora de ROI'
        },
        'Projeto & Equipe': {
          'Responsável interno': 'Ana Paula Santos',
          'Cargo': 'Gerente Comercial',
          'Acessos necessários': ['CRM', 'E-mail corporativo', 'Base de leads'],
          'O que time precisa saber': 'Temos sazonalidade no segundo semestre'
        }
      }
    }
  },
  {
    receivedAt: '2026-03-12T14:20:00Z',
    companyName: 'InOut Digital',
    contactName: 'Marcos Pereira',
    contactEmail: 'marcos@inoutdigital.com.br',
    contactPhone: '(21) 98888-1234',
    companySegment: 'Marketing Digital',
    payload: {
      sections: {
        'Dados da Empresa': {
          'CNPJ': '98.765.432/0001-10',
          'Site': 'https://inoutdigital.com.br',
          'Tempo de Mercado': '5 anos',
          'Nº de Colaboradores': 28,
          'Cidade / Estado': 'Rio de Janeiro / RJ',
          'Faturamento Médio Anual': 'R$ 2M - R$ 5M'
        },
        'Posicionamento de Mercado': {
          'Posição no Mercado': 'Especializado / Nicho',
          'Principal diferencial competitivo': 'Especialistas em e-commerce B2B',
          'Como a empresa quer ser percebida': 'Autoridade em marketing para e-commerce'
        },
        'Cliente Ideal': {
          'Segmento-alvo': 'E-commerces B2B',
          'Porte da empresa cliente': 'Pequeno a Médio',
          'Quem toma a decisão de compra': ['Dono / Sócio', 'Marketing']
        },
        'Processo de Vendas': {
          'CRM': 'Sim',
          'Qual CRM': 'RD Station',
          'Como os leads chegam': ['Inbound / SEO', 'Indicação']
        },
        'Equipe de Vendas': {
          'Total de vendedores': 4,
          'Estrutura da equipe': ['Executivo de Contas']
        },
        'Métricas': {
          'Ticket Médio': 'R$ 8.000',
          'Ciclo Médio de Vendas': '30 dias'
        },
        'Objetivos': {
          'O que empresa espera alcançar': ['Escalar receita', 'Entrar em novos mercados']
        }
      }
    }
  },
  {
    receivedAt: '2026-03-11T09:15:00Z',
    companyName: 'Construtec Engenharia',
    contactName: 'Fernanda Oliveira',
    contactEmail: 'fernanda@construtec.com.br',
    contactPhone: '(31) 99999-5555',
    companySegment: 'Construção Civil',
    payload: {
      sections: {
        'Dados da Empresa': {
          'Tempo de Mercado': '15 anos',
          'Nº de Colaboradores': 120,
          'Cidade / Estado': 'Belo Horizonte / MG',
          'Faturamento Médio Anual': 'R$ 50M+'
        },
        'Posicionamento de Mercado': {
          'Posição no Mercado': 'Produto Premium',
          'Principal diferencial competitivo': 'Certificações e compliance'
        },
        'Cliente Ideal': {
          'Segmento-alvo': 'Grandes empresas e governo',
          'Porte da empresa cliente': 'Grande'
        },
        'Equipe de Vendas': {
          'Total de vendedores': 6
        }
      }
    }
  }
]

export default function Dashboard() {
  const [data, setData] = useState<OnboardingData[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<OnboardingData | null>(null)
  const [search, setSearch] = useState('')

  useEffect(() => { 
    if (typeof window !== 'undefined') {
      fetchData() 
    }
  }, [])

  async function fetchData() {
    try {
      console.log('Iniciando busca de dados...')
      const res = await fetch('/api/sheets')
      if (!res.ok) {
        const errorText = await res.text()
        console.error('Erro na resposta da API:', errorText)
        throw new Error(`API error: ${res.status}`)
      }
      const json = await res.json()
      console.log('Dados recebidos com sucesso:', json.length, 'itens')
      setData(json)
    } catch (e) {
      console.error('Falha ao buscar dados do Sheets, usando mock...', e)
      setData(MOCK_DATA)
    }
    finally { setLoading(false) }
  }

  const filtered = data.filter(d =>
    d.companyName.toLowerCase().includes(search.toLowerCase()) ||
    d.contactName.toLowerCase().includes(search.toLowerCase())
  )

  function exportPDF() {
    if (!selected) return
    const content = generatePDFContent(selected)
    const opt = { margin: 10, filename: `${selected.companyName || 'onboarding'}.pdf` }
    // @ts-ignore
    if (typeof window !== 'undefined' && window.html2pdf) {
      // @ts-ignore
      const element = document.createElement('div')
      element.innerHTML = content
      // @ts-ignore
      window.html2pdf().set(opt).from(element).save()
    }
  }

  function generatePDFContent(d: OnboardingData): string {
    const p = d.payload
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h1 style="border-bottom: 2px solid #000; padding-bottom: 10px;">${d.companyName || 'Empresa'}</h1>
        <p><strong>Data:</strong> ${d.receivedAt}</p>
        <p><strong>Segmento:</strong> ${d.companySegment}</p>

        <h2>Dados do Contato</h2>
        <p><strong>Nome:</strong> ${d.contactName}</p>
        <p><strong>E-mail:</strong> ${d.contactEmail}</p>
        <p><strong>Telefone:</strong> ${d.contactPhone}</p>

        <h2>Dados da Empresa</h2>
        <p><strong>CNPJ:</strong> ${p.cnpj || '-'}</p>
        <p><strong>Site:</strong> ${p.site || '-'}</p>
        <p><strong>Tempo de Mercado:</strong> ${p.tempo_mercado || '-'}</p>
        <p><strong>Colaboradores:</strong> ${p.colaboradores || '-'}</p>
        <p><strong>Cidade/Estado:</strong> ${p.cidade_estado || '-'}</p>
        <p><strong>Faturamento:</strong> ${p.faturamento || '-'}</p>

        <h2>Posicionamento</h2>
        <p><strong>Posição no Mercado:</strong> ${p.posicionamento || '-'}</p>
        <p><strong>Diferencial:</strong> ${p.diferencial || '-'}</p>
        <p><strong>Percepção desejada:</strong> ${p.percepcao || '-'}</p>
        <p><strong>Missão:</strong> ${p.missao || '-'}</p>

        <h2>Cliente Ideal</h2>
        <p><strong>Segmento Alvo:</strong> ${p.segmento_alvo || '-'}</p>
        <p><strong>Porte:</strong> ${p.porte_cliente || '-'}</p>
        <p><strong>Faturamento:</strong> ${p.faturamento_cliente || '-'}</p>
        <p><strong>Região:</strong> ${p.regiao || '-'}</p>
        <p><strong>Decisores:</strong> ${Array.isArray(p.decisores) ? p.decisores.join(', ') : p.decisores || '-'}</p>
        <p><strong>Gatilhos:</strong> ${p.gatilhos || '-'}</p>

        <h2>Dores do Cliente</h2>
        <p><strong>Dores:</strong> ${Array.isArray(p.dores) ? p.dores.join(', ') : p.dores || '-'}</p>
        <p><strong>Impacto:</strong> ${p.impacto_dores || '-'}</p>

        <h2>Processo Atual</h2>
        <p><strong>CRM:</strong> ${p.crm || '-'}</p>
        <p><strong>Qual CRM:</strong> ${p.qual_crm || '-'}</p>
        <p><strong>Canais:</strong> ${Array.isArray(p.canais) ? p.canais.join(', ') : p.canais || '-'}</p>
        <p><strong>Como chegam:</strong> ${Array.isArray(p.como_chegam) ? p.como_chegam.join(', ') : p.como_chegam || '-'}</p>

        <h2>Equipe de Vendas</h2>
        <p><strong>Nr. Vendedores:</strong> ${p.nr_vendedores || '-'}</p>
        <p><strong>Estrutura:</strong> ${Array.isArray(p.estrutura) ? p.estrutura.join(', ') : p.estrutura || '-'}</p>
        <p><strong>Metas:</strong> ${p.metas || '-'}</p>
        <p><strong>Treinamento:</strong> ${p.treinamento || '-'}</p>

        <h2>Métricas</h2>
        <p><strong>Ticket Médio:</strong> ${p.ticket_medio || '-'}</p>
        <p><strong>Ciclo de Vendas:</strong> ${p.ciclo_vendas || '-'}</p>
        <p><strong>Taxa Conversão:</strong> ${p.taxa_conversao || '-'}</p>
        <p><strong>Reuniões/mês:</strong> ${p.reunioes_mes || '-'}</p>
        <p><strong>Novos Clientes/mês:</strong> ${p.novos_clientes || '-'}</p>
        <p><strong>Churn:</strong> ${p.churn || '-'}</p>
        <p><strong>Métrica Crítica:</strong> ${p.metrica_critica || '-'}</p>

        <h2>Concorrentes</h2>
        <p><strong>Lista:</strong> ${Array.isArray(p.concorrentes) ? p.concorrentes.join(', ') : p.concorrentes || '-'}</p>
        <p><strong>O que fazem melhor:</strong> ${p.conc_melhor || '-'}</p>
        <p><strong>O que fazemos melhor:</strong> ${p.nos_melhor || '-'}</p>
        <p><strong>Por que perdem:</strong> ${p.por_que_perdem || '-'}</p>

        <h2>Objetivos</h2>
        <p><strong>O que esperar:</strong> ${Array.isArray(p.objetivos) ? p.objetivos.join(', ') : p.objetivos || '-'}</p>
        <p><strong>Meta:</strong> ${p.meta_faturamento || '-'}</p>
        <p><strong>Prazo:</strong> ${p.prazo || '-'}</p>
        <p><strong>Sucesso medido:</strong> ${p.sucesso_medido || '-'}</p>

        <h2>Marketing</h2>
        <p><strong>Investe em MKT:</strong> ${p.investe_mkt || '-'}</p>
        <p><strong>Canais Ativos:</strong> ${Array.isArray(p.canais_mkt) ? p.canais_mkt.join(', ') : p.canais_mkt || '-'}</p>
        <p><strong>Investimento:</strong> ${p.investimento_midia || '-'}</p>
        <p><strong>Agência:</strong> ${p.agencia || '-'}</p>

        <h2>Materiais</h2>
        <p><strong>Possui:</strong> ${Array.isArray(p.materiais) ? p.materiais.join(', ') : p.materiais || '-'}</p>
        <p><strong>Precisa criar:</strong> ${p.materiais_criar || '-'}</p>

        <h2>Projeto</h2>
        <p><strong>Responsável:</strong> ${p.responsavel_projeto || '-'}</p>
        <p><strong>Cargo:</strong> ${p.cargo_responsavel || '-'}</p>
        <p><strong>Aprovador:</strong> ${p.aprovador || '-'}</p>
        <p><strong>Outros:</strong> ${p.outros_envolvidos || '-'}</p>
        <p><strong>Acessos necessários:</strong> ${Array.isArray(p.acessos) ? p.acessos.join(', ') : p.acessos || '-'}</p>
        <p><strong>Restrições:</strong> ${p.restricoes || '-'}</p>

        <h2>Contexto</h2>
        <p><strong>Conhecer antes:</strong> ${p.conhecer_antes || '-'}</p>
        <p><strong>Frustrações anteriores:</strong> ${p.frustracoes || '-'}</p>
        <p><strong>Sucesso absoluto:</strong> ${p.sucesso_absoluto || '-'}</p>
      </div>
    `
  }

  if (loading) return <div className="container"><div className="loading">Carregando dados...</div></div>

  return (
    <div className="container">
      <header>
        <div className="logo">Orflie <span>Onboarding</span></div>
        <input className="search-input" placeholder="Buscar empresa ou contato..." value={search} onChange={e => setSearch(e.target.value)} />
      </header>

      {filtered.length === 0 ? (
        <div className="empty">Nenhum onboarding encontrado</div>
      ) : selected ? (
        <div>
          <div className="actions" style={{ marginBottom: 20 }}>
            <button className="btn" onClick={() => setSelected(null)}>← Voltar à lista</button>
            <button className="btn btn-secondary" onClick={exportPDF}>📄 Exportar PDF</button>
          </div>
          <DetailView data={selected} />
        </div>
      ) : (
        <div className="grid">
          {filtered.map((item, i) => (
            <div key={i} className="card company-card" onClick={() => setSelected(item)}>
              <div className="company-header">
                <div>
                  <div className="company-name">{item.companyName || 'Sem nome'}</div>
                  <div className="company-segment">{item.companySegment}</div>
                </div>
              </div>
              <div className="company-date">{new Date(item.receivedAt).toLocaleDateString('pt-BR')}</div>
              <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.875rem' }}>
                {item.contactName} • {item.contactEmail}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function DetailView({ data }: { data: OnboardingData }) {
  const p = flattenPayload(data.payload)

  return (
    <div className="card">
      <h1 style={{ marginBottom: 5 }}>{data.companyName}</h1>
      <p style={{ color: 'var(--muted)', marginBottom: 30 }}>Recebido em {new Date(data.receivedAt).toLocaleString('pt-BR')}</p>

      <div className="detail-section">
        <h3>Dados do Contato</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Nome</span><span className="detail-value">{data.contactName}</span></div>
          <div className="detail-item"><span className="detail-label">E-mail</span><span className="detail-value">{data.contactEmail}</span></div>
          <div className="detail-item"><span className="detail-label">Telefone</span><span className="detail-value">{data.contactPhone}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Dados da Empresa</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">CNPJ</span><span className="detail-value">{p.cnpj || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Site</span><span className="detail-value">{p.site || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Tempo de Mercado</span><span className="detail-value">{p.tempo_mercado || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Colaboradores</span><span className="detail-value">{p.colaboradores || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Cidade/Estado</span><span className="detail-value">{p.cidade_estado || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Faturamento</span><span className="detail-value">{p.faturamento || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Posicionamento</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Posição no Mercado</span><span className="detail-value">{p.posicionamento || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Diferencial</span><span className="detail-value">{p.diferencial || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Percepção Desejada</span><span className="detail-value">{p.percepcao || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Missão</span><span className="detail-value">{p.missao || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Palavras que NÃO representam</span><span className="detail-value">{p.palavras_nao || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Cliente Ideal</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Segmento Alvo</span><span className="detail-value">{p.segmento_alvo || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Porte do Cliente</span><span className="detail-value">{p.porte_cliente || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Faturamento</span><span className="detail-value">{p.faturamento_cliente || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Região</span><span className="detail-value">{p.regiao || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Decisores</span><span className="detail-value">{formatArray(p.decisores)}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Gatilhos</span><span className="detail-value">{p.gatilhos || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Dores do Cliente</h3>
        <div className="detail-grid">
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Principais Dores</span><span className="detail-value">{formatArray(p.dores)}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Impacto Financeiro/Operacional</span><span className="detail-value">{p.impacto_dores || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Como Resolve Hoje</span><span className="detail-value">{p.como_resolve_hoje || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Processo Atual</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Usa CRM</span><span className="detail-value">{p.crm || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Qual CRM</span><span className="detail-value">{p.qual_crm || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Canais de Comunicação</span><span className="detail-value">{formatArray(p.canais)}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Como Chegam Leads</span><span className="detail-value">{formatArray(p.como_chegam)}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Etapas do Funil</span><span className="detail-value">{p.etapas_funnel || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Equipe de Vendas</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Nr. Vendedores</span><span className="detail-value">{p.nr_vendedores || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Estrutura</span><span className="detail-value">{formatArray(p.estrutura)}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Metas</span><span className="detail-value">{p.metas || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Treinamento</span><span className="detail-value">{p.treinamento || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Métricas</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Ticket Médio</span><span className="detail-value">{p.ticket_medio || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Ciclo de Vendas</span><span className="detail-value">{p.ciclo_vendas || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Taxa de Conversão</span><span className="detail-value">{p.taxa_conversao || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Reuniões/mês</span><span className="detail-value">{p.reunioes_mes || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Novos Clientes/mês</span><span className="detail-value">{p.novos_clientes || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Churn Mensal</span><span className="detail-value">{p.churn || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Métrica Crítica</span><span className="detail-value">{p.metrica_critica || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Concorrentes</h3>
        <div className="detail-grid">
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Principais Concorrentes</span><span className="detail-value">{formatArray(p.concorrentes)}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">O que fazem melhor</span><span className="detail-value">{p.conc_melhor || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">O que fazemos melhor</span><span className="detail-value">{p.nos_melhor || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Por que perdem para concorrente</span><span className="detail-value">{p.por_que_perdem || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Objetivos</h3>
        <div className="detail-grid">
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">O que esperar</span><span className="detail-value">{formatArray(p.objetivos)}</span></div>
          <div className="detail-item"><span className="detail-label">Meta de Faturamento</span><span className="detail-value">{p.meta_faturamento || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Prazo</span><span className="detail-value">{p.prazo || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Sucesso medido como</span><span className="detail-value">{p.sucesso_medido || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Marketing</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Investe em MKT</span><span className="detail-value">{p.investe_mkt || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Canais Ativos</span><span className="detail-value">{formatArray(p.canais_mkt)}</span></div>
          <div className="detail-item"><span className="detail-label">Investimento Mensal</span><span className="detail-value">{p.investimento_midia || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Agência</span><span className="detail-value">{p.agencia || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Materiais Existentes</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {formatArray(p.materiais).split(', ').filter(Boolean).map((m, i) => <span key={i} className="tag">{m}</span>)}
          {!p.materiais && <span style={{ color: 'var(--muted)' }}>-</span>}
        </div>
        {p.materiais_criar && <div style={{ marginTop: 15 }}><span className="detail-label">Precisa criar/melhorar:</span><br/><span className="detail-value">{p.materiais_criar}</span></div>}
      </div>

      <div className="detail-section">
        <h3>Projeto & Equipe</h3>
        <div className="detail-grid">
          <div className="detail-item"><span className="detail-label">Responsável Projeto</span><span className="detail-value">{p.responsavel_projeto || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Cargo</span><span className="detail-value">{p.cargo_responsavel || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Aprovador</span><span className="detail-value">{p.aprovador || '-'}</span></div>
          <div className="detail-item"><span className="detail-label">Outros Envolvidos</span><span className="detail-value">{p.outros_envolvidos || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Acessos Necessários</span><span className="detail-value">{formatArray(p.acessos)}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Restrições</span><span className="detail-value">{p.restricoes || '-'}</span></div>
        </div>
      </div>

      <div className="detail-section">
        <h3>Contexto Adicional</h3>
        <div className="detail-grid">
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">O que conhecer antes de começar</span><span className="detail-value">{p.conhecer_antes || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Frustrações anteriores</span><span className="detail-value">{p.frustracoes || '-'}</span></div>
          <div className="detail-item" style={{ gridColumn: '1 / -1' }}><span className="detail-label">Sucesso absoluto</span><span className="detail-value">{p.sucesso_absoluto || '-'}</span></div>
        </div>
      </div>
    </div>
  )
}

function formatArray(arr: unknown): string {
  if (!arr) return '-'
  if (Array.isArray(arr)) return arr.filter(Boolean).join(', ')
  if (typeof arr === 'string') return arr
  return '-'
}

// Flatten payload sections para acesso fácil
function flattenPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const flat: Record<string, unknown> = {}

  if (!payload || typeof payload !== 'object') return flat

  // Sections contém os dados reales
  const sections = payload.sections as Record<string, Record<string, unknown>> | undefined

  if (sections) {
    Object.entries(sections).forEach(([sectionName, fields]) => {
      if (fields && typeof fields === 'object') {
        Object.entries(fields).forEach(([key, value]) => {
          // Normalizar nome do campo
          const normalizedKey = normalizeKey(key)
          flat[normalizedKey] = value
        })
      }
    })
  }

  // Também mapeia o sumário se existir (para campos redundantes)
  const summary = payload.summary as Record<string, unknown> | undefined
  if (summary) {
    Object.entries(summary).forEach(([key, value]) => {
      flat[normalizeKey(key)] = value
    })
  }

  return flat
}

function normalizeKey(key: string): string {
  // Mapeamento de nomes das perguntas reais da planilha Orflie (baseado no JSON recebido)
  const map: Record<string, string> = {
    // Seção: Informações Gerais
    'Nome da Empresa': 'companyName',
    'Nome do Responsável': 'contactName',
    'E-mail': 'contactEmail',
    'Telefone / WhatsApp': 'contactPhone',
    'Segmento de Atuação': 'companySegment',
    'CNPJ': 'cnpj',
    'Site': 'site',
    'Tempo de Mercado': 'tempo_mercado',
    'Nº de Colaboradores': 'colaboradores',
    'Cidade / Estado': 'cidade_estado',
    'Faturamento Médio Anual': 'faturamento',
    
    // Seção: Posicionamento
    'Como a empresa se posiciona no mercado?': 'posicionamento',
    'Principal diferencial competitivo': 'diferencial',
    'Como a empresa quer ser percebida pelos clientes?': 'percepcao',
    'Missão ou propósito declarado': 'missao',
    'Quais palavras NÃO representam a empresa?': 'palavras_nao',
    
    // Seção: Objetivos
    'O que a empresa espera alcançar?': 'objetivos',
    'Meta de faturamento desejada': 'meta_faturamento',
    'Prazo esperado para ver resultados': 'prazo',
    'Como o sucesso deste projeto será medido internamente?': 'sucesso_medido',

    // Produtos
    'Produto/serviço prioritário neste projeto': 'produto_prioritario',
    
    // Mapeamento legado para compatibilidade
    'Posição no Mercado': 'posicionamento',
    'Total de vendedores': 'nr_vendedores',
    'Estrutura da equipe': 'estrutura',
    'Metas comerciais': 'metas',
    'Treinamento': 'treinamento',
    'Ticket Médio': 'ticket_medio',
    'Ciclo Médio de Vendas': 'ciclo_vendas',
    'Taxa de Conversão Média': 'taxa_conversao',
    'Reuniões / mês': 'reunioes_mes',
    'Novos clientes / mês': 'novos_clientes',
    'Churn mensal': 'churn',
    'Métrica mais crítica': 'metrica_critica',
  }

  return map[key] || key.toLowerCase().replace(/\s+/g, '_')
}