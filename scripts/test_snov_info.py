import requests
import os
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

def fetch_domain_info(token, domain):
    url = "https://api.snov.io/v2/domain-emails-with-info"
    params = {
        "domain": domain,
        "type": "all",
        "limit": 1
    }
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(url, params=params, headers=headers)
    if res.status_code == 200:
        return res.json()
    return {}

if __name__ == "__main__":
    token = get_snov_token()
    # Testando com a Aeris Energy que estava na lista
    test_domain = "aerisenergy.com.br"
    info = fetch_domain_info(token, test_domain)
    import json
    print(json.dumps(info, indent=2))
