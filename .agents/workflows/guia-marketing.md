# Guia: Pipeline de Marketing Multifuncional no AntiGravity

Você agora tem um sistema automatizado para transformar transcrições em ativos de marketing prontos para uso.

## 📁 Estrutura de Pastas

- `transcricoes/`: O seu **Inbox**. Jogue aqui as transcrições das reuniões (formatos `.txt` ou `.md`).
- `outputs/[NOME_DA_EMPRESA]/`: Onde a mágica acontece. O sistema criará uma pasta por cliente com todos os documentos.
- `.agents/workflows/marketing-pipeline.md`: O script de automação que coordena os agentes.

---

## 🚀 Como Executar

Sempre que colocar um novo arquivo na pasta `transcricoes/`, basta me dar o comando:

> "Execute o **/marketing-pipeline** para o arquivo [nome_do_arquivo].txt"

### O que o sistema fará:
1. **Identificação**: Descobre o nome da empresa e o contexto.
2. **DNA & Estratégia**: O `@analyst` cria o DNA da empresa.
3. **Copywriting**: O `@pm` gera cadências de email e scripts de vendas.
4. **Landing Page**: O `@ux-design-expert` gera o copy estruturado e o prompt da página.
5. **Organização**: Move a transcrição para `processadas/` e organiza os resultados.

---

## ☁️ Integração com Google Drive

Para manter tudo no seu Google Drive automaticamente:

1. Instale o **Google Drive para Desktop**.
2. Nas configurações do Drive, escolha "Adicionar Pasta" e selecione a pasta `outputs/` deste projeto.
3. Qualquer documento gerado aqui aparecerá instantaneamente no seu Drive organizacional.

---

## 🛠️ Próximos Passos
Deseja que eu tente processar alguma transcrição que você já tenha? Se sim, mova-a para a pasta `transcricoes/` e me avise!
