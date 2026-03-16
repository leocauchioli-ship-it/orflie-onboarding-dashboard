import os
import time
import requests
import pandas as pd
import re
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

def fetch_domain_emails(token, domain):
    url = "https://api.snov.io/v2/domain-emails-with-info"
    params = {
        "domain": domain,
        "type": "all",
        "limit": 50
    }
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(url, params=params, headers=headers)
    if res.status_code == 200:
        return res.json()
    return {}

def extract_and_generate_clean_list(input_domains_file, output_path, icp_keywords):
    print(f"=== SNOV.IO PIPELINE AUTOMÁTICO ===")
    print(f"1. Lendo lista de domínios: {input_domains_file}")
    
    # Suporta txt, csv ou excel com uma coluna "Dominio"
    if input_domains_file.endswith('.xlsx'):
        df_in = pd.read_excel(input_domains_file)
    elif input_domains_file.endswith('.csv'):
        df_in = pd.read_csv(input_domains_file)
    else:
        with open(input_domains_file, 'r') as f:
            domains = [line.strip() for line in f if line.strip()]
        df_in = pd.DataFrame({"Dominio": domains})
        
    # Identificar coluna de dominio
    col_dominio = next((c for c in df_in.columns if 'dominio' in c.lower() or 'domain' in c.lower() or 'url' in c.lower() or 'site' in c.lower()), df_in.columns[0])
    domains = df_in[col_dominio].dropna().unique().tolist()
    
    print(f"-> {len(domains)} domínios encontrados para prospecção.")
    
    token = get_snov_token()
    if not token:
        print("Falha ao autenticar no Snov.io.")
        return

    extracted_data = []
    
    print(f"\n2. Minerando e-mails na API Snov.io...")
    for i, dom in enumerate(domains):
        # Limpar url pra ficar so o dominio
        dom_clean = dom.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0]
        
        print(f"   [{i+1}/{len(domains)}] Buscando {dom_clean}...")
        data = fetch_domain_emails(token, dom_clean)
        
        if data.get('success'):
            emails = data.get('emails', [])
            for e in emails:
                cargo = e.get('position', '') or ''
                
                # Filtrar apenas os que dão match no ICP
                match = any(re.search(r"(?i)\b" + kw + r"\b", cargo) for kw in icp_keywords)
                # Se icp_keywords for vazio, aceita todos (ou focar em cargos de lideranca por padrao)
                if not icp_keywords or match:
                    extracted_data.append({
                        "E-mail": e.get('email', ''),
                        "Status do e-mail": e.get('status', 'unknown'),
                        "Nome": e.get('firstName', ''),
                        "Sobrenome": e.get('lastName', ''),
                        "Nome completo": f"{e.get('firstName', '')} {e.get('lastName', '')}",
                        "Cargo": cargo,
                        "LinkedIn": e.get('sourcePage', ''),
                        "Nome da empresa": data.get('companyName', ''),
                        "URL da empresa": dom_clean,
                        "Setor da empresa": data.get('industry', ''),
                        "Tamanho da empresa": data.get('companySize', ''),
                        "País": data.get('country', ''),
                        "Localização da empresa": data.get('locality', '')
                    })
        time.sleep(0.5) # Respeitar o rate limit da api
        
    df_raw = pd.DataFrame(extracted_data)
    print(f"\n-> {len(df_raw)} leads totais extraídos da API.")
    
    if df_raw.empty:
        print("Nenhum lead encontrado com esse ICP.")
        return

    print(f"\n3. Acionando Módulo de Limpeza Profunda (Agente master-ops)...")
    
    # Módulo de Limpeza (mesmas regras do clean_list_deep)
    df = df_raw.copy()
    
    # Regra 1: Hierarquia de cargos e Desduplicação
    hierarquia = [
        r"(?i)\b(diretor|diretora|chief|chro|cpo|ceo|head\b)",
        r"(?i)\b(gerente|gestora|gestor)\b",
        r"(?i)\b(coordenador|coordenadora)\b",
        r"(?i)\b(supervisor|supervisora)\b",
        r"(?i)\b(especialista)\b"
    ]
    def get_rank(title):
        for idx, h in enumerate(hierarquia):
            if re.search(h, str(title)):
                return idx + 1
        return 99

    df['rank'] = df['Cargo'].apply(get_rank)
    df = df.sort_values('rank').drop_duplicates(subset=['E-mail'], keep='first').drop(columns=['rank'])
    
    # Regra 2: Limpar Nomes / Siglas
    siglas = ["RH", "Rh", "HR", "DP", "Dp", "HG", "OT", "Wz", "G"]
    def clean_nome(row):
        nome = str(row['Nome']).strip()
        link = str(row['LinkedIn'])
        if nome in siglas or len(nome) <= 2:
            if '/in/' in link and not ('rh' in link.lower() or 'empresa' in link.lower()):
                parts = link.split('/in/')[-1].strip('/').split('?')[0].split('/')[0].split('-')
                if len(parts[0]) > 2: return parts[0].capitalize()
            return ""
        return nome.split()[0] if nome else ""
    df['Nome'] = df.apply(clean_nome, axis=1)
    
    # Regra 3: Remover proibidos (gov, org, gupy)
    banned = r"(?i)(\.org|\.gov|gupy)"
    df = df[~df['E-mail'].astype(str).str.contains(banned, na=False)]
    
    # Regra 4: Separar Gmail/Hotmail
    personal_mask = df['E-mail'].astype(str).str.contains(r"(?i)(@gmail\.|@hotmail\.|@outlook\.|@icloud\.)", na=False)
    df_personal = df[personal_mask].copy()
    df_professional = df[~personal_mask].copy()

    def r_ill(val):
        return re.sub(r'[\000-\010]|[\013-\014]|[\016-\037]', '', val) if isinstance(val, str) else val

    df_professional = df_professional.applymap(r_ill)
    df_personal = df_personal.applymap(r_ill)

    # Exportar
    print(f"\n4. Gerando Arquivo Final: {output_path}")
    with pd.ExcelWriter(output_path, engine='xlsxwriter') as writer:
        df_professional.to_excel(writer, sheet_name='Empresariais', index=False)
        if not df_personal.empty:
            df_personal.to_excel(writer, sheet_name='Pessoais', index=False)
            
    print(f"✅ Finalizado! Lista pronta para disparo.")
    print(f"📊 Empresariais: {len(df_professional)} | 👤 Pessoais: {len(df_personal)}")

if __name__ == "__main__":
    # Teste Rápido com ICP de RH
    INPUT_FILE = "dominios_alvo_teste.txt"
    with open(INPUT_FILE, "w") as f:
        f.write("xpinc.com\nifood.com.br\nnubank.com.br\n")
        
    OUTPUT_FILE = r"C:\Users\leo.cauchioli\Desktop\Leads_Snovio_Limpos.xlsx"
    ICP = ["RH", "Recursos Humanos", "HR", "Diretor", "Gerente", "Talent"]
    
    extract_and_generate_clean_list(INPUT_FILE, OUTPUT_FILE, ICP)
