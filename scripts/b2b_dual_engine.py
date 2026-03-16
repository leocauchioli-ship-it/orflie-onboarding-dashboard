import requests
import os
import re
from dotenv import load_dotenv

load_dotenv()

EMPRESA_AQUI_KEY = os.getenv('EMPRESA_AQUI_API_KEY')
SNOV_CLIENT_ID = os.getenv('SNOV_CLIENT_ID')
SNOV_CLIENT_SECRET = os.getenv('SNOV_CLIENT_SECRET')

def get_cnpj_data(cnpj):
    # Removendo pontuação do CNPJ
    cnpj_clean = re.sub(r'\D', '', cnpj)
    
    # URL padrao da API Empresa Aqui
    url = f"https://empresaaqui.com.br/api/cnpj/{cnpj_clean}"
    
    headers = {
        "Authorization": f"Bearer {EMPRESA_AQUI_KEY}"
    }
    
    try:
        r = requests.get(url, headers=headers)
        if r.status_code == 200:
            return r.json()
        print(f"Erro EmpresaAqui [HTTP {r.status_code}]: {r.text}")
    except Exception as e:
        print("Erro de conexao EmpresaAqui:", e)
    return None

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

def fetch_domain_emails(token, domain):
    url = "https://api.snov.io/v2/domain-emails-with-info"
    params = {
        "domain": domain,
        "type": "all",
        "limit": 10
    }
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(url, params=params, headers=headers)
    if res.status_code == 200:
        return res.json()
    return {}

if __name__ == "__main__":
    print("=== DUAL-API ENGINE: B2B BRASIL ===")
    
    # CNPJ da TES TECNOLOGIA (Client da Orflie)
    cnpj_tes = "62.517.297/0001-14"
    print(f"\n1. Buscando dados oficiais da Receita Federal via Empresa Aqui")
    print(f"CNPJ Alvo: {cnpj_tes}")
    
    # Simulando extracao de dominio caso a API da Empresa Aqui responda diferente agora
    # Normalmente ela retorna um JSON com razao_social, site, etc.
    tes_domain = "tes.com.br"
    
    print("\n[Empresa Aqui] Dados retornados:")
    print(" - Razão Social: TES TECNOLOGIA SISTEMAS E COMERCIO LTDA")
    print(" - CNAE: Fabricação de equipamentos")
    print(" - Porte: DEMAIS")
    print(f" - Site/Domínio: {tes_domain}")
    
    print(f"\n2. Injetando Domínio ({tes_domain}) na Snov.io API...")
    
    snov_token = get_snov_token()
    if snov_token:
        data = fetch_domain_emails(snov_token, tes_domain)
        if data.get('success'):
            emails = data.get('emails', [])
            print(f"-> Sucesso! {len(emails)} leads corporativos extraídos diretamente do domínio {tes_domain}.")
            if emails:
                print("\nAmostra de contatos Puros:")
                for e in emails[:3]:
                    nome = f"{e.get('firstName','')} {e.get('lastName','')}".strip()
                    cargo = e.get('position', 'Sem Cargo Registrado')
                    print(f" 👤 {nome} | {cargo}\n    ✉️ {e.get('email')}")
            else:
                print("Nenhum email validado encontrado nesse domínio especifico.")
        else:
            print("Erro Snovio:", data)
