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
          'Como a empresa se posiciona no mercado?': 'Produto Premium',
          'Principal diferencial competitivo': 'Tecnologia proprietária e suporte 24/7',
          'Como a empresa quer ser percebida pelos clientes?': 'Parceiro estratégico de confiança',
          'Missão ou propósito declarado': 'Simplificar a venda B2B com inteligência'
        },
        'Cliente Ideal': {
          'Segmento de Atuação': 'PMEs com 50-500 funcionários',
          'Porte da empresa cliente': 'Médio',
          'Faixa de faturamento do cliente ideal': 'R$ 5M - R$ 50M/ano',
          'Região de atuação': 'Sudeste',
          'Quem toma a decisão de compra': ['Dono / Sócio', 'CEO / Diretor'],
          'Principal gatilho de compra': 'Crescimento acelerado'
        },
        'Dores do Cliente': {
          'Principais dores do cliente': ['Alto CAC', 'Processo manual', 'Falta de visibilidade'],
          'Impacto financeiro/operacional das dores': 'Perda de R$ 100k/mês',
          'Como resolve hoje (antes da Orflie)': 'Planilhas Excel e WhatsApp'
        },
        'Processo de Vendas': {
          'Usa CRM?': 'Parcialmente',
          'Qual CRM utiliza?': 'HubSpot',
          'Canais de comunicação com clientes': ['WhatsApp', 'E-mail', 'LinkedIn'],
          'Como os leads chegam hoje': ['Indicação', 'Marketing digital']
        },
        'Equipe de Vendas': {
          'Total de vendedores': 8,
          'Estrutura da equipe comercial': ['SDR', 'Closer'],
          'Metas comerciais atuais': 'R$ 180k/mês',
          'O time tem treinamento de vendas?': 'Às vezes'
        },
        'Métricas Comerciais': {
          'Ticket Médio': 'R$ 15.000',
          'Ciclo Médio de Vendas': '45 dias',
          'Taxa de Conversão Média': '12%',
          'Reuniões realizadas por mês': 35,
          'Novos clientes por mês': 6,
          'Churn mensal': '5%',
          'Métrica mais crítica para o negócio': 'Taxa de conversão'
        },
        'Concorrência': {
          'Principais concorrentes': ['Salesforce', 'RD Station', 'Pipedrive'],
          'O que os concorrentes fazem melhor': 'Marca consolidada',
          'O que a empresa faz melhor que os concorrentes': 'Atendimento personalizado',
          'Por que perdem para concorrentes?': 'Preço'
        },
        'Objetivos': {
          'O que a empresa espera alcançar?': ['Aumentar geração de leads', 'Melhorar conversão'],
          'Meta de faturamento desejada': 'R$ 800k/mês em 6 meses',
          'Prazo esperado para ver resultados': '3-6 meses',
          'Como o sucesso deste projeto será medido internamente?': 'Aumento de 30% na conversão'
        },
        'Marketing': {
          'Investe em marketing?': 'Sim',
          'Canais de marketing ativos': ['Google Ads', 'LinkedIn Ads'],
          'Investimento mensal em mídia paga': 'R$ 5.000 - R$ 10.000',
          'Trabalha com agência de marketing?': 'Gerenciamento interno'
        },
        'Materiais': {
          'Materiais que a empresa já possui': ['Apresentação institucional', 'Proposta comercial'],
          'Materiais que precisam ser criados ou melhorados': 'Cases de sucesso'
        },
        'Projeto & Equipe': {
          'Nome do responsável interno pelo projeto': 'Ana Paula Santos',
          'Cargo do responsável': 'Gerente Comercial',
          'Quem aprova as entregas?': 'CEO',
          'Outros envolvidos no projeto': 'Time de marketing',
          'Acessos que a Orflie precisará': ['CRM', 'E-mail corporativo'],
          'Restrições ou limitações importantes': 'Nenhuma',
          'O que o time precisa saber antes de começar': 'Sazonalidade no Q4',
          'Frustrações com experiências anteriores': 'Nenhuma',
          'O que seria um sucesso absoluto?': 'Dobrar o faturamento'
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
          'Como a empresa se posiciona no mercado?': 'Especializado / Nicho',
          'Principal diferencial competitivo': 'Especialistas em e-commerce B2B'
        },
        'Métricas Comerciais': {
          'Ticket Médio': 'R$ 8.000',
          'Ciclo Médio de Vendas': '30 dias'
        },
        'Objetivos': {
          'O que a empresa espera alcançar?': ['Escalar receita', 'Entrar em novos mercados']
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
  const [filterSegment, setFilterSegment] = useState('')
  const [filterState, setFilterState] = useState('')
  const [isMock, setIsMock] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchData()
    }
  }, [])

  async function fetchData() {
    try {
      const res = await fetch('/api/sheets')
      if (!res.ok) throw new Error(`API error: ${res.status}`)
      const json = await res.json()
      setData(json)
      setIsMock(false)
    } catch {
      setData(MOCK_DATA)
      setIsMock(true)
    } finally {
      setLoading(false)
    }
  }

  const segments = Array.from(new Set(data.map(d => d.companySegment).filter(Boolean)))

  const states = Array.from(new Set(
    data.map(d => {
      const flat = flattenPayload(d.payload)
      const loc = flat['cidade_estado'] as string | undefined
      if (!loc) return ''
      const parts = loc.split('/')
      return parts.length > 1 ? parts[parts.length - 1].trim() : ''
    }).filter(Boolean)
  ))

  const filtered = data.filter(d => {
    const matchSearch = !search ||
      d.companyName.toLowerCase().includes(search.toLowerCase()) ||
      d.contactName.toLowerCase().includes(search.toLowerCase())

    const matchSegment = !filterSegment || d.companySegment === filterSegment

    const flat = flattenPayload(d.payload)
    const loc = flat['cidade_estado'] as string | undefined
    const state = loc ? (loc.split('/').pop()?.trim() ?? '') : ''
    const matchState = !filterState || state === filterState

    return matchSearch && matchSegment && matchState
  })

  async function exportPDF(d: OnboardingData) {
    const flat = flattenPayload(d.payload)
    const content = generatePDFContent(d, flat)

    const wrapper = document.createElement('div')
    wrapper.style.cssText = 'position:fixed;top:-9999px;left:-9999px;width:794px;background:#fff;'
    wrapper.innerHTML = content
    document.body.appendChild(wrapper)

    try {
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas'),
      ])

      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })

      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })
      const pageW = pdf.internal.pageSize.getWidth()
      const pageH = pdf.internal.pageSize.getHeight()
      const imgH = (canvas.height * pageW) / canvas.width

      let remaining = imgH
      let yOffset = 0

      while (remaining > 0) {
        pdf.addImage(imgData, 'PNG', 0, yOffset, pageW, imgH)
        remaining -= pageH
        if (remaining > 0) {
          yOffset -= pageH
          pdf.addPage()
        }
      }

      pdf.save(`onboarding-${(d.companyName || 'empresa').toLowerCase().replace(/\s+/g, '-')}.pdf`)
    } finally {
      document.body.removeChild(wrapper)
    }
  }

  if (loading) return <div className="container"><div className="loading">Carregando dados...</div></div>

  return (
    <div className="container">
      <header>
        <div className="logo">Orflie <span>Onboarding</span></div>
        <div className="header-controls">
          <input
            className="search-input"
            placeholder="Buscar empresa ou contato..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterSegment}
            onChange={e => setFilterSegment(e.target.value)}
          >
            <option value="">Todos os segmentos</option>
            {segments.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          {states.length > 0 && (
            <select
              className="filter-select"
              value={filterState}
              onChange={e => setFilterState(e.target.value)}
            >
              <option value="">Todos os estados</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
        </div>
      </header>

      {isMock && (
        <div className="mock-banner">
          ⚠️ Exibindo dados de demonstração — conexão com Google Sheets indisponível
        </div>
      )}

      <div className="stats-bar">
        <span className="stat-item"><strong>{filtered.length}</strong> onboardings{filterSegment || filterState ? ' (filtrado)' : ''}</span>
        {filterSegment && <span className="stat-badge">{filterSegment}</span>}
        {filterState && <span className="stat-badge">{filterState}</span>}
        {(filterSegment || filterState) && (
          <button className="btn-clear" onClick={() => { setFilterSegment(''); setFilterState('') }}>
            Limpar filtros
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="empty">Nenhum onboarding encontrado</div>
      ) : selected ? (
        <div>
          <div className="actions" style={{ marginBottom: 20 }}>
            <button className="btn" onClick={() => setSelected(null)}>← Voltar à lista</button>
            <button className="btn btn-secondary" onClick={() => exportPDF(selected)}>📄 Exportar PDF</button>
          </div>
          <DetailView data={selected} />
        </div>
      ) : (
        <div className="grid">
          {filtered.map((item, i) => {
            const flat = flattenPayload(item.payload)
            const loc = flat['cidade_estado'] as string | undefined
            const state = loc ? (loc.split('/').pop()?.trim() ?? '') : ''
            return (
              <div key={i} className="card company-card" onClick={() => setSelected(item)}>
                <div className="company-header">
                  <div>
                    <div className="company-name">{item.companyName || 'Sem nome'}</div>
                    <div className="company-segment">{item.companySegment}</div>
                  </div>
                  {state && <span className="state-badge">{state}</span>}
                </div>
                <div className="company-date">{new Date(item.receivedAt).toLocaleDateString('pt-BR')}</div>
                <div style={{ marginTop: 10, color: 'var(--muted)', fontSize: '0.875rem' }}>
                  {item.contactName} • {item.contactEmail}
                </div>
              </div>
            )
          })}
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
      <p style={{ color: 'var(--muted)', marginBottom: 30 }}>
        Recebido em {new Date(data.receivedAt).toLocaleString('pt-BR')}
      </p>

      <Section title="Dados do Contato">
        <Field label="Nome" value={data.contactName} />
        <Field label="E-mail" value={data.contactEmail} />
        <Field label="Telefone" value={data.contactPhone} />
      </Section>

      <Section title="Dados da Empresa">
        <Field label="CNPJ" value={p.cnpj} />
        <Field label="Site" value={p.site} />
        <Field label="Tempo de Mercado" value={p.tempo_mercado} />
        <Field label="Colaboradores" value={p.colaboradores} />
        <Field label="Cidade/Estado" value={p.cidade_estado} />
        <Field label="Faturamento" value={p.faturamento} />
      </Section>

      <Section title="Posicionamento">
        <Field label="Posição no Mercado" value={p.posicionamento} />
        <Field label="Diferencial" value={p.diferencial} />
        <Field label="Percepção Desejada" value={p.percepcao} />
        <Field label="Missão" value={p.missao} />
        <Field label="Palavras que NÃO representam" value={p.palavras_nao} span />
      </Section>

      <Section title="Cliente Ideal">
        <Field label="Segmento Alvo" value={p.segmento_alvo} />
        <Field label="Porte do Cliente" value={p.porte_cliente} />
        <Field label="Faturamento do Cliente" value={p.faturamento_cliente} />
        <Field label="Região" value={p.regiao} />
        <Field label="Decisores" value={p.decisores} span />
        <Field label="Gatilho de Compra" value={p.gatilhos} span />
      </Section>

      <Section title="Dores do Cliente">
        <Field label="Principais Dores" value={p.dores} span />
        <Field label="Impacto Financeiro/Operacional" value={p.impacto_dores} span />
        <Field label="Como Resolve Hoje" value={p.como_resolve_hoje} span />
      </Section>

      <Section title="Processo de Vendas">
        <Field label="Usa CRM" value={p.crm} />
        <Field label="Qual CRM" value={p.qual_crm} />
        <Field label="Canais de Comunicação" value={p.canais} span />
        <Field label="Como Chegam os Leads" value={p.como_chegam} span />
        <Field label="Etapas do Funil" value={p.etapas_funnel} span />
      </Section>

      <Section title="Equipe de Vendas">
        <Field label="Nr. Vendedores" value={p.nr_vendedores} />
        <Field label="Treinamento" value={p.treinamento} />
        <Field label="Estrutura" value={p.estrutura} span />
        <Field label="Metas" value={p.metas} span />
      </Section>

      <Section title="Métricas Comerciais">
        <Field label="Ticket Médio" value={p.ticket_medio} />
        <Field label="Ciclo de Vendas" value={p.ciclo_vendas} />
        <Field label="Taxa de Conversão" value={p.taxa_conversao} />
        <Field label="Reuniões/mês" value={p.reunioes_mes} />
        <Field label="Novos Clientes/mês" value={p.novos_clientes} />
        <Field label="Churn Mensal" value={p.churn} />
        <Field label="Métrica Crítica" value={p.metrica_critica} />
      </Section>

      <Section title="Concorrentes">
        <Field label="Principais Concorrentes" value={p.concorrentes} span />
        <Field label="O que fazem melhor" value={p.conc_melhor} span />
        <Field label="O que fazemos melhor" value={p.nos_melhor} span />
        <Field label="Por que perdem" value={p.por_que_perdem} span />
      </Section>

      <Section title="Objetivos">
        <Field label="O que espera alcançar" value={p.objetivos} span />
        <Field label="Meta de Faturamento" value={p.meta_faturamento} />
        <Field label="Prazo" value={p.prazo} />
        <Field label="Como mede o sucesso" value={p.sucesso_medido} span />
      </Section>

      <Section title="Marketing">
        <Field label="Investe em MKT" value={p.investe_mkt} />
        <Field label="Investimento Mensal" value={p.investimento_midia} />
        <Field label="Canais Ativos" value={p.canais_mkt} span />
        <Field label="Agência" value={p.agencia} span />
      </Section>

      <Section title="Materiais Existentes">
        <div style={{ gridColumn: '1 / -1' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: p.materiais_criar ? 15 : 0 }}>
            {formatValue(p.materiais).split(', ').filter(v => v && v !== '-').map((m, i) => (
              <span key={i} className="tag">{m}</span>
            ))}
            {!p.materiais && <span style={{ color: 'var(--muted)' }}>-</span>}
          </div>
          {p.materiais_criar ? (
            <div>
              <span className="detail-label">Precisa criar/melhorar:</span>
              <br />
              <span className="detail-value">{formatValue(p.materiais_criar)}</span>
            </div>
          ) : null}
        </div>
      </Section>

      <Section title="Projeto & Equipe">
        <Field label="Responsável" value={p.responsavel_projeto} />
        <Field label="Cargo" value={p.cargo_responsavel} />
        <Field label="Aprovador" value={p.aprovador} />
        <Field label="Outros Envolvidos" value={p.outros_envolvidos} />
        <Field label="Acessos Necessários" value={p.acessos} span />
        <Field label="Restrições" value={p.restricoes} span />
      </Section>

      <Section title="Contexto Adicional">
        <Field label="O que conhecer antes de começar" value={p.conhecer_antes} span />
        <Field label="Frustrações anteriores" value={p.frustracoes} span />
        <Field label="Sucesso absoluto" value={p.sucesso_absoluto} span />
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="detail-section">
      <h3>{title}</h3>
      <div className="detail-grid">{children}</div>
    </div>
  )
}

function Field({ label, value, span }: { label: string; value: unknown; span?: boolean }) {
  return (
    <div className="detail-item" style={span ? { gridColumn: '1 / -1' } : {}}>
      <span className="detail-label">{label}</span>
      <span className="detail-value">{formatValue(value)}</span>
    </div>
  )
}

function formatValue(val: unknown): string {
  if (val === null || val === undefined) return '-'
  if (typeof val === 'string') return val || '-'
  if (typeof val === 'number') return val.toString()
  if (typeof val === 'boolean') return val ? 'Sim' : 'Não'
  if (Array.isArray(val)) return val.filter(Boolean).join(', ') || '-'
  if (typeof val === 'object') {
    try { return JSON.stringify(val) } catch { return '-' }
  }
  return '-'
}

function flattenPayload(payload: Record<string, unknown>): Record<string, unknown> {
  const flat: Record<string, unknown> = {}
  if (!payload || typeof payload !== 'object') return flat

  const sections = payload.sections as Record<string, Record<string, unknown>> | undefined
  if (sections) {
    Object.entries(sections).forEach(([, fields]) => {
      if (fields && typeof fields === 'object') {
        Object.entries(fields).forEach(([key, value]) => {
          flat[normalizeKey(key)] = value
        })
      }
    })
  }

  const summary = payload.summary as Record<string, unknown> | undefined
  if (summary) {
    Object.entries(summary).forEach(([key, value]) => {
      flat[normalizeKey(key)] = value
    })
  }

  return flat
}

function normalizeKey(key: string): string {
  const map: Record<string, string> = {
    // --- Informações de contato / empresa ---
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

    // --- Posicionamento ---
    'Como a empresa se posiciona no mercado?': 'posicionamento',
    'Posição no Mercado': 'posicionamento',
    'Principal diferencial competitivo': 'diferencial',
    'Como a empresa quer ser percebida pelos clientes?': 'percepcao',
    'Como a empresa quer ser percebida': 'percepcao',
    'Missão ou propósito declarado': 'missao',
    'Quais palavras NÃO representam a empresa?': 'palavras_nao',
    'Produto/serviço prioritário neste projeto': 'produto_prioritario',

    // --- Cliente ideal ---
    'Segmento-alvo': 'segmento_alvo',
    'Segmento de Atuação do cliente ideal': 'segmento_alvo',
    'Porte da empresa cliente': 'porte_cliente',
    'Porte do cliente ideal': 'porte_cliente',
    'Faixa de faturamento do cliente ideal': 'faturamento_cliente',
    'Região de atuação': 'regiao',
    'Quem toma a decisão de compra': 'decisores',
    'Quem toma a decisão de compra?': 'decisores',
    'Principal gatilho de compra': 'gatilhos',
    'Principal gatilho': 'gatilhos',

    // --- Dores ---
    'Principais dores do cliente': 'dores',
    'Principais dores do cliente ideal': 'dores',
    'Impacto financeiro/operacional das dores': 'impacto_dores',
    'Impacto financeiro/operacional': 'impacto_dores',
    'Como resolve hoje (antes da Orflie)': 'como_resolve_hoje',
    'Como resolve hoje': 'como_resolve_hoje',

    // --- Processo de vendas ---
    'Usa CRM?': 'crm',
    'CRM': 'crm',
    'Qual CRM utiliza?': 'qual_crm',
    'Qual CRM': 'qual_crm',
    'Canais de comunicação com clientes': 'canais',
    'Canais de comunicação': 'canais',
    'Como os leads chegam hoje': 'como_chegam',
    'Como os leads chegam': 'como_chegam',
    'Etapas do funil de vendas': 'etapas_funnel',

    // --- Equipe de vendas ---
    'Total de vendedores': 'nr_vendedores',
    'Estrutura da equipe comercial': 'estrutura',
    'Estrutura da equipe': 'estrutura',
    'Metas comerciais atuais': 'metas',
    'Metas comerciais': 'metas',
    'O time tem treinamento de vendas?': 'treinamento',

    // --- Métricas ---
    'Ticket Médio': 'ticket_medio',
    'Ciclo Médio de Vendas': 'ciclo_vendas',
    'Taxa de Conversão Média': 'taxa_conversao',
    'Reuniões realizadas por mês': 'reunioes_mes',
    'Reuniões / mês': 'reunioes_mes',
    'Novos clientes por mês': 'novos_clientes',
    'Novos clientes / mês': 'novos_clientes',
    'Churn mensal': 'churn',
    'Métrica mais crítica para o negócio': 'metrica_critica',
    'Métrica mais crítica': 'metrica_critica',

    // --- Concorrência ---
    'Principais concorrentes': 'concorrentes',
    'O que os concorrentes fazem melhor': 'conc_melhor',
    'O que concorrentes fazem melhor': 'conc_melhor',
    'O que a empresa faz melhor que os concorrentes': 'nos_melhor',
    'O que a empresa faz melhor': 'nos_melhor',
    'Por que perdem para concorrentes?': 'por_que_perdem',
    'Por que perdem para concorrente': 'por_que_perdem',

    // --- Objetivos ---
    'O que a empresa espera alcançar?': 'objetivos',
    'Meta de faturamento desejada': 'meta_faturamento',
    'Prazo esperado para ver resultados': 'prazo',
    'Como o sucesso deste projeto será medido internamente?': 'sucesso_medido',

    // --- Marketing ---
    'Investe em marketing?': 'investe_mkt',
    'Investe em marketing': 'investe_mkt',
    'Canais de marketing ativos': 'canais_mkt',
    'Canais ativos': 'canais_mkt',
    'Investimento mensal em mídia paga': 'investimento_midia',
    'Investimento mensal em mídia': 'investimento_midia',
    'Trabalha com agência de marketing?': 'agencia',
    'Agência de marketing': 'agencia',

    // --- Materiais ---
    'Materiais que a empresa já possui': 'materiais',
    'A empresa já possui': 'materiais',
    'Materiais que precisam ser criados ou melhorados': 'materiais_criar',
    'Material precisa criar': 'materiais_criar',

    // --- Projeto & Equipe ---
    'Nome do responsável interno pelo projeto': 'responsavel_projeto',
    'Responsável interno': 'responsavel_projeto',
    'Cargo do responsável': 'cargo_responsavel',
    'Cargo': 'cargo_responsavel',
    'Quem aprova as entregas?': 'aprovador',
    'Outros envolvidos no projeto': 'outros_envolvidos',
    'Acessos que a Orflie precisará': 'acessos',
    'Acessos necessários': 'acessos',
    'Restrições ou limitações importantes': 'restricoes',
    'Restrições': 'restricoes',

    // --- Contexto adicional ---
    'O que o time precisa saber antes de começar': 'conhecer_antes',
    'O que time precisa saber': 'conhecer_antes',
    'Frustrações com experiências anteriores': 'frustracoes',
    'Frustrações anteriores': 'frustracoes',
    'O que seria um sucesso absoluto?': 'sucesso_absoluto',
    'Sucesso absoluto': 'sucesso_absoluto',
  }

  return map[key] ?? key.toLowerCase().replace(/\s+/g, '_').replace(/[?]/g, '')
}

function generatePDFContent(d: OnboardingData, p: Record<string, unknown>): string {
  const f = (val: unknown) => formatValue(val)
  const arr = (val: unknown) => Array.isArray(val) ? (val as string[]).join(' · ') : f(val)

  // Só renderiza se tiver valor preenchido (não "-")
  const field = (label: string, val: unknown) => {
    const v = Array.isArray(val) ? arr(val) : f(val)
    if (!v || v === '-') return ''
    return `
      <div style="margin-bottom:10px;">
        <div style="font-size:10px;font-weight:600;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:3px;">${label}</div>
        <div style="font-size:13px;color:#1a1a1a;line-height:1.5;">${v}</div>
      </div>`
  }

  const section = (title: string, fields: string) => {
    const filtered = fields.trim()
    if (!filtered) return ''
    return `
      <div style="margin-bottom:24px;break-inside:avoid;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:14px;">
          <div style="width:3px;height:18px;background:#0a0a0a;border-radius:2px;flex-shrink:0;"></div>
          <div style="font-size:12px;font-weight:700;color:#0a0a0a;text-transform:uppercase;letter-spacing:1px;">${title}</div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px 24px;padding-left:11px;">
          ${filtered}
        </div>
      </div>`
  }

  return `
    <div style="font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#1a1a1a;width:794px;">

      <!-- HEADER -->
      <div style="background:#0a0a0a;padding:32px 40px 28px;margin-bottom:0;">
        <div style="font-size:11px;font-weight:600;color:#888;letter-spacing:2px;text-transform:uppercase;margin-bottom:8px;">ORFLIE · ONBOARDING</div>
        <div style="font-size:28px;font-weight:700;color:#fff;line-height:1.2;margin-bottom:4px;">${d.companyName || 'Empresa'}</div>
        ${d.companySegment ? `<div style="font-size:13px;color:#aaa;margin-top:6px;">${d.companySegment}</div>` : ''}
      </div>

      <!-- META BAR -->
      <div style="background:#f5f5f5;padding:14px 40px;display:flex;gap:32px;border-bottom:1px solid #e5e5e5;margin-bottom:32px;">
        ${d.contactName ? `<div><span style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;">Contato</span><br><span style="font-size:12px;color:#1a1a1a;">${d.contactName}</span></div>` : ''}
        ${d.contactEmail ? `<div><span style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;">E-mail</span><br><span style="font-size:12px;color:#1a1a1a;">${d.contactEmail}</span></div>` : ''}
        ${d.contactPhone ? `<div><span style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;">Telefone</span><br><span style="font-size:12px;color:#1a1a1a;">${d.contactPhone}</span></div>` : ''}
        ${d.receivedAt ? `<div style="margin-left:auto;"><span style="font-size:10px;color:#888;font-weight:600;text-transform:uppercase;">Recebido</span><br><span style="font-size:12px;color:#1a1a1a;">${d.receivedAt.slice(0,16).replace('T',' ')}</span></div>` : ''}
      </div>

      <!-- BODY -->
      <div style="padding:0 40px 40px;">

        ${section('Dados da Empresa', `
          ${field('CNPJ', p.cnpj)}
          ${field('Site', p.site)}
          ${field('Tempo de Mercado', p.tempo_mercado)}
          ${field('Colaboradores', p.colaboradores)}
          ${field('Cidade / Estado', p.cidade_estado)}
          ${field('Faturamento Médio', p.faturamento)}
        `)}

        ${section('Posicionamento', `
          ${field('Posição no Mercado', p.posicionamento)}
          ${field('Diferencial', p.diferencial)}
          ${field('Percepção Desejada', p.percepcao)}
          ${field('Missão', p.missao)}
        `)}

        ${section('Cliente Ideal', `
          ${field('Segmento Alvo', p.segmento_alvo)}
          ${field('Porte do Cliente', p.porte_cliente)}
          ${field('Região', p.regiao)}
          ${field('Decisores', p.decisores)}
          ${field('Gatilho de Compra', p.gatilhos)}
        `)}

        ${section('Dores do Cliente', `
          ${field('Principais Dores', p.dores)}
          ${field('Impacto', p.impacto_dores)}
          ${field('Como Resolve Hoje', p.como_resolve_hoje)}
        `)}

        ${section('Processo de Vendas', `
          ${field('Usa CRM', p.crm)}
          ${field('Qual CRM', p.qual_crm)}
          ${field('Canais de Venda', p.canais)}
          ${field('Como Chegam Leads', p.como_chegam)}
        `)}

        ${section('Equipe de Vendas', `
          ${field('Nº de Vendedores', p.nr_vendedores)}
          ${field('Estrutura', p.estrutura)}
          ${field('Metas', p.metas)}
        `)}

        ${section('Métricas', `
          ${field('Ticket Médio', p.ticket_medio)}
          ${field('Ciclo de Vendas', p.ciclo_vendas)}
          ${field('Taxa de Conversão', p.taxa_conversao)}
          ${field('Churn', p.churn)}
          ${field('Métrica Crítica', p.metrica_critica)}
        `)}

        ${section('Concorrência', `
          ${field('Principais Concorrentes', p.concorrentes)}
          ${field('Diferencial vs Concorrentes', p.diferencial_concorrentes)}
        `)}

        ${section('Objetivos', `
          ${field('O que Espera Alcançar', p.objetivos)}
          ${field('Meta de Faturamento', p.meta_faturamento)}
          ${field('Prazo', p.prazo)}
        `)}

        ${section('Contexto Adicional', `
          ${field('O que Conhecer Antes', p.conhecer_antes)}
          ${field('Sucesso Absoluto', p.sucesso_absoluto)}
          ${field('Materiais a Criar', p.materiais_criar)}
        `)}

      </div>

      <!-- FOOTER -->
      <div style="border-top:1px solid #e5e5e5;padding:16px 40px;display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:10px;color:#aaa;">Documento gerado pelo sistema Orflie Onboarding</div>
        <div style="font-size:10px;color:#aaa;font-weight:600;">ORFLIE</div>
      </div>
    </div>
  `
}
