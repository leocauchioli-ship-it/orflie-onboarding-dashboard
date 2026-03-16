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

# Lista de Transportadoras/Logística (Mid-to-Large) - Segmento Alvo NeuroAgile
TARGET_CNPJS = {
    "Braspress": "48740351000165",
    "Rodonaves": "44914992000138",
    "JSL": "52548435001060",
    "Patrus": "17463456001910",
    "Jamef": "20147617002276",
    "Atlas Transportes": "53770784000101",
    "Cargo X": "14899142000147",
    "Loggi": "18277493000177",
    "Termaco": "11552312000124",
    "Taff Brasil": "20009878000952",
    "Patrus Transportes": "17463456000155",
    "Transportadora Americana": "43926013000121",
    "Vlog Logistica": "08630018000161",
    "Ajo Logistica": "04655455000190",
    "Exclog Logistica": "07452662000115",
    "Rapidão Cometa (FedEx)": "10970887000102",
    "Planalto Encomendas": "88406152000124",
    "Reunidas Log": "84429695000111",
    "Transpocred": "07705342000103",
    "Coopercarga": "82791781000106"
}

def get_snov_token():
    url = "https://api.snov.io/v1/oauth/access_token"
    payload = {
        "grant_type": "client_credentials",
        "client_id": SNOV_CLIENT_ID,
        "client_secret": SNOV_CLIENT_SECRET
    }
    res = requests.post(url, data=payload)
    if res.status_code == 200:
        return res.json().get("access_token")
    return None

def get_empresa_aqui_data(cnpj):
    url = f"https://www.empresaqui.com.br/api/{EMPRESA_AQUI_KEY}/{cnpj}"
    try:
        r = requests.get(url)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"Erro Empresa Aqui CNPJ {cnpj}: {e}")
    return None

def get_snov_prospects(token, domain):
    # Procura CEOs, Diretores, VPs
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
    except Exception as e:
        print(f"Erro Snovio {domain}: {e}")
    return []

def get_email_v1(token, first_name, last_name, domain):
    # Tenta achar email direto pelo nome e dominio
    url = "https://api.snov.io/v1/get-emails-from-names"
    payload = {
        "firstName": first_name,
        "lastName": last_name,
        "domain": domain
    }
    headers = {"Authorization": f"Bearer {token}"}
    try:
        res = requests.post(url, data=payload, headers=headers)
        if res.status_code == 200:
            data = res.json()
            if data.get('success') and data.get('emails'):
                return data['emails'][0].get('email', 'N/A')
    except:
        pass
    return "N/A"

def main():
    print("🔥 LIGANDO A MÁQUINA INFINITY - FOCO EM LEADS E TELEFONES DIRETOS 🔥")
    snov_token = get_snov_token()
    if not snov_token: return

    final_leads = []

    for name, cnpj in TARGET_CNPJS.items():
        print(f"🚀 Processando: {name}...")
        e_data = get_empresa_aqui_data(cnpj)
        if not e_data: continue

        # Telefone da Sede (Frequentemente o celular do dono em Mid-Market)
        tel_direto = f"({e_data.get('ddd_1','')}) {e_data.get('tel_1','')}"
        site = e_data.get('site', '')
        clean_domain = site.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0] if site else ""

        # Sócio (Opção B para telefone pessoal se estiver no quadro)
        socio_principal = e_data.get('0', {}).get('socios_nome', 'N/A')

        if clean_domain:
            prospects = get_snov_prospects(snov_token, clean_domain)
            if prospects:
                for p in prospects[:3]: # Pega os 3 principais por empresa
                    fname = p.get('first_name', '')
                    lname = p.get('last_name', '')
                    email = get_email_v1(snov_token, fname, lname, clean_domain)
                    
                    final_leads.append({
                        "Empresa": name,
                        "Lead Nome": f"{fname} {lname}",
                        "Cargo": p.get('position', 'Executivo'),
                        "Email Direto": email,
                        "Telefone Direto (CNPJ)": tel_direto,
                        "Sócio Principal": socio_principal,
                        "Site": site,
                        "LinkedIn": p.get('source_page', '')
                    })
                    print(f"  [+] Lead: {fname} | Email: {email} | Tel: {tel_direto}")
            else:
                # Se não achar no Snovio, usa o Sócio do Empresa Aqui
                final_leads.append({
                    "Empresa": name,
                    "Lead Nome": socio_principal,
                    "Cargo": "Sócio/Dono",
                    "Email Direto": e_data.get('email', 'N/A'),
                    "Telefone Direto (CNPJ)": tel_direto,
                    "Sócio Principal": socio_principal,
                    "Site": site
                })
                print(f"  [!] Sócio encontrado: {socio_principal} | Tel: {tel_direto}")
        else:
            final_leads.append({
                "Empresa": name,
                "Lead Nome": socio_principal,
                "Cargo": "Sócio",
                "Telefone Direto (CNPJ)": tel_direto,
                "Sócio Principal": socio_principal
            })

    # Save
    df = pd.DataFrame(final_leads)
    output_path = "c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/NeuroAgi/ativos/Outbound_Infinity_LEADS_V3.xlsx"
    df.to_excel(output_path, index=False)
    print(f"\n✅ MÁQUINA INFINITY CONCLUIU O TRABALHO! Planilha em: {output_path}")

if __name__ == "__main__":
    main()
