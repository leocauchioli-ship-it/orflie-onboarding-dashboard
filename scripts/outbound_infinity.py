import os
import json
import re
import pandas as pd
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

# Inicialização das APIs e Chaves
ANTHROPIC_KEY = os.getenv('ANTHROPIC_API_KEY')
EMPRESA_AQUI_KEY = os.getenv('EMPRESA_AQUI_API_KEY')
SNOV_CLIENT_ID = os.getenv('SNOV_CLIENT_ID')
SNOV_CLIENT_SECRET = os.getenv('SNOV_CLIENT_SECRET')

import requests

def analyze_dna_and_extract_icp(file_path):
    """Lê a transcrição/reunião e extrai o ICP Perfeito do Cliente via AI."""
    print(f"\n🧠 [1/4] Lendo DNA/Transcrição a partir de: {file_path}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    prompt = f"""
    Você é um estrategista de Outbound e Growth. Leia as anotações desta reunião/DNA de cliente 
    e defina o Perfil de Cliente Ideal (ICP) para prospecção no mercado B2B brasileiro.
    
    Responda EXATAMENTE neste formato JSON:
    {{
      "icp_summary": "Resumo do perfil",
      "target_cnaes": ["Descrição de CNAE 1", "Descrição de CNAE 2"],
      "company_size_min": 50,
      "company_size_max": 1000,
      "target_roles": ["Diretor de RH", "Head de Marketing", "CEO"],
      "snovio_keywords": ["RH", "Recursos Humanos", "Marketing"]
    }}
    
    Anotações / DNA:
    {content}
    """

    headers = {
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json"
    }
    
    data = {
        "model": "claude-3-5-sonnet-20241022",
        "max_tokens": 1000,
        "temperature": 0.2,
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    try:
        if ANTHROPIC_KEY == "your_anthropic_api_key_here" or not ANTHROPIC_KEY:
            print("Chave de API da Anthropic ausente. Usando extração simulada do núcleo AIOS...")
            # Extração simulada baseada na Ata de Reunião da TES Tecnologia
            return {
              "icp_summary": "Instituições de ensino, prefeituras com foco em educação e empresas que necessitam de salas multimídias, como estúdios de gravação ou salas de reunião interativas.",
              "target_cnaes": ["8513-9/00 (Ensino fundamental)", "8520-1/00 (Ensino médio)", "8532-5/00 (Educação superior)"],
              "company_size_min": 50,
              "company_size_max": 2000,
              "target_roles": ["Diretor de Escola", "Coordenador Pedagógico", "Gestor de TI", "Comprador", "Reitor"],
              "snovio_keywords": ["Diretor", "Coordenador", "TI", "Pedagógico", "Tecnologia"]
            }

        response = requests.post("https://api.anthropic.com/v1/messages", headers=headers, json=data)
        if response.status_code == 200:
            response_text = response.json()["content"][0]["text"]
            json_match = re.search(r'\{.*\}', response_text, re.DOTALL)
            if json_match:
                return json.loads(json_match.group(0))
        else:
            print("Erro API Anthropic:", response.text)
    except Exception as e:
        print("Erro de conexao AI:", e)
    return None

def fetch_companies_from_empresaaqui(cnaes):
    """
    (MOCK DE INTEGRAÇÃO)
    Na vida real, esta função faria o POST no endpoint de busca avançada da Empresa Aqui 
    filtrando pelos CNAEs definidos no passo 1, retornando os domínios.
    """
    print(f"🏭 [2/4] Buscando CNPJs e Domínios no banco da Empresa Aqui para os CNAEs: {cnaes}")
    # Simulação do retorno do Big Data
    return [
        {"razao_social": "LOGISTICA INTELIGENTE LTDA", "cnpj": "11.111.111/0001-11", "dominio": "logbr.com.br"},
        {"razao_social": "RH TECH SOLUCOES", "cnpj": "22.222.222/0001-22", "dominio": "rhtech.com.br"}
    ]

def fetch_snovio_leads_from_domains(domains, config):
    """Bate na Snovio e extrai os e-mails com base nos domínios"""
    print(f"🕵️‍♂️ [3/4] Minerando e-mails na Snov.io para {len(domains)} empresas...")
    print(f"   => Buscando pelos cargos: {config['snovio_keywords']}")
    
    # Simulacao do retorno integrado
    return [
        {"E-mail": "diretor@logbr.com.br", "Nome": "Carlos", "Cargo": "Diretor de RH", "Empresa": "Logistica Inteligente", "Status do e-mail": "valid"},
        {"E-mail": "assist@logbr.com.br", "Nome": "Ana", "Cargo": "Assistente de RH", "Empresa": "Logistica Inteligente", "Status do e-mail": "valid"},
        {"E-mail": "ceo@rhtech.com.br", "Nome": "Pedro", "Cargo": "CEO", "Empresa": "RH Tech", "Status do e-mail": "valid"}
    ]

def apply_clean_list_deep(leads_raw):
    """Aplica o algoritmo do Agente master-ops para limpar a lista final"""
    print(f"🧹 [4/4] Aplicando Agente de Limpeza (Hierarquias, Omissões e Banned Domains)...")
    df = pd.DataFrame(leads_raw)
    
    # Regra de Hierarquia simplificada para o exemplo
    df = df[~df['Cargo'].str.contains('Assistente', case=False)]
    return df

def generate_outbound_package(client_name, transcript_path):
    print("====================================================")
    print(f"🚀 INICIANDO PIPELINE DE OUTBOUND INFINITY")
    print(f"Cliente: {client_name}")
    print("====================================================\n")

    # 1. IA define o ICP
    icp_config = analyze_dna_and_extract_icp(transcript_path)
    if not icp_config:
        print("Erro ao extrair DNA.")
        return

    print("✅ ICP Mapeado com Inteligência Artificial:")
    for k, v in icp_config.items():
        print(f" - {k}: {v}")
    print()

    # 2. Busca de Empresas (Empresa Aqui)
    empresas = fetch_companies_from_empresaaqui(icp_config['target_cnaes'])

    # 3. Mineração de Leads (Snov.io)
    dominios = [e['dominio'] for e in empresas]
    leads = fetch_snovio_leads_from_domains(dominios, icp_config)

    # 4. Limpeza (Master-Ops)
    df_clean = apply_clean_list_deep(leads)

    # 5. Exportação
    output_file = f"C:\\Users\\leo.cauchioli\\Desktop\\{client_name}_Outbound_Limpo.xlsx"
    df_clean.to_excel(output_file, index=False)
    
    print(f"\n🎉 LISTA FINALIZADA E HIGIENIZADA!")
    print(f"📍 Salvo em: {output_file}")
    print(f"📑 Filtros Aplicados (Gravados na Lista): CNAEs {icp_config['target_cnaes']} + Cargos: {icp_config['target_roles']}")

if __name__ == "__main__":
    # Teste de ponta a ponta usando a ata da TES Tecnologia como "Transcrição/DNA"
    transcricao_teste = "c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\clients\\TES_Tecnologia\\2-deliverables\\ata_reuniao_03_03.md"
    generate_outbound_package("TES_Tecnologia", transcricao_teste)
