const {
    default: makeWASocket,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    delay
} = require('@whiskeysockets/baileys');
const pino = require('pino');
const path = require('path');
const fs = require('fs');

// ============================================================
// AIOS-MASTER - Relatório baseado em stream JSON real
// Lê o arquivo whatsapp_stream.json acumulado pela bridge
// ============================================================

async function masterReport() {
    const annaId = '5511964104642@s.whatsapp.net';
    const streamPath = path.join(__dirname, '..', 'clients', 'Orflie', '3-interaction-log', 'whatsapp_stream.json');

    // Carregar os grupos para mapear ID -> Nome
    const authPath = path.join(__dirname, '..', '.aios-core', 'auth', 'whatsapp-session');
    const auditPath = path.join(__dirname, '..', 'clients', 'Orflie', '3-interaction-log', 'whatsapp_audit.json');

    // Mapa de IDs -> Nomes de grupos
    const groupMap = {};
    try {
        const auditData = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
        auditData.forEach(g => { groupMap[g.id] = g.subject; });
    } catch (e) {
        console.log('Erro ao carregar audit.json:', e.message);
    }

    // Ler stream de interações acumuladas
    let stream = [];
    try {
        stream = JSON.parse(fs.readFileSync(streamPath, 'utf8'));
    } catch (e) {
        console.log('Stream vazio ou não encontrado.');
    }

    if (stream.length === 0) {
        console.log('⚠️ AVISO: Stream ainda vazio. A bridge precisa estar rodando enquanto há mensagens nos grupos.');
        console.log('REGRA: As mensagens só são capturadas a partir do momento que a bridge está ativa.');
        console.log('Para capturar mensagens históricas, a bridge deve estar rodando continuamente.');
        process.exit(0);
    }

    // Agrupar por grupo e filtrar para HOJE
    const todayStr = new Date().toLocaleDateString('pt-BR');
    const byGroup = {};

    stream.forEach(entry => {
        const entryDate = new Date(entry.timestamp).toLocaleDateString('pt-BR');
        if (entryDate !== todayStr) return;

        const groupId = entry.groupId;
        const groupName = groupMap[groupId] || groupId;

        // Ignorar grupo de lazer
        if (groupName.toLowerCase().includes('aveia')) return;

        if (!byGroup[groupName]) byGroup[groupName] = [];
        byGroup[groupName].push(entry);
    });

    const activeGroups = Object.keys(byGroup).filter(g => byGroup[g].length > 0);
    const totalGroups = Object.keys(groupMap).filter(g => !groupMap[g]?.toLowerCase().includes('aveia')).length;
    const silentCount = totalGroups - activeGroups.length;

    // Montar relatório para a Anna
    const { state, saveCreds } = await useMultiFileAuthState(authPath);
    const { version } = await fetchLatestBaileysVersion();

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        auth: state,
        printQRInTerminal: false
    });
    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async update => {
        if (update.connection !== 'open') return;
        await delay(5000);

        let report = `🕵️‍♂️ *Relatório AIOS-MASTER - Operações Orflie (${todayStr})*\n\n`;
        report += "Anna, aqui está o que realmente foi movimentado nos grupos hoje:\n\n";

        if (activeGroups.length === 0) {
            report += "_Nenhuma mensagem capturada ainda na sessão atual. A bridge precisa estar ativa durante as interações._\n";
        } else {
            activeGroups.forEach(groupName => {
                const msgs = byGroup[groupName];
                report += `📌 *${groupName}* (${msgs.length} mensagens)\n`;

                // Pegar as últimas 3 únicas para resumo
                const uniqueMsgs = [...new Map(msgs.map(m => [m.message, m])).values()].slice(-3);
                uniqueMsgs.forEach(m => {
                    const preview = m.message.substring(0, 100);
                    report += `└ 🗯️ _${m.sender}: "${preview}${m.message.length > 100 ? '...' : ''}"_\n`;
                });
                report += "\n";
            });
        }

        report += `🔇 *Os demais ${silentCount} grupos estão em silêncio.*\n`;
        report += "\n_Assinado: Orchestrator Master (Orflie Intel Hub)_";

        await sock.sendMessage(annaId, { text: report });
        console.log('✅ Relatório com dados REAIS enviado para Anna!');
        setTimeout(() => process.exit(0), 5000);
    });
}

masterReport().catch(console.error);
