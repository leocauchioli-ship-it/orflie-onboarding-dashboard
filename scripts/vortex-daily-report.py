"""
VORTEX + SENTINEL: Relatório de Fim de Dia
Dispara relatório completo do WhatsApp para a Anna no horário configurado.
Padrão: 18:30 (fim do expediente)
"""
import os
import time
import json
import subprocess
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

REPORT_TIME = "18:30"  # Horário do relatório automático
ANNA_NUMBER = "5511964104642"
AUDIT_JSON = os.path.join(os.path.dirname(__file__), '..', 'clients', 'Orflie', '3-interaction-log', 'whatsapp_audit.json')
STREAM_JSON = os.path.join(os.path.dirname(__file__), '..', 'clients', 'Orflie', '3-interaction-log', 'whatsapp_stream.json')

def build_report():
    # Mapa de IDs -> Nomes
    group_map = {}
    try:
        with open(AUDIT_JSON, 'r', encoding='utf-8') as f:
            audit_data = json.load(f)
        for g in audit_data:
            group_map[g['id']] = g['subject']
    except Exception as e:
        print(f"Erro ao carregar audit.json: {e}")

    # Ler stream do dia
    stream = []
    try:
        with open(STREAM_JSON, 'r', encoding='utf-8') as f:
            stream = json.load(f)
    except Exception as e:
        print(f"Erro ao carregar stream: {e}")

    today_str = datetime.now().strftime('%d/%m/%Y')
    by_group = {}

    for entry in stream:
        entry_date = datetime.fromisoformat(entry['timestamp'].replace('Z', '+00:00'))
        entry_date_local = entry_date.strftime('%d/%m/%Y')
        if entry_date_local != today_str:
            continue

        group_id = entry.get('from') or entry.get('groupId', '')
        group_name = group_map.get(group_id, group_id)
        if 'aveia' in group_name.lower():
            continue

        if group_name not in by_group:
            by_group[group_name] = []
        by_group[group_name].append(entry)

    # Montar relatório
    report = f"📊 *Relatório de Fim de Dia - Orflie ({today_str})*\n\n"
    report += "Anna, aqui está o consolidado completo do que foi movimentado nos grupos hoje:\n\n"

    active_groups = {g: msgs for g, msgs in by_group.items() if len(msgs) > 0}
    silent_count = len(group_map) - len(active_groups) - 1  # -1 para o aveia

    if not active_groups:
        report += "_Nenhuma mensagem registrada pela bridge hoje. Verifique se ela estava ativa._\n"
    else:
        for group_name, msgs in sorted(active_groups.items()):
            report += f"📌 *{group_name}* ({len(msgs)} msgs)\n"
            unique_msgs = list({m['message']: m for m in msgs}.values())[-3:]
            for m in unique_msgs:
                preview = m['message'][:100]
                sender = m.get('sender', 'Unknown')
                report += f"└ 🗯️ _{sender}: \"{preview}{'...' if len(m['message']) > 100 else ''}\"_\n"
            report += "\n"

    report += f"\n🔇 *Os demais {silent_count} grupos estão em silêncio.*\n"
    report += "\n_Assinado: Vortex+Sentinel (Orflie Intelligence Hub)_"
    return report

def send_to_anna(report_text):
    """Salva o relatório e chama o script Node.js para envio"""
    # Salva o relatório em arquivo temporário
    temp_path = os.path.join(os.path.dirname(__file__), '..', 'clients', 'Orflie', '3-interaction-log', 'daily_report_temp.txt')
    with open(temp_path, 'w', encoding='utf-8') as f:
        f.write(report_text)
    print(f"\nRelatório salvo. Disparando envio via WhatsApp...\n")
    
    # Chamar script de envio Node
    result = subprocess.run(
        ['node', os.path.join(os.path.dirname(__file__), 'whatsapp-send-daily.js')],
        capture_output=True, text=True
    )
    print(result.stdout)
    if result.returncode != 0:
        print(f"Erro no envio: {result.stderr}")

print("⏰ AGENDADOR DE RELATÓRIO DIÁRIO ATIVO")
print(f"   Horário de disparo: {REPORT_TIME}")
print(f"   Destinatário: Anna Head Marketing (+55 11 96410-4642)")
print("   (CTRL+C para parar)\n")

sent_today = False
while True:
    now = datetime.now().strftime('%H:%M')
    
    # Reset diário à meia noite
    if now == "00:01":
        sent_today = False

    if now == REPORT_TIME and not sent_today:
        print(f"\n🚀 [{now}] DISPARANDO RELATÓRIO DE FIM DE DIA...")
        report = build_report()
        print(report)
        send_to_anna(report)
        sent_today = True
        print(f"\n✅ Relatório enviado às {now}")
    else:
        remaining = f"{REPORT_TIME} de hoje"
        print(f"[{now}] Aguardando {remaining}... Bridge: Ativa ✅", end='\r')
    
    time.sleep(30)
