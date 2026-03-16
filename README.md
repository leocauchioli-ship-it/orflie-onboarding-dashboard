# Orflie Onboarding Dashboard

Dashboard para visualizar os dados do formulário de onboarding de forma organizada e exportar em PDF.

## Pré-requisitos

1. **Service Account Google Cloud:**
   - Acesse Google Cloud Console → APIs → Ativar Sheets API
   - Credenciais → Criar Conta de Serviço
   - Baixe o arquivo JSON da chave
   - Compartilhe a planilha com o e-mail da service account (algo@project.iam.gserviceaccount.com)

2. **Variáveis de Ambiente:**
   ```
   cp .env.example .env
   # Preencha com os dados do JSON da Service Account
   ```

## Instalação

```bash
npm install
npm run dev
```

## Deploy na Vercel

```bash
# Com Vercel CLI
npm i -g vercel
vercel

# Ou conectar o GitHub à Vercel
```

Adicione as variáveis de ambiente no painel da Vercel.

## Estrutura

```
app/
├── page.tsx          # UI principal
├── globals.css       # Estilos
├── layout.tsx        # Layout
└── api/sheets/
    └── route.ts      # API que lê do Sheets
```

## Funcionalidades

- Lista de empresas com busca
- Visualização detalhada por empresa
- Exportação PDF organizada
- Dados do cliente ideal, métricas, objetivos, etc.