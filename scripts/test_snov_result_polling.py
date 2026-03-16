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

def poll_snov_result(token, task_hash):
    url = f"https://api.snov.io/v2/domain-search/result/{task_hash}"
    headers = {"Authorization": f"Bearer {token}"}
    
    # Tentando com GET como disse a documentacao
    for _ in range(5):
        time.sleep(3)
        res = requests.get(url, headers=headers)
        if res.status_code == 200:
            return res.json()
        elif res.status_code == 202:
            print("Processando...")
        else:
            print(f"Erro Result: {res.status_code} - {res.text}")
            break
    return {}

if __name__ == "__main__":
    token = get_snov_token()
    task_hash = "130a43b7886c5f817be3e9b568abf209" # Do teste anterior (Itau)
    result = poll_snov_result(token, task_hash)
    print(json.dumps(result, indent=2))
