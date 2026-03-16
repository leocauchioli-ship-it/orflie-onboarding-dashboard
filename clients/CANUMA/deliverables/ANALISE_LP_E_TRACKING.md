# 🔍 ANÁLISE TÉCNICA E ESTRATÉGICA: LANDING PAGE CANUMÃ

Esta análise foca na Landing Page (LP) "Caça-Vazamento" e no gap de conversão/tracking relatado na reunião de alinhamento.

---

## 1. Diagnóstico de Tracking (Onde o Lead "Some")

A equipe da Canumã relata que o Google Ads marca conversão, mas o lead não aparece na Kentro (CRM).

### Pontos Identificados na LP Atual:
- **Excesso de Botões (Fricção):** A LP possui pelo menos 6 botões direcionando para o mesmo WhatsApp.
- **Botão de Terceiros (Click-to-Chat):** O plugin `click-to-chat` da HoliThemes está instalado (linha 760). Ele gera um evento próprio que pode disparar a conversão no Google Ads *antes* do lead enviar a mensagem de fato.
- **Redirecionamento Externo:** O sistema usa links diretos para `wa.me`. Se a pessoa clicar mas fechar a janela antes do WhatsApp carregar, o Ads conta como "clique convertido", mas o lead nunca chega.

### Sugestão Técnica Imediata:
1. **Página de Obrigado (Flash Check-in):** Configurar a conversão do Google Ads para disparar apenas em uma página intermediária de "Redirecionando para o WhatsApp..." ou após o preenchimento de um formulário curto.
2. **Formulário Nativo:** Como discutido na reunião, em 2026 o lead B2B valoriza velocidade, mas o formulário garante a captura do dado (e-mail/nome) mesmo se o WhatsApp falhar.

---

## 2. Análise de Design e Copy (Conversão)

### Pontos Fortes:
- **Uso de Vídeo:** O uso de vídeo institucional com o Mário (Linha 466) gera muita autoridade.
- **FAQ Estruturado:** Ajuda a filtrar objeções comuns sobre preço e tempo.

### Pontos de Melhoria (Pivotagem para B2B):
- **Layout "Varejo":** O visual atual foca muito na dor residencial imediata. Para atrair Indústrias e Sindicatos, o design precisa de uma roupagem mais "Engenharia/Gestão".
- **Falta de Cases no Site:** A reunião confirmou que não há cases estruturados. Isso é crítico para empresas.
- **Incoerência de Marca:** Como notado por Vanessa, a LP é "moderna", mas o site principal é "antigo". Isso quebra a confiança do lead institucional.

---

## 3. Checklist de Ações Recomendadas

| Ação | Responsável | Objetivo |
| :--- | :--- | :--- |
| **Troca de Número (7770)** | Canumã/TI | Isolar o tráfego da LP para um número de WhatsApp exclusivo para auditoria. |
| **Instalação de Mapa de Calor** | Agência | Identificar se as pessoas estão lendo ou apenas "quicando" na página. |
| **Setup de Google Analytics 4** | Agência | Verificar se os eventos de clique estão configurados como "Eventos de Conversão" ou apenas cliques simples. |
| **Nova LP Segmentada** | Orflie | Testar um design voltado para "Gestão Hídrica Industrial" (ISO 14001) para fugir do lead barato de caça-vazamento residencial. |
| **Formulário Google/Kentro** | Agência | Criar um formulário linkado que capture o lead antes do redirecionamento para o WhatsApp. |

---

## 4. Insight Estratégico (A "Arma Secreta")

O Mário quer ser o "Mascote" da Canumã. O conteúdo que ele já grava para o YouTube/Trello deve ser extraído e usado como **Irmãs de Landing Page** (vídeos curtos focados em uma única dor técnica).

**Frase para o Copy:** *"Não vendemos detecção. Vendemos a paz de espírito de saber que sua conta de R$ 500k é, na verdade, de R$ 60k. O resto é desperdício invisível."*
