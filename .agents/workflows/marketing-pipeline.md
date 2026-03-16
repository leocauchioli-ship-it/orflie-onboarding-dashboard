---
description: Pipeline de Marketing Estratégico (DNA -> DNA Profundo -> Ativos)
---

# Pipeline de Marketing Lendário 🚀

Este workflow segue a metodologia de extração de inteligência comercial profunda para gerar ativos de alto impacto.

## Como usar
1. Coloque a transcrição ou documentos em `transcricoes/[EMPRESA].txt`.
2. Execute o `/marketing-pipeline`.

---

## Passos do Workflow

### 1. Scouting e Organização
O **@aios-master** prepara o ambiente:
- Identifica o nome da empresa na transcrição.
- Cria a estrutura: `outputs/[EMPRESA]/estrategia/` e `outputs/[EMPRESA]/ativos/`.

// turbo
### 2. Geração do DNA Base
O **@analyst** gera o documento inicial:
- Executa o prompt de **DNA da Empresa**.
- Salva em: `outputs/[EMPRESA]/estrategia/DNA_BASE.md`.
- Baseado no template: `.aios-core/templates/marketing/template_dna_base.md`.

// turbo
### 3. Geração do DNA PROFUNDO
O **@analyst** (ou estrategista sênior) aprofunda a análise:
- Executa o prompt de **DNA PROFUNDO**.
- Foco em: Padrões de linguagem, dores latentes e "Anti-slogan".
- Salva em: `outputs/[EMPRESA]/estrategia/DNA_PROFUNDO.md`.
- Baseado no template: `.aios-core/templates/marketing/template_dna_profundo.md`.

// turbo
### 4. Criação da Apresentação Comercial
O **@copywriter** (ou @dev/pm) gera os slides:
- Atua como estrategista de storytelling.
- Cria os **10 slides** focados na cabeça do ICP.
- Salva em: `outputs/[EMPRESA]/ativos/APRESENTACAO_COMERCIAL.md`.
- Baseado no template: `.aios-core/templates/marketing/template_apresentacao.md`.

// turbo
### 5. Criação da Cadência de Emails Outbound
O **@copywriter** gera a sequência de 5 emails:
- Foco em atenção psicológica e CTAs diretos (sim/não).
- Salva em: `outputs/[EMPRESA]/ativos/CADENCIA_EMAILS.md`.
- Baseado no template: `.aios-core/templates/marketing/template_emails.md`.

### 6. Auditoria de Tráfego Pago (Opcional)
O **@marketing-expert** (Vortex) entra na conta:
- Identifica gargalos em campanhas ativas.
- Gera o relatório de auditoria e recomendações.
- Salva em: `outputs/[EMPRESA]/estrategia/AUDITORIA_ADS.md`.
- Baseado no template: `.aios-core/templates/marketing/template_ads_audit.md`.

### 7. Finalização e Checklist
O **@qa** revisa os ativos:
- Garante que não houve invenção de dados.
- Valida se a linguagem reflete o ICP.
- Libera a pasta `outputs/[EMPRESA]/` para uso.

