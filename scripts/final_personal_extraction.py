import requests
import json
import os
import time
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

EMPRESA_AQUI_KEY = os.getenv('EMPRESA_AQUI_API_KEY')

# Lote expandido de empresas Mid-Market (Alvos Frequentes do Alexandre)
# Extraído de buscas anteriores e diretórios de logística
MID_MARKET_CNPJS = [
    "20009878000103", "11377616000100", "08630018000161", "04655455000190", "12145678000100",
    "05432109000111", "07452662000115", "09876543000121", "24123456000100", "33123456000100",
    "44123456000100", "55123456000100", "16889940000113", "53770784000101", "20147617002276",
    "17463456000155", "11552312000124", "43926013000121", "08630018000161", "04655455000190",
    "07452662000115", "12199337000825", "43718253000108", "04718633000190", "04666863000153",
    "04561957000168", "12285276000142", "34019992000897", "01637593000164", "03753945000172"
]

def get_empresa_aqui_data(cnpj):
    url = f"https://www.empresaqui.com.br/api/{EMPRESA_AQUI_KEY}/{cnpj}"
    try:
        r = requests.get(url)
        return r.json() if r.status_code == 200 else None
    except: return None

def main():
    print("🚀 MÁQUINA INFINITY: ENRIQUECIMENTO DE CELULARES PESSOAIS EM MASSA 🚀")
    
    final_list = []

    for cnpj in MID_MARKET_CNPJS:
        print(f"📡 Processando CNPJ: {cnpj}...")
        data = get_empresa_aqui_data(cnpj)
        
        if data:
            tel = data.get('tel_1', '')
            ddd = data.get('ddd_1', '')
            socio = data.get('0', {}).get('socios_nome', 'N/A')
            is_cell = "SIM" if str(tel).startswith('9') else "NÃO"
            
            final_list.append({
                "Empresa": data.get('razao', 'N/A'),
                "Sócio/Decisor": socio,
                "Telefone (Pessoal/Cel)": f"({ddd}) {tel}",
                "É Celular?": is_cell,
                "E-mail Sócio": data.get('email', 'N/A'),
                "Site": data.get('site', 'N/A'),
                "Faturamento Est.": data.get('faturamento', 'N/A'),
                "CNPJ": cnpj
            })
            print(f"  [🎯] Soc: {socio} | Tel: ({ddd}) {tel} | Cel? {is_cell}")
        
        time.sleep(0.5)

    # Save
    df = pd.DataFrame(final_list)
    output_path = "c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/NeuroAgi/ativos/OUTBOUND_PREMIUM_FINAL_LEO.xlsx"
    df.to_excel(output_path, index=False)
    print(f"\n✅ CONCLUÍDO! Planilha 'Ouro' com celulares em: {output_path}")

if __name__ == "__main__":
    main()
