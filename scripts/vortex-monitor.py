import os
import time
import requests
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv('FB_MARKETING_API_TOKEN')
ACCOUNT_ID = 'act_4102226916661284'
BASE_URL = 'https://graph.facebook.com/v19.0'

def check_campaign():
    # Get today's insights
    now = datetime.now().strftime('%Y-%m-%d')
    
    insights_url = f"{BASE_URL}/{ACCOUNT_ID}/insights"
    params = {
        'access_token': TOKEN,
        'fields': 'spend,impressions,clicks,ctr,cpc,reach,actions',
        'date_preset': 'today',
        'level': 'account'
    }
    
    r = requests.get(insights_url, params=params)
    data = r.json()
    
    timestamp = datetime.now().strftime('%H:%M:%S')
    
    if 'data' in data and len(data['data']) > 0:
        d = data['data'][0]
        spend = float(d.get('spend', 0))
        impressions = d.get('impressions', '0')
        clicks = d.get('clicks', '0')
        ctr = d.get('ctr', '0')
        cpc = d.get('cpc', 'N/A')
        reach = d.get('reach', '0')
        
        # Check for lead actions
        actions = d.get('actions', [])
        leads = next((a['value'] for a in actions if a['action_type'] in ['lead', 'onsite_conversion.lead_grouped']), 0)
        
        status = f"""
[{timestamp}] ═══ VORTEX MONITOR ═══
💰 Gasto Hoje:     R$ {spend:.2f}
👁️  Impressões:    {int(impressions):,}
👆 Cliques:       {int(clicks):,}
📊 CTR:           {float(ctr):.2f}%
💵 CPC:           R$ {float(cpc):.2f}
🎯 Alcance:       {int(reach):,}
🔥 Leads Hoje:    {leads}
"""
        print(status)
        
        # Alert if first lead drops
        if int(leads) > 0:
            print(f"🚨🚨 ALERTA: {leads} LEAD(S) CAPTURADO(S) HOJE! 🚨🚨")
    else:
        print(f"[{timestamp}] Aguardando dados de hoje... (campanha pode ter acabado de ativar)")
    
    return data

print("===========================================")
print("   VORTEX - MONITOR DE CAMPANHA ORFLIE")
print("   Aberto-Leads-OUT | Atualização: 60s")
print("===========================================")
print("Iniciando monitoramento... (CTRL+C para parar)\n")

while True:
    try:
        check_campaign()
        time.sleep(60)  # Atualiza a cada 60 segundos
    except KeyboardInterrupt:
        print("\n🛑 Monitor encerrado.")
        break
    except Exception as e:
        print(f"Erro: {e}")
        time.sleep(30)
