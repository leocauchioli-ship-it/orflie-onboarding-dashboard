import requests
import os
import time
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

def search_prospects_v1(token):
    # Endpoint v1 Database Search
    url = "https://api.snov.io/v1/prospect-search"
    payload = {
        "positions[]": "CEO",
        "countries[]": "Brazil",
        "limit": 50
    }
    headers = {"Authorization": f"Bearer {token}"}
    
    res = requests.post(url, data=payload, headers=headers)
    if res.status_code == 200:
        return res.json()
    return {"error": res.text, "status": res.status_code}

if __name__ == "__main__":
    token = get_snov_token()
    result = search_prospects_v1(token)
    # Mostra os primeiros 3 resultados para conferir
    if "prospects" in result:
        print(json.dumps(result["prospects"][:3], indent=2))
    else:
        print(json.dumps(result, indent=2))
