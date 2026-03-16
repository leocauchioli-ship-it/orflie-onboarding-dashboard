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

def fetch_company_info_v2(token, domain):
    # Endpoint de inicio de busca v2
    start_url = "https://api.snov.io/v2/domain-search/start/"
    payload = {"domain": domain}
    headers = {"Authorization": f"Bearer {token}"}
    
    res = requests.post(start_url, data=payload, headers=headers)
    if res.status_code == 200:
        data = res.json()
        task_hash = data.get("task_hash")
        if task_hash:
            # Polling for result
            result_url = f"https://api.snov.io/v2/domain-search/result/{task_hash}"
            for _ in range(3): # Tenta 3 vezes
                time.sleep(2)
                res_result = requests.get(result_url, headers=headers)
                if res_result.status_code == 200:
                    return res_result.json()
    return {}

if __name__ == "__main__":
    token = get_snov_token()
    domain = "aerisenergy.com.br"
    result = fetch_company_info_v2(token, domain)
    print(json.dumps(result, indent=2))
