import requests
import os
import json
from dotenv import load_dotenv

load_dotenv()

SNOV_CLIENT_ID = os.getenv('SNOV_CLIENT_ID')
SNOV_CLIENT_SECRET = os.getenv('SNOV_CLIENT_SECRET')

def get_snov_token():
    url = "https://api.snov.io/v1/oauth/access_token"
    payload = {
        "grant_type": "client_credentials",
        "client_id": SNOV_CLIENT_ID,
        "client_secret": SNOV_CLIENT_SECRET
    }
    response = requests.post(url, data=payload)
    if response.status_code == 200:
        return response.json().get("access_token")
    else:
        print("Erro ao obter token Snov.io:", response.text)
        return None

def search_domain(token, domain, positions):
    url = "https://api.snov.io/v2/domain-emails-with-info"
    # The API requires a domain and allows filtering by positions
    params = {
        "domain": domain,
        "type": "all",
        "limit": 5,
        "positions": ",".join(positions)
    }
    headers = {"Authorization": f"Bearer {token}"}
    response = requests.get(url, params=params, headers=headers)
    return response.json()

if __name__ == "__main__":
    print("=== TESTE SNOV.IO API (Demonstração da Ponte Humana) ===")
    token = get_snov_token()
    if token:
        domain = "xpinc.com"  # Exemplo fictício/real
        positions = ["Diretor", "Gerente", "RH", "CEO"]
        print(f"\nBuscando emails na empresa: {domain}")
        print(f"Cargos alvos: {positions}\n")
        
        result = search_domain(token, domain, positions)
        if result.get('success'):
            emails = result.get('emails', [])
            print(f"Encontrados {len(emails)} e-mails:")
            for e in emails:
                print(f" - {e.get('email')} ({e.get('position', 'Sem Cargo')})")
        else:
            print("Nenhum dado encontrado ou erro:", result)
