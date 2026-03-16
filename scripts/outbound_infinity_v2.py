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

# Mapeamento inicial de alvos Premium (NeuroAgi Context)
TARGET_CNPJS = {
    "Petrobras": "33000167000101",
    "Itaú Unibanco": "60872504000123",
    "Vale": "33592510000154",
    "Ambev": "07526557000100",
    "WEG": "84429695000111",
    "Banco do Brasil": "00000000000191",
    "Bradesco": "60746948000112",
    "Suzano": "16404287000155",
    "Klabin": "89637490000145",
    "Telefônica Vivo": "02558157000162",
    "Claro": "40432544000147",
    "TIM": "02421421000111",
    "Gerdau": "33469072000130",
    "Magalu": "47960950000121",
    "Localiza": "16670085000155",
    "Raízen": "33453590000188",
    "Cosan": "50746577000115",
    "Lojas Renner": "92754738000171",
    "B3": "09346601000125",
    "BTG Pactual": "30306294000145"
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
    # Endpoint correto baseado no manual fornecido
    url = f"https://www.empresaqui.com.br/api/{EMPRESA_AQUI_KEY}/{cnpj}"
    try:
        r = requests.get(url)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print(f"Erro Empresa Aqui CNPJ {cnpj}: {e}")
    return None

def get_snov_leads(token, domain):
    # Procura especificamente decisores (CEO, Diretor, VP)
    url = f"https://api.snov.io/v2/domain-search/prospects/start?domain={domain}"
    headers = {"Authorization": f"Bearer {token}"}
    
    decisores = ["CEO", "Director", "President", "VP", "Diretor", "Presidente", "Sócio"]
    
    try:
        res = requests.post(url, headers=headers)
        if res.status_code == 202:
            task_hash = res.json().get("meta", {}).get("task_hash")
            if task_hash:
                result_url = f"https://api.snov.io/v2/domain-search/prospects/result/{task_hash}"
                # Polling rápido (3 tentativas)
                for _ in range(3):
                    time.sleep(5)
                    r_res = requests.get(result_url, headers=headers)
                    if r_res.status_code == 200:
                        data = r_res.json().get('data', [])
                        # Filtra por cargos decisores
                        filtered = [p for p in data if any(d.lower() in str(p.get('position','')).lower() for d in decisores)]
                        return filtered if filtered else data[:5] # Retorna top 5 se não achar filtro exato
    except Exception as e:
        print(f"Erro Snovio Domain {domain}: {e}")
    return []

def main():
    print("🚀 INICIANDO MÁQUINA OUTBOUND INFINITY (AUTO-MODE)")
    snov_token = get_snov_token()
    if not snov_token:
        print("❌ Erro ao obter token do Snov.io")
        return

    results = []

    for name, cnpj in TARGET_CNPJS.items():
        print(f"🔍 Empresa: {name} (CNPJ: {cnpj})")
        
        # 1. Dados da Sede e Site via Empresa Aqui
        e_data = get_empresa_aqui_data(cnpj)
        if not e_data:
            print(f"  [-] Falha ao buscar na Empresa Aqui")
            continue
        
        phone = f"({e_data.get('ddd_1','')}) {e_data.get('tel_1','')}"
        site = e_data.get('site', '')
        # Limpa site (removendo http/https se vier)
        clean_site = site.replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0] if site else ""
        
        print(f"  [+] Site: {site} | Telefone: {phone}")

        # 2. Decisores via Snov.io
        if clean_site:
            leads = get_snov_leads(snov_token, clean_site)
            if leads:
                print(f"  [*] Encontrados {len(leads)} decisores no Snov.io")
                for l in leads:
                    results.append({
                        "Empresa": name,
                        "Setor": e_data.get('cnae_principal', ''),
                        "Capital Social": e_data.get('capital_social', ''),
                        "Telefone Sede": phone,
                        "Site": site,
                        "Lead Nome": f"{l.get('first_name','')} {l.get('last_name','')}",
                        "Cargo": l.get('position', ''),
                        "Email": "PENDENTE_CRUZAMENTO", # O Snov v2 requer outro step para o email real às vezes, mas v1 é direto
                        "Snov_ID": l.get('id', '')
                    })
            else:
                results.append({
                    "Empresa": name,
                    "Telefone Sede": phone,
                    "Site": site,
                    "Lead Nome": "Não encontrado",
                    "Cargo": "C-Level"
                })
        else:
            results.append({
                "Empresa": name,
                "Telefone Sede": phone,
                "Site": "N/A",
                "Lead Nome": "N/A"
            })
        
        # Rate limit safety
        time.sleep(1)

    # Export
    df = pd.DataFrame(results)
    output_path = "c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/NeuroAgi/ativos/Outbound_Infinity_Premium.xlsx"
    df.to_excel(output_path, index=False)
    print(f"\n✅ CONCLUÍDO! Planilha Premium gerada em: {output_path}")

if __name__ == "__main__":
    main()
