const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');

async function sendToAnna() {
    const authPath = path.join(__dirname, '..', '.aios-core', 'auth', 'whatsapp-session');
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('✅ Conectado para Envio Prioritário\n');

            const annaId = '5511964104642@s.whatsapp.net';
            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups).filter(g => g.subject !== "clube aveia para pessoas criativas");

            let report = "📋 *Relatório Orflie - Auditoria Operacional (WhatsApp)*\n\n";
            report += "Olá Anna! Sou o Orion (Master AIOS) e realizei o mapeamento total da operação via WhatsApp da Orflie. Seguem os clusters ativos sob monitoramento:\n\n";

            groupList.forEach((g, i) => {
                report += `📌 *${g.subject}* (${g.participants.length} membros)\n`;
            });

            report += "\n✅ *Meta Atual:* Realizar análise de sentimentos e gargalos de leads nestes grupos operacionais.";
            report += "\n\n_Assinado: Orion Master Cluster (Synkra AIOS)_";

            console.log('Enviando relatório para Anna...');
            await sock.sendMessage(annaId, { text: report });
            console.log('🚀 Relatório enviado com sucesso!');

            process.exit(0);
        }
    });
}

sendToAnna().catch(err => console.error(err));
