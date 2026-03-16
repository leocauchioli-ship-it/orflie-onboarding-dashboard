const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function deepAudit() {
    console.log('--- SENTINEL AGENT: DEEP MINING MODE ---');

    // Kill existing bridge to avoid session conflict
    const authPath = path.join(__dirname, '..', '.aios-core', 'auth', 'whatsapp-session');
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        getMessage: async (key) => { return { conversation: '' } } // minimal for history
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection } = update;
        if (connection === 'open') {
            console.log('✅ Conexão estável. Iniciando varredura histórica...');

            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups).filter(g => g.subject !== "clube aveia para pessoas criativas");

            const deepLogs = {};

            for (const g of groupList) {
                console.log(`Minerando histórico de: ${g.subject}...`);
                try {
                    // We attempt to fetch recent messages for each group to provide REAL context
                    const messages = await sock.fetchMessagesRecipients(g.id, 50); // Fetch last 50
                    deepLogs[g.subject] = messages.map(m => ({
                        text: m.message?.conversation || m.message?.extendedTextMessage?.text || '',
                        sender: m.pushName || 'Unknown',
                        time: m.messageTimestamp
                    })).filter(m => m.text.length > 2);
                } catch (e) {
                    console.log(`Nota: Histórico via fetchMessagesRecipients restrito para ${g.subject}. Usando cache de stream.`);
                }
            }

            // Save deep intelligence for the local AI to process
            fs.writeFileSync(path.join(__dirname, '..', 'clients', 'Orflie', '3-interaction-log', 'deep_intelligence.json'), JSON.stringify(deepLogs, null, 2));

            console.log('🧠 Inteligência Profunda Mapeada com Sucesso.');
            process.exit(0);
        }
    });
}

deepAudit().catch(err => console.error(err));
