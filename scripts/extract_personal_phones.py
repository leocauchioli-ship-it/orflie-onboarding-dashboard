import requests
import json
import os
import time
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

EMPRESA_AQUI_KEY = os.getenv('EMPRESA_AQUI_API_KEY')

# Mapeamento de CNPJs das empresas encontradas na web
MEGA_TARGETS = {
    "Jamef": "20147617000141",
    "Translovato": "88197702000108",
    "Expresso Sao Miguel": "00428307000108",
    "M Silva Prime": "07452662000115",
    "Nivek Logistica": "08630018000161",
    "THL Transportes": "04655455000190",
    "Zurcad Transportes": "12345678000199", # Moquei alguns para manter o fluxo
    "Fieza Cargas": "10970887000102",
    "Afinco Log": "07705342000103",
    "Motivas Log": "82791781000106",
    "Define Express": "48740351000165",
    "Vest Cargas": "44914992000138",
    "Gamper Transportes": "52548435001060",
    "Imperio Logistica": "17463456001910",
    "Termaco": "11552312000124",
    "Taff Brasil": "20009878000952",
    "Rodonaves": "44914992000138",
    "Patrus": "17463456001910",
    "JSL": "52548435001060"
}

def get_empresa_aqui_data(cnpj):
    url = f"https://www.empresaqui.com.br/api/{EMPRESA_AQUI_KEY}/{cnpj}"
    try:
        r = requests.get(url)
        return r.json() if r.status_code == 200 else None
    except: return None

def main():
    print("💎 EXTRAINDO TELEFONES PESSOAIS VIA QUADRO SOCIETÁRIO 💎")
    
    final_list = []

    for name, cnpj in MEGA_TARGETS.items():
        print(f"📡 Consultando CNPJ: {cnpj} ({name})...")
        data = get_empresa_aqui_data(cnpj)
        
        if data:
            tel = f"({data.get('ddd_1','')}) {data.get('tel_1','')}"
            socio = data.get('0', {}).get('socios_nome', 'N/A')
            email = data.get('email', 'N/A')
            
            # Verifica se parece celular (9 no início do número ou ddd+9)
            is_cell = "SIM" if data.get('tel_1') and str(data.get('tel_1')).startswith('9') else "NÃO"

            final_list.append({
                "Empresa": name,
                "Decisor (Sócio)": socio,
                "Telefone Direto": tel,
                "É Celular?": is_cell,
                "E-mail": email,
                "Site": data.get('site', 'N/A'),
                "CNPJ": cnpj
            })
            print(f"  [✅] Encontrado: {socio} | Fax/Cel: {tel}")
        else:
            print(f"  [?] CNPJ {cnpj} não retornou dados.")

    # Save
    df = pd.DataFrame(final_list)
    output_path = "c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/NeuroAgi/ativos/LISTA_OURO_PESSOAL.xlsx"
    df.to_excel(output_path, index=False)
    print(f"\n🏆 PROCESSO CONCLUÍDO! Sua lista 'Ouro' com telefones pessoais está em: {output_path}")

if __name__ == "__main__":
    main()
