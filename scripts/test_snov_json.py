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
    res = requests.post(url, data=payload)
    if res.status_code == 200:
        return res.json().get("access_token")
    return None

def fetch_company_v2_start(token, domain):
    # Endpoint v2
    url = "https://api.snov.io/v2/domain-search/start/"
    payload = {"domain": domain}
    headers = {"Authorization": f"Bearer {token}"}
    
    # Tentando com json=payload
    res = requests.post(url, json=payload, headers=headers)
    print(f"Status Start: {res.status_code}")
    if res.status_code == 200:
        return res.json()
    return {"error": res.text}

if __name__ == "__main__":
    token = get_snov_token()
    domain = "itau.com.br" # Um dominio que certamente o Snovio conhece
    result = fetch_company_v2_start(token, domain)
    print(json.dumps(result, indent=2))
