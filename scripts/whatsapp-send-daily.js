const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendDailyReport() {
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
            await delay(5000);
            const annaId = '5511964104642@s.whatsapp.net';
            const tempPath = path.join(__dirname, '..', 'clients', 'Orflie', '3-interaction-log', 'daily_report_temp.txt');
            const report = fs.readFileSync(tempPath, 'utf8');
            await sock.sendMessage(annaId, { text: report });
            console.log('✅ Relatório diário enviado para Anna!');
            setTimeout(() => process.exit(0), 5000);
        }
    });
}

sendDailyReport().catch(console.error);
