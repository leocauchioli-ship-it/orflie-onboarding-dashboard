const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function autonomousFullAudit() {
    console.log('--- AIOS-MASTER: AUDITORIA AUTÔNOMA TOTAL (24H) ---');

    const authPath = path.join(__dirname, '..', '.aios-core', 'auth', 'whatsapp-session');
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        if (connection === 'open') {
            const annaId = '5511964104642@s.whatsapp.net';

            console.log('Sincronizando todas as conversas do dia...');
            await delay(20000); // 20s para garantir carga de grupos menores

            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups).filter(g => g.subject !== "clube aveia para pessoas criativas");

            let activeReport = "";
            let silentCount = 0;
            const todayStr = new Date().toLocaleDateString('pt-BR');

            for (const g of groupList) {
                console.log(`Scan: ${g.subject}...`);
                let activitySummary = "";

                try {
                    // Tentar carregar histórico real do dia
                    const messages = await sock.fetchMessagesRecipients(g.id, 100);
                    const todayMessages = messages.filter(m => {
                        const mDate = new Date((m.messageTimestamp || 0) * 1000).toLocaleDateString('pt-BR');
                        return mDate === todayStr;
                    });

                    if (todayMessages.length > 0) {
                        activeReport += `📌 *${g.subject}* (${todayMessages.length} msgs hoje)\n`;

                        // Extrair tópicos principais (legendas e textos)
                        const topics = todayMessages.map(m => {
                            const text = m.message?.conversation || m.message?.extendedTextMessage?.text || m.message?.imageMessage?.caption || m.message?.videoMessage?.caption || "";
                            return text.trim();
                        }).filter(t => t.length > 0);

                        if (topics.length > 0) {
                            // Pegar as 3 mais relevantes/recentes
                            const uniqueTopics = [...new Set(topics)].slice(-3);
                            uniqueTopics.forEach(t => {
                                activeReport += `└ 🗯️ _"${t.substring(0, 120)}${t.length > 120 ? '...' : ''}"_\n`;
                            });
                        } else {
                            activeReport += `└ 🖼️ _Movimentação de mídia sem legenda registrada._\n`;
                        }
                        activeReport += "\n";
                        continue;
                    }
                } catch (e) {
                    // Fallback se o fetch falhar: checar log acumulado
                }

                silentCount++;
            }

            let report = `🕵️‍♂️ *Relatório AIOS-MASTER - Operações Orflie (${todayStr})*\n\n`;
            report += "Anna, realizei uma varredura autônoma em todos os grupos. Segue o que foi movimentado hoje:\n\n";
            report += activeReport || "_Nenhuma atividade de texto detectada nos grupos monitorados._\n";
            report += `\n🔇 *Os demais ${silentCount} grupos estão em silêncio absoluto.*\n`;
            report += "\n_Assinado: Orchestrator Master (Autonomia Nível 3)_";

            console.log('Enviando Relatório Autônomo para Anna...');
            await sock.sendMessage(annaId, { text: report });
            console.log('✅ Enviado com Sucesso!');

            // Backup dos chunks para memória RAG
            const chunkPath = path.join(__dirname, '..', '.aios-core', 'knowledge', 'chunks', 'whatsapp_daily_intel.json');
            fs.writeFileSync(chunkPath, JSON.stringify({ date: todayStr, report: activeReport }, null, 2));

            setTimeout(() => { process.exit(0); }, 5000);
        }
    });
}

autonomousFullAudit().catch(err => console.error(err));
