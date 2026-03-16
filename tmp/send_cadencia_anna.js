const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendCadenciaAnna() {
    const authPath = path.join(__dirname, '..', '.aios-core', 'auth', 'whatsapp-session');
    
    // Check if auth path exists
    if (!fs.existsSync(authPath)) {
        console.error('❌ Sessão do WhatsApp não encontrada em: ' + authPath);
        process.exit(1);
    }

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
            console.log('✅ Conectado ao WhatsApp');

            const filePath = 'c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/JalecoChic/ativos/CADENCIA_EMAILS.md';
            const cadenciaStr = fs.readFileSync(filePath, 'utf-8');

            const annaNumber = '553188636102@s.whatsapp.net'; // Using the number from history

            console.log('🚀 Enviando cadência para Anna Head Marketing...');

            const introMsg = "*🚀 Orion (Master) enviando material para JalecoChic*\n\n" +
                             "Olá Anna! O Leo me pediu para te enviar o script de e-mails que criamos para a JalecoChic.\n" +
                             "Ajustei a linguagem para ser de 'profissional para profissional', focada em autoridade e sem jargões de marketing.\n\n" +
                             "Segue abaixo:";

            await sock.sendMessage(annaNumber, { text: introMsg });
            await sock.sendMessage(annaNumber, { text: cadenciaStr });

            console.log('✅ Conteúdo enviado com sucesso para Anna!');
            
            // Allow some time for messages to be sent before closing
            setTimeout(() => {
                process.exit(0);
            }, 3000);
        } else if (connection === 'close') {
            console.log('❌ Conexão fechada. Verifique o QR Code se necessário.');
        }
    });
}

sendCadenciaAnna().catch(err => {
    console.error('❌ Erro crítico:', err);
    process.exit(1);
});
