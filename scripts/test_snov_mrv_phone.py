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

def fetch_prospect_details_v2(token, domain):
    # Endpoint prospects-search
    url = f"https://api.snov.io/v2/domain-search/prospects/start?domain={domain}"
    headers = {"Authorization": f"Bearer {token}"}
    
    res = requests.post(url, headers=headers)
    if res.status_code == 202:
        task_hash = res.json().get("meta", {}).get("task_hash")
        if task_hash:
            result_url = f"https://api.snov.io/v2/domain-search/prospects/result/{task_hash}"
            # Polling
            for _ in range(5):
                time.sleep(3)
                res_result = requests.get(result_url, headers=headers)
                if res_result.status_code == 200:
                    return res_result.json()
    return {}

if __name__ == "__main__":
    token = get_snov_token()
    domain = "mrv.com.br" # Outra de grande porte
    result = fetch_prospect_details_v2(token, domain)
    # Mostra apenas um prospect para ver se tem telefone
    if "data" in result and len(result["data"]) > 0:
        print(json.dumps(result["data"][0], indent=2))
    else:
        print(json.dumps(result, indent=2))
