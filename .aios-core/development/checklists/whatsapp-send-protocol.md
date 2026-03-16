# Regra de Protocolo: Envio Prioritário WhatsApp (Orflie)

Para qualquer comando de envio de mensagens via WhatsApp do AIOS para a Orflie, devem ser seguidas as seguintes regras técnicas de alta fidelidade:

1. **Aguardar Sincronização Sólida**: Nunca tentar enviar mensagens imediatamente após o evento `connection.update === 'open'`. O sistema deve aguardar pelo menos 5 segundos (`delay`) para garantir que o socket carregou os buffers de contato.
2. **Buffer de Retentativa**: Em caso de falha no envio (timeout ou stream errored), o script deve tentar o envio até 3 vezes antes de reportar sucesso ao Orion.
3. **Verificação de Confirmação**: O script deve aguardar o retorno da Promise de `sock.sendMessage`. O processo só pode exibir a mensagem "✅ Enviado" se a Promise for resolvida com sucesso.
4. **Log de Auditoria**: Todo envio deve ser registrado no arquivo `clients/Orflie/3-interaction-log/whatsapp_outbound.log` com timestamp e status final.
5. **Encerramento Seguro**: Utilizar `setTimeout` de pelo menos 10 segundos após o envio para garantir que os pacotes de rede foram totalmente transmitidos antes do `process.exit()`.
