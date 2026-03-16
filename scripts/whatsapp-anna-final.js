const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');

async function listChats() {
    const authPath = path.join(__dirname, '..', '.aios-core', 'auth', 'whatsapp-session');
    const { state } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('✅ Conectado para Listar Chats\n');
            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups).filter(g => g.subject !== "clube aveia para pessoas criativas");

            // Build the audit report first
            let auditReport = "📋 *Relatório Orflie - Auditoria Operacional (WhatsApp)*\n\n";
            auditReport += "Olá Anna! Sou o Orion (Master AIOS) e realizei o mapeamento total da operação via WhatsApp da Orflie. Seguem os clusters ativos:\n\n";

            groupList.forEach(g => {
                auditReport += `📌 *${g.subject}* (${g.participants.length} membros)\n`;
            });

            auditReport += "\n✅ *Meta Atual:* Realizar análise de sentimentos e gargalos de leads nestes grupos operacionais.";

            console.log("---- AUDITORIA GERADA ----");
            console.log(auditReport);
            console.log("------------------------");

            // Note: Since I don't have Anna's exact CID yet, I'll log to verify
            // I'll keep the session open to catch more info or wait for user to give the number
            console.log("\n\nSinal verde para envio? Assim que eu localizar a @Anna_Head nos seus contatos sincronizados, eu disparo este texto.");
            process.exit(0);
        }
    });
}

listChats().catch(err => console.error(err));
