import requests
import os
import re
import json
from dotenv import load_dotenv

load_dotenv()

EMPRESA_AQUI_KEY = os.getenv('EMPRESA_AQUI_API_KEY')

def get_cnpj_data(cnpj):
    cnpj_clean = re.sub(r'\D', '', cnpj)
    # URL (testando variações se necessário, mas o script anterior tinha uma)
    url = f"https://empresaaqui.com.br/api/cnpj/{cnpj_clean}"
    headers = {"Authorization": f"Bearer {EMPRESA_AQUI_KEY}"}
    
    try:
        r = requests.get(url, headers=headers)
        if r.status_code == 200:
            return r.json()
        return {"error": r.text, "status": r.status_code}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    cnpj_test = "03.753.945/0001-72" # Andrade Distribuidor
    data = get_cnpj_data(cnpj_test)
    print(json.dumps(data, indent=2))
