import pandas as pd
import requests
import re
import time
import os

def find_cnpj_data(cnpj):
    # Usando a API gratuita publica.cnpj.ws
    cnpj_clean = re.sub(r'\D', '', cnpj)
    url = f"https://publica.cnpj.ws/cnpj/{cnpj_clean}"
    try:
        r = requests.get(url)
        if r.status_code == 200:
            return r.json()
    except:
        pass
    return None

def process_enrichment(input_file, output_file):
    print(f"Lendo {input_file}...")
    df = pd.read_excel(input_file)
    
    # Mapeamento manual dos CNPJs que já encontrei via busca
    cnpj_map = {
        "Andrade Distribuidor": "03753945000172",
        "Telesil Engenharia": "01637593000164",
        "Sococo S/A Indústrias Alimentícias": "12285276000142",
        "Mineração Taboca": "34019992000897",
        "Amazon Security": "04718633000190",
        "Hospital Santa Júlia": "04666863000153",
        "TVLAR": "04561957000168",
        "GELITA": "12199337000825",
        "Putzmeister Group": "43718253000108"
    }
    
    df['Telefone Empresa'] = ""
    df['CNPJ'] = ""
    
    print("Enriquecendo dados (MVP)...")
    for company, cnpj in cnpj_map.items():
        data = find_cnpj_data(cnpj)
        if data:
            ddd = data.get('estabelecimento', {}).get('ddd1', '')
            tel = data.get('estabelecimento', {}).get('telefone1', '')
            phone = f"({ddd}) {tel}" if ddd and tel else "N/A"
            mask = df['Nome da empresa'].str.contains(company, case=False, na=False)
            df.loc[mask, 'Telefone Empresa'] = phone
            df.loc[mask, 'CNPJ'] = cnpj
            print(f" [+] {company} enriquecida com {phone}")
    
    df.to_excel(output_file, index=False)
    print(f"Salvo em {output_file}")

if __name__ == "__main__":
    process_enrichment(
        'c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/NeuroAgi/ativos/Lista_NeuroAgile_Limpa_v1.xlsx',
        'c:/Users/leo.cauchioli/Desktop/aios-core-main/outputs/NeuroAgi/ativos/Lista_NeuroAgile_Premium_Phones.xlsx'
    )
