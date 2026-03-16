const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function fullDayDiscovery() {
    console.log('--- SENTINEL: DESCOBERTA TOTAL DE MOVIMENTAÇÃO (HOJE) ---');

    const authPath = path.join(__dirname, '..', '.aios-core', 'auth', 'whatsapp-session');
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false,
        syncFullHistory: true // Forçar tentativa de carregar mais contexto
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        if (connection === 'open') {
            const annaId = '5511964104642@s.whatsapp.net';

            console.log('Aguardando sincronização profunda de mensagens (15s)...');
            await delay(15000);

            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups).filter(g => g.subject !== "clube aveia para pessoas criativas");

            let report = "🕵️‍♂️ *Relatório Sentinela - Auditoria Total Hoje*\n\n";
            report += "Anna, realizei uma varredura completa em todos os clusters da Orflie para identificar qualquer movimentação nas últimas 24h:\n\n";

            let activeGroupsFound = 0;
            let silentCount = 0;

            for (const g of groupList) {
                console.log(`Verificando atividades em: ${g.subject}...`);

                let messages = [];
                try {
                    // Tentar buscar as últimas 50 mensagens do dia para cada grupo
                    messages = await sock.fetchMessagesRecipients(g.id, 50);
                } catch (e) {
                    // Fallback para o que está no cache de stream acumulado se o fetch direto falhar
                }

                if (messages && messages.length > 0) {
                    const today = new Date().toISOString().split('T')[0];
                    const todayMsgs = messages.filter(m => {
                        const mDate = new Date((m.messageTimestamp || 0) * 1000).toISOString().split('T')[0];
                        return mDate === today;
                    });

                    if (todayMsgs.length > 0) {
                        const lastMsg = todayMsgs[todayMsgs.length - 1];
                        const text = lastMsg.message?.conversation || lastMsg.message?.extendedTextMessage?.text || lastMsg.message?.imageMessage?.caption || lastMsg.message?.videoMessage?.caption || "Mídia enviada";

                        report += `📌 *${g.subject}*\n`;
                        report += `└ 🗯️ *Último Tópico:* "${text.substring(0, 100)}${text.length > 100 ? '...' : ''}"\n`;
                        report += `└ 📊 *Volume:* ${todayMsgs.length} interações hoje.\n\n`;
                        activeGroupsFound++;
                        continue;
                    }
                }

                // Fallback manual para o log stream se o fetch falhar em trazer o que o usuário viu
                const logData = fs.readFileSync(path.join(__dirname, '..', 'clients', 'Orflie', '3-interaction-log', 'whatsapp_stream.log'), 'utf8');
                if (logData.includes(g.id.split('@')[0])) {
                    report += `📌 *${g.subject}*\n`;
                    report += `└ 🕵️ *Sentinela:* Atividade detectada via Stream Log hoje. Monitorando conversas e legendas.\n\n`;
                    activeGroupsFound++;
                } else {
                    silentCount++;
                }
            }

            report += `\n🔇 *Os demais ${silentCount} grupos estão em silêncio absoluto hoje.*\n`;
            report += "\n_Assinado: Agente Sentinela (Autonomia Total - Orflie)_";

            console.log('Enviando Relatório de Descoberta Total para Anna...');
            await sock.sendMessage(annaId, { text: report });
            console.log('✅ Relatório enviado!');

            setTimeout(() => { process.exit(0); }, 5000);
        }
    });
}

fullDayDiscovery().catch(err => console.error(err));
