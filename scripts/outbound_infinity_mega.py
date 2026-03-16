import requests
import json
import os
import time
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

EMPRESA_AQUI_KEY = os.getenv('EMPRESA_AQUI_API_KEY')
SNOV_CLIENT_ID = os.getenv('SNOV_CLIENT_ID')
SNOV_CLIENT_SECRET = os.getenv('SNOV_CLIENT_SECRET')

# Lista de domínios encontrados em diretórios de transportadoras
DOMAINS = [
    "jamef.com.br", "translovato.com.br", "expressosaomiguel.com.br", "transportadoramsilva.com.br",
    "nivek.com.br", "thltransportes.com.br", "zurcad.com.br", "fiezacargas.com.br", "afincolog.com.br",
    "motivaslog.com.br", "defineexpress.com.br", "vestcargas.com.br", "gamper.com.br", "imperiolog.com.br",
    "metacargas.com.br", "azaf.com.br", "exclusivacargas.com.br", "rapidaogoias.com.br", "interlogcargas.com.br",
    "1001cargas.com.br", "juliosimao.com.br", "radicalexpress.com.br", "leotransportes.com.br",
    "transcendental.com.br", "dihtransportes.com.br", "realbrasilcargas.com.br", "trmlogistica.com.br",
    "claratransportes.com.br", "mandalacargas.com.br", "nextlog.com.br", "gvrlog.com.br", "dvntransportadores.com.br",
    "viabrasiltransporte.com.br", "rdexpress.com.br", "newlog.com.br", "ferrazlogistica.com.br"
]

def get_snov_token():
    url = "https://api.snov.io/v1/oauth/access_token"
    payload = {"grant_type": "client_credentials", "client_id": SNOV_CLIENT_ID, "client_secret": SNOV_CLIENT_SECRET}
    res = requests.post(url, data=payload)
    return res.json().get("access_token") if res.status_code == 200 else None

def get_snov_prospects(token, domain):
    url = f"https://api.snov.io/v2/domain-search/prospects/start?domain={domain}"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.post(url, headers=headers)
        if res.status_code == 202:
            task_hash = res.json().get("meta", {}).get("task_hash")
            if task_hash:
                result_url = f"https://api.snov.io/v2/domain-search/prospects/result/{task_hash}"
                for _ in range(3):
                    time.sleep(4)
                    r_res = requests.get(result_url, headers=headers)
                    if r_res.status_code == 200:
                        return r_res.json().get('data', [])
    except: pass
    return []

def get_prospect_details(token, prospect_id):
    url = "https://api.snov.io/v1/get-prospect-details"
    payload = {"prospect_id": prospect_id}
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.post(url, data=payload, headers=headers)
        return res.json().get('data', {}) if res.status_code == 200 else {}
    except: return {}

def main():
    print(f"🔥 INICIANDO MEGA-ENRIQUECIMENTO PARA {len(DOMAINS)} EMPRESAS 🔥")
    token = get_snov_token()
    if not token: return

    final_results = []

    for domain in DOMAINS:
        print(f"🚀 Escaneando: {domain}...")
        prospects = get_snov_prospects(token, domain)
        
        if prospects:
            # Pega decisores principais
            decisors = [p for p in prospects if any(kw in str(p.get('position','')).lower() for kw in ['ceo', 'diretor', 'director', 'proprietario', 'owner', 'gerente', 'socio'])]
            targets = decisors[:2] if decisors else prospects[:1]
            
            for t in targets:
                p_deep = get_prospect_details(token, t.get('id'))
                email = p_deep.get('emails', [{}])[0].get('email', 'N/A') if p_deep.get('emails') else 'N/A'
                phone_lead = p_deep.get('phone_number', 'N/A')
                
                final_results.append({
                    "Empresa/Domínio": domain,
                    "Lead": f"{p_deep.get('first_name','')} {p_deep.get('last_name','')}",
                    "Cargo": p_deep.get('position', 'N/A'),
                    "Email": email,
                    "Telefone Pessoal (Snovio)": phone_lead,
                    "LinkedIn": p_deep.get('source_page', '')
                })
                print(f"  [🎯] Encontrado: {email} | Tel: {phone_lead}")
        else:
            final_results.append({
                "Empresa/Domínio": domain,
                "Lead": "Nenhum decisor encontrado na base",
                "Cargo": "N/A"
            })

    # Save
    df = pd.DataFrame(final_results)
    output_path = "c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/NeuroAgi/ativos/MAQUINA_INFINITY_MEGA_LISTA.xlsx"
    df.to_excel(output_path, index=False)
    print(f"\n✅ MEGA LISTA CONCLUÍDA! Salvo em: {output_path}")

if __name__ == "__main__":
    main()
