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

# Foco em empresas Mid-Market (decisores mais acessíveis)
TARGET_CNPJS = {
    "Taff Brasil": "20009878000103",
    "Segalin Logistica": "11377616000100",
    "Termaco Transportes": "11552312000124",
    "Patrus Transportes": "17463456000155",
    "Rapidão Cometa": "10970887000102",
    "Jamef Transportes": "20147617002276",
    "Atlas Logistica": "53770784000101",
    "Vlog Logistica": "08630018000161",
    "Ajo Logistica": "04655455000190",
    "Transpocred": "07705342000103",
    "Zamp Logistica": "13574594000196",
    "Guerini Planejamento": "55123019000155",
    "Construfase": "12145678000100", # Moquei alguns para teste de massa
    "Logistica 10": "09876543000121",
    "Transporte Real": "05432109000111"
}

def get_snov_token():
    url = "https://api.snov.io/v1/oauth/access_token"
    payload = {"grant_type": "client_credentials", "client_id": SNOV_CLIENT_ID, "client_secret": SNOV_CLIENT_SECRET}
    res = requests.post(url, data=payload)
    return res.json().get("access_token") if res.status_code == 200 else None

def get_empresa_aqui_data(cnpj):
    url = f"https://www.empresaqui.com.br/api/{EMPRESA_AQUI_KEY}/{cnpj}"
    try:
        r = requests.get(url)
        return r.json() if r.status_code == 200 else None
    except: return None

def get_prospect_details(token, prospect_id):
    # O PULO DO GATO: Endpoint que gasta credito e entrega o e-mail/telefone
    url = "https://api.snov.io/v1/get-prospect-details"
    payload = {"prospect_id": prospect_id}
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.post(url, data=payload, headers=headers)
        return res.json().get('data', {}) if res.status_code == 200 else {}
    except: return {}

def find_prospects_v2(token, domain):
    url = f"https://api.snov.io/v2/domain-search/prospects/start?domain={domain}"
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.post(url, headers=headers)
        if res.status_code == 202:
            task_hash = res.json().get("meta", {}).get("task_hash")
            if task_hash:
                result_url = f"https://api.snov.io/v2/domain-search/prospects/result/{task_hash}"
                for _ in range(5):
                    time.sleep(3)
                    r_res = requests.get(result_url, headers=headers)
                    if r_res.status_code == 200:
                        return r_res.json().get('data', [])
    except: pass
    return []

def main():
    print("🔥 LIGANDO A MÁQUINA INFINITY - FOCO EM CONTATOS PESSOAIS 🔥")
    token = get_snov_token()
    if not token: return

    leads_enriquecidos = []

    for name, cnpj in TARGET_CNPJS.items():
        print(f"🚀 Caçando decisores em: {name}...")
        e_data = get_empresa_aqui_data(cnpj)
        if not e_data: continue

        site = e_data.get('site', '')
        tel_empresa = f"({e_data.get('ddd_1','')}) {e_data.get('tel_1','')}"
        socio = e_data.get('0', {}).get('socios_nome', 'Sócio não listado')
        
        domain = site.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0] if site else ""
        
        if domain:
            prospects_raw = find_prospects_v2(token, domain)
            # Pega os 2 mais altos cargos
            for p_raw in prospects_raw[:2]:
                pid = p_raw.get('id')
                # Enriquecimento profundo (ID -> Email/Telefone)
                p_deep = get_prospect_details(token, pid)
                
                email = p_deep.get('emails', [{}])[0].get('email', 'N/A') if p_deep.get('emails') else 'N/A'
                phone_lead = p_deep.get('phone_number', 'N/A')
                
                leads_enriquecidos.append({
                    "Empresa": name,
                    "Lead": f"{p_deep.get('first_name','')} {p_deep.get('last_name','')}",
                    "Cargo": p_deep.get('position', 'Executivo'),
                    "Email Profissional/Pessoal": email,
                    "Telefone Lead (Snov)": phone_lead,
                    "Telefone Registrado (Sócio)": tel_empresa,
                    "Sócio Oficial": socio,
                    "Site": site
                })
                print(f"  [🎯] Lead Encontrado: {p_deep.get('first_name','')} | Email: {email} | Tel: {phone_lead}")
        else:
            # Fallback para o Sócio do Empresa Aqui
            leads_enriquecidos.append({
                "Empresa": name,
                "Lead": socio,
                "Cargo": "Dono/Sócio",
                "Telefone Registrado (Sócio)": tel_empresa,
                "Email Empresa": e_data.get('email', 'N/A')
            })
            print(f"  [!] Sem domínio. Usando dados societários: {socio} | Tel: {tel_empresa}")

    # Export final
    df = pd.DataFrame(leads_enriquecidos)
    output_path = "c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/NeuroAgi/ativos/Outbound_Infinity_FINAL_LEO.xlsx"
    df.to_excel(output_path, index=False)
    print(f"\n✅ MISSÃO CUMPRIDA, LEO! Planilha final pronta em: {output_path}")

if __name__ == "__main__":
    main()
