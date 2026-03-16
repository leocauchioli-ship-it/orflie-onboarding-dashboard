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

def fetch_company_v1(token, domain):
    # Endpoint v1 de detalhes da empresa por domínio
    url = "https://api.snov.io/v1/get-company-details-by-domain"
    payload = {"domain": domain}
    headers = {"Authorization": f"Bearer {token}"}
    
    res = requests.post(url, data=payload, headers=headers)
    if res.status_code == 200:
        return res.json()
    return {}

if __name__ == "__main__":
    token = get_snov_token()
    domain = "putzmeister.com"
    result = fetch_company_v1(token, domain)
    print(json.dumps(result, indent=2))
