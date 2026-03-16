import pandas as pd
import re
import os
import argparse
from urllib.parse import urlparse

def clean_snovio_list(input_path, output_path, keep_unknown=False):
    print(f"Lendo arquvio: {input_path}")
    df = pd.read_excel(input_path)
    
    orig_len = len(df)
    
    # 1. Manter 'unknown' se solicitado
    if 'Status do e-mail' in df.columns:
        status_counts = df['Status do e-mail'].value_counts().to_dict()
        if not keep_unknown:
            df = df[df['Status do e-mail'].str.strip().str.lower() != 'unknown']
    else:
        status_counts = {}

    # 2. Remover colunas desnecessárias e 100% vazias, manter até coluna V
    cols_to_keep = [
        "E-mail", "Status do e-mail", "Nome", "Sobrenome", "Nome completo",
        "Usuário - redes sociais", "LinkedIn", "Cargo", "País", "Localização",
        "Setor", "Nome da empresa", "URL da empresa", "Empresa - redes sociais",
        "Tamanho da empresa", "País da empresa", "Localização da empresa",
        "Estado", "Cidade", "Setor da empresa", "Telefone da sede"
    ]
    
    # Check if cols exist before filtering
    available_cols = [c for c in cols_to_keep if c in df.columns]
    
    # Find empty cols
    empty_cols = df.columns[df.isnull().all()].tolist()
    if 'Adicionar data' in df.columns:
        empty_cols.append('Adicionar data')
        
    df = df[available_cols].copy()
    
    # 3. Hierarquia de Cargos (Deduplicação)
    hierarquia = [
        r"(?i)\b(diretor|diretora|chief|chro|cpo|ceo|head\b)",
        r"(?i)\b(gerente|gestora|gestor)\b",
        r"(?i)\b(coordenador|coordenadora)\b",
        r"(?i)\b(supervisor|supervisora)\b",
        r"(?i)\b(especialista)\b",
        r"(?i)\b(analista|assistente|estagiário|estagiaria)\b"
    ]
    
    def get_rank(title):
        if not isinstance(title, str): return 99
        for i, h in enumerate(hierarquia):
            if re.search(h, title):
                return i + 1
        return 99

    if 'E-mail' in df.columns and 'Cargo' in df.columns:
        df['rank'] = df['Cargo'].apply(get_rank)
        df = df.sort_values('rank')
        
    # Agrupar e dedpulicar e-mail
    if 'E-mail' in df.columns:
        dupes_before = len(df)
        df = df.drop_duplicates(subset=['E-mail'], keep='first')
        dupes_removed = dupes_before - len(df)
    else:
        dupes_removed = 0

    if 'rank' in df.columns:
        df = df.drop(columns=['rank'])

    # 4. Limpeza de Nomes e Siglas
    siglas = ["RH", "Rh", "HR", "DP", "Dp", "HG", "OT", "Wz", "G"]
    chineses_regex = re.compile(u'[\u4e00-\u9fff]')
    nomes_vazios = 0
    
    def extract_name_from_linkedin(url):
        if not isinstance(url, str): return None
        if '/in/' in url:
            username = url.split('/in/')[-1].strip('/')
            username = username.split('?')[0].split('/')[0]
            # Se a url tem '-' pode ter o nome, ex: juliana-albano, mas ignorar se contem rh-empresa
            if 'rh' in username.lower() or 'empresa' in username.lower():
                return None
            parts = username.split('-')
            if parts and len(parts[0]) > 2:
                return parts[0].capitalize()
        return None

    def clean_nome(row):
        nonlocal nomes_vazios
        nome = str(row['Nome']) if pd.notnull(row['Nome']) else ""
        link = str(row['LinkedIn']) if pd.notnull(row['LinkedIn']) else ""
        
        nome = nome.strip()
        
        if chineses_regex.search(nome):
            return nome  # Mantem e avisa
            
        if nome in siglas or len(nome) <= 2:
            extracted = extract_name_from_linkedin(link)
            if extracted:
                return extracted
            nomes_vazios += 1
            return ""
        
        # Pega so o primeiro nome real
        return nome.split()[0] if nome else ""

    if 'Nome' in df.columns:
        df['Nome Original'] = df['Nome'] # Guarda pra ref
        df['Nome'] = df.apply(clean_nome, axis=1)

    # Coletar estatisticas
    if 'Setor' in df.columns:
        top_setores = df['Setor'].value_counts().head(5).to_dict()
    else: top_setores = {}

    # 5. Filtrar e Separar Emails
    banned_removed = 0
    df_personal = pd.DataFrame()
    df_professional = df.copy()

    if 'E-mail' in df.columns:
        banned_pattern = r"(?i)(\.org|\.gov|gupy)"
        personal_pattern = r"(?i)(@gmail\.|@hotmail\.|@outlook\.|@icloud\.)"
        
        initial_len = len(df_professional)
        df_professional = df_professional[~df_professional['E-mail'].astype(str).str.contains(banned_pattern, na=False)]
        banned_removed = initial_len - len(df_professional)
        
        personal_mask = df_professional['E-mail'].astype(str).str.contains(personal_pattern, na=False)
        df_personal = df_professional[personal_mask].copy()
        df_professional = df_professional[~personal_mask].copy()

    def remove_illegal_chars(val):
        if isinstance(val, str):
            return re.sub(r'[\000-\010]|[\013-\014]|[\016-\037]', '', val)
        return val

    for col in df_professional.columns:
        df_professional[col] = df_professional[col].apply(remove_illegal_chars)
        
    for col in df_personal.columns:
        df_personal[col] = df_personal[col].apply(remove_illegal_chars)

    with pd.ExcelWriter(output_path, engine='xlsxwriter') as writer:
        df_professional.to_excel(writer, sheet_name='Empresariais', index=False)
        if not df_personal.empty:
            df_personal.to_excel(writer, sheet_name='Pessoais', index=False)
    
    # Salvar Relatório
    report = f"=== RELATÓRIO DE LIMPEZA ===\n" \
             f"Data: {pd.Timestamp.now().strftime('%d/%m/%Y')}\n" \
             f"Arquivo: {input_path}\n\n" \
             f"RESUMO:\n" \
             f"- Linhas originais: {orig_len}\n" \
             f"- Linhas na lista final (Empresariais): {len(df_professional)}\n" \
             f"- Linhas separadas (Contas Pessoais): {len(df_personal)}\n" \
             f"- Duplicatas removidas (por E-mail): {dupes_removed}\n" \
             f"- Emails inválidos removidos (org, gov, gupy): {banned_removed}\n" \
             f"- Colunas erradicadas: {empty_cols}\n" \
             f"- Nomes deixados em branco: {nomes_vazios}\n" \
             f"- E-mails 'unknown' " + ("incluídos" if keep_unknown else "removidos") + "\n\n" \
             f"PADRÕES IDENTIFICADOS:\n" \
             f"- Top Setores:\n"
             
    for k, v in top_setores.items():
        report += f"  * {k}: {v}\n"
        
    print(report)

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input', required=True)
    parser.add_argument('--output', required=True)
    parser.add_argument('--keep_unknown', action='store_true')
    args = parser.parse_args()
    
    clean_snovio_list(args.input, args.output, args.keep_unknown)
