# Protocolo AIOS-MASTER: Orquestração de Tarefas de Operações (Orflie)

Este protocolo define como o **Master Orchestrator** processa a inteligência coletada pelo Agente Sentinela (@sentinel-ops) via WhatsApp para garantir execução e memória impecáveis.

## 1. Coleta e Triagem (Ingestion)
- **Fonte**: Stream Log do WhatsApp + Legendas de Mídia + Transcrições de Reunião.
- **Filtro de Ruído**: Mensagens que não contenham verbos de ação, nomes de ativos ou pedidos diretos são descartadas da fila de tarefas.

## 2. Chunking e Armazenamento (RAG)
- **Tamanho do Chunk**: Máximo de 512 tokens por interação relevante.
- **Metadados Obrigatórios**: `[Grupo]`, `[Data]`, `[Interlocutor]`, `[Urgência]`.
- **Destino**: `c:\Users\leo.cauchioli\Desktop\aios-core-main\.aios-core\knowledge\chunks\orflie-ops-task-[CLIENT_NAME].json`.

## 3. Regras de Processamento de Tarefas
- **Regra de Cópia**: Se a mensagem vier com imagem/vídeo, a legenda DEVE ser tratada como o Briefing principal.
- **Regra de Handoff**: Se a tarefa for técnica (site/github), o AIOS deve criar o checklist de implementação imediatamente.
- **Regra de Briefing**: Toda sexta-feira, o MASTER deve consolidar os chunks da semana em um relatório de "Entregas vs. Pendências".

## 4. Integração de Memória
- O AIOS-MASTER cruza as demandas do WhatsApp com o arquivo `marketing_audit_04_03.md` para verificar se as ações estão alinhadas à estratégia de tráfego.
