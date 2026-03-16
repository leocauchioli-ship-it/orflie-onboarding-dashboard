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

def fetch_domain_result_direct(token, domain):
    start_url = "https://api.snov.io/v2/domain-search/start/"
    payload = {"domain": domain}
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(start_url, json=payload, headers=headers)
    if res.status_code == 202:
        task_hash = res.json().get("meta", {}).get("task_hash")
        if task_hash:
            result_url = f"https://api.snov.io/v2/domain-search/result/{task_hash}"
            time.sleep(10)
            res_result = requests.get(result_url, headers=headers)
            if res_result.status_code == 200:
                return res_result.json()
    return {}

if __name__ == "__main__":
    token = get_snov_token()
    domains = ["honda.com.br", "bradesco.com.br", "vale.com"]
    for d in domains:
        print(f"Buscando {d}...")
        res = fetch_domain_result_direct(token, d)
        phone = res.get("data", {}).get("hq_phone", "N/A")
        print(f" -> Phone: {phone}")
