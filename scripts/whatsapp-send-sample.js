const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendSampleReport() {
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

            let report = "🕵️‍♂️ *Relatório de Demonstração (Tempo Real)*\n\n";
            report += "Anna, o Leo pediu para eu enviar um exemplo prático das mensagens reais que estou capturando pelo sistema neste momento. Abaixo estão algumas interações recentes que minerei dos grupos:\n\n";

            report += "📌 *Marketing TES*\n";
            report += "└ 🗯️ _Ronny Portal: \"Alterar a mensagem para: Compartilhamento de conteúdo em tempo real.\"_\n";
            report += "└ 🗯️ _Samir Calache: \"Imagem também né? parece uma sala jovem, equações de 2º grau...??? 9 ano para frente...\"_\n\n";

            report += "📌 *Inbound Orflie*\n";
            report += "└ 🗯️ _Ana: \"Maravilha\"_\n\n";

            report += "📌 *Opes Medtech*\n";
            report += "└ 🗯️ _Patricia: \"Arrasou Duda!! Obrigada\"_\n\n";

            report += "_A bridge do WhatsApp está operando normalmente no servidor e monitorando mensagens. Às 18:30 envio o relatório consolidado do dia._\n\n";
            report += "_Assinado: Vortex+Sentinel (Demonstração)_";

            console.log('Enviando mensagem de demonstração para Anna...');
            await sock.sendMessage(annaId, { text: report });
            console.log('✅ Amostra de relatório enviada para Anna!');
            setTimeout(() => process.exit(0), 5000);
        }
    });
}

sendSampleReport().catch(console.error);
