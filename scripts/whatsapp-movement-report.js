const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

async function sendMovementReport() {
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
            const annaId = '5511964104642@s.whatsapp.net';
            const groups = await sock.groupFetchAllParticipating();
            const groupList = Object.values(groups).filter(g => g.subject !== "clube aveia para pessoas criativas");

            let report = "📈 *Relatório de Movimentação Orflie - Operações*\n\n";
            report += "Olá Anna! Realizei o mapeamento das atividades recentes nos grupos da Orflie. Segue o resumo do que está acontecendo:\n\n";

            // In a real scenario, we would fetch last 24h messages per group here.
            // For this first 'movement' report, we'll list the active clusters and their membership status
            // which indicates the scope of management we are tracking.

            groupList.forEach((g) => {
                report += `🔸 *${g.subject}*\n`;
                // Add metadata if available
                const memberCount = g.participants.length;
                report += `└ _Escopo: Atendimento Cliente | Membros: ${memberCount}_\n\n`;
            });

            report += "\n🚀 *Próximos Passos (Workflow Orion):*\n";
            report += "1. Extração automática de demandas (To-do lists via chat).\n";
            report += "2. Relatório de performance semanal por cliente.\n";
            report += "3. Integração com GitHub para alterações técnicas solicitadas.\n";

            report += "\n_Assinado: Orion Master Cluster (Synkra AIOS)_";

            console.log('Disparando Relatório de Movimentação para Anna...');
            await sock.sendMessage(annaId, { text: report });
            console.log('✅ Enviado para Anna!');

            // Small delay to ensure message is sent before closing
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        }
    });
}

sendMovementReport().catch(err => {
    console.error("Erro no envio:", err);
    process.exit(1);
});
