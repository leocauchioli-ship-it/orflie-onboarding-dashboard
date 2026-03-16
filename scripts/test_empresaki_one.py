import requests
import os
import re
import json
from dotenv import load_dotenv

load_dotenv()

EMPRESA_AQUI_KEY = os.getenv('EMPRESA_AQUI_API_KEY')

def get_cnpj_data(cnpj):
    cnpj_clean = re.sub(r'\D', '', cnpj)
    # Tentando com empresaki.com.br
    url = f"https://empresaki.com.br/api/{EMPRESA_AQUI_KEY}/{cnpj_clean}"
    
    try:
        r = requests.get(url)
        if r.status_code == 200:
            return r.json()
        return {"error": r.text, "status": r.status_code}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    cnpj_test = "03753945000172"
    data = get_cnpj_data(cnpj_test)
    print(json.dumps(data, indent=2))
