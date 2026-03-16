const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

const streamPath = path.join(__dirname, '..', 'clients', 'Orflie', '3-interaction-log', 'whatsapp_stream.json');
console.log('[SENTINEL] Bridge inicializada — acumulando mensagens em tempo real.');

async function startSentinel() {
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
            console.log('✅ SENTINEL BRIDGE ATIVO — acumulando mensagens em tempo real.');
        }
    });

    // A cada nova mensagem, salvar no stream JSON estruturado E no store
    sock.ev.on('messages.upsert', async ({ messages, type }) => {
        if (type !== 'notify') return;

        for (const msg of messages) {
            if (!msg.message) continue;

            const from = msg.key.remoteJid;
            const sender = msg.pushName || msg.key.participant?.replace('@lid', '') || 'Unknown';
            const text = msg.message?.conversation
                || msg.message?.extendedTextMessage?.text
                || msg.message?.imageMessage?.caption
                || msg.message?.videoMessage?.caption
                || msg.message?.documentMessage?.caption
                || null;

            if (!text) continue;

            // Persistir no stream JSON
            let logs = [];
            try { logs = JSON.parse(fs.readFileSync(streamPath, 'utf8')) || []; } catch (e) { }
            logs.push({
                timestamp: new Date().toISOString(),
                groupId: from,
                sender,
                message: text,
                isMe: msg.key.fromMe
            });
            if (logs.length > 2000) logs = logs.slice(-2000);
            fs.writeFileSync(streamPath, JSON.stringify(logs, null, 2));

            console.log(`[${new Date().toLocaleTimeString('pt-BR')}] ${from}: ${text.substring(0, 80)}`);
        }
    });


}

startSentinel().catch(console.error);
