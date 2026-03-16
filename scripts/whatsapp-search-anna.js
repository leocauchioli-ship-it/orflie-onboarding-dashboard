const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');

async function searchAnna() {
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
            console.log('✅ Conectado\n');
            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups);

            console.log('--- BUSCANDO ANNA NOS GRUPOS ---');
            // search participations that might be her number
            // or if her name is in any metadata recorded
            // User likely refers to her as she is in the address book

            // To get full contact list, we might need more time to sync, but we can look at group metadata
            for (let g of groupList) {
                console.log(`Checando: ${g.subject}`);
                // Metadata can include name if stored
            }

            process.exit(0);
        }
    });
}

searchAnna().catch(err => console.error(err));
