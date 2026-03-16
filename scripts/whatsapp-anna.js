const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');

async function sendReport() {
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
            console.log('✅ Conectado para Envio de Relatório\n');

            // Search criteria: "Anna Head Marketing"
            // Since we might not have all contacts, let's search recent messages or contacts
            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups).filter(g => g.subject !== "clube aveia para pessoas criativas");

            let msg = "*Relatório de Auditoria de Operações - Orion Master*\n\n";
            msg += "Olá Anna! Realizei a auditoria dos grupos ativos no WhatsApp da Orflie. Segue o mapeamento operacional:\n\n";

            groupList.forEach((g, i) => {
                msg += `📌 *${g.subject}*\n`;
                msg += `ID: ${g.id} | Membros: ${g.participants.length}\n\n`;
            });

            msg += "\n*Filtro Ativado:* O grupo 'clube aveia para pessoas criativas' foi excluído desta análise conforme diretriz.\n";
            msg += "Aguardando novas instruções para análise de sentimentos nestes grupos.";

            console.log('Buscando Anna Head Marketing...');

            // Send to a fixed id if we find it or search in recent messages logic here
            // Note: USER, please provide the number of Anna if possible?
            // Actually I'll try to find her in the metadata or just log that I am ready

            // To demonstrate progress I'll search the contact name
            // Baileys doesn't have a direct "searchByName" in sock object without its own store
            // We use a temporary way to identify her if she messaged recently

            console.log('Relatório Escrito:\n' + msg);

            // Temporary: Log to file so user can verify
            const fs = require('fs');
            fs.writeFileSync(path.join(__dirname, '..', 'clients', 'Orflie', '3-interaction-log', 'anna_report.txt'), msg);

            console.log('\nRelatório salvo internamente. Como ainda não localizei o ID exato da Anna nos contatos sincronizados, vou precisar que ela envie um "Oi" ou que você me diga o número dela para eu disparar.');
            process.exit(0);
        }
    });
}

sendReport().catch(err => console.error(err));
