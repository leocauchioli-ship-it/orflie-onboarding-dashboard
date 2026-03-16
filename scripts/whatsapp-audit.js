const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function auditWhatsApp() {
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
            console.log('✅ Conectado para Auditoria\n');

            // 1. List Activities/Groups
            console.log('--- BUSCANDO GRUPOS E CONTATOS ---');
            const groups = await sock.groupFetchAllParticipating();
            const allGroups = Object.values(groups);

            // 2. Find Anna
            // Note: contacts need to be loaded or we search in recent messages
            // For now let's list groups first

            let report = "📋 *Relatório de Auditoria de Operações - Orflie*\n\n";
            report += "*Grupos Ativos Mapeados:*\n";

            const filteredGroups = allGroups.filter(g => g.subject !== "clube aveia para pessoas criativas");

            filteredGroups.forEach((g, i) => {
                report += `${i + 1}. ${g.subject} (${g.participants.length} membros)\n`;
                console.log(`Grupo: ${g.subject} | ID: ${g.id}`);
            });

            console.log('\n--- BUSCANDO ANNA HEAD MARKETING ---');
            // We search in chats/contacts
            // Since Baileys doesn't always have names synced immediately, we might need to search in messages or trust the user name

            // Try to send to Anna if found in metadata or recent chats
            // For this audit, let's output the list first to find her ID

            fs.writeFileSync(path.join(__dirname, '..', 'clients', 'Orflie', '3-interaction-log', 'whatsapp_audit.json'), JSON.stringify(filteredGroups, null, 2));

            console.log('\nRelatório gerado internamente. Pronto para envio.');
            process.exit(0);
        }
    });
}

auditWhatsApp().catch(err => console.error(err));
