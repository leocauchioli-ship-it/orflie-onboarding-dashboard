import pandas as pd
import sys

file_path = "insumos/smartvale-gest-rh-emp50a1k-geral.xlsx"

try:
    df = pd.read_excel(file_path)
    
    print(f"Arquivo recebido. {len(df)} linhas, {len(df.columns)} colunas. Iniciando análise...\n")
    
    # Check null columns
    null_cols = df.columns[df.isnull().all()].tolist()
    if null_cols:
        print("Colunas 100% vazias identificadas (marcadas para remoção automática):")
        for col in null_cols:
            print(f" - {col}")
    
    # Check "Status do e-mail"
    if 'Status do e-mail' in df.columns:
        status_counts = df['Status do e-mail'].value_counts()
        print("\nDistribuição de Status de E-mail:")
        for status, count in status_counts.items():
            pct = (count / len(df)) * 100
            print(f" - {status}: {count} ({pct:.1f}%)")
            
        if 'unknown' in status_counts:
            unknown_count = status_counts['unknown']
            print(f"\n❓ PERGUNTA: Encontrei {unknown_count} e-mails com status 'unknown'. Deseja incluí-los na lista final ou apenas os 'valid'?")
            
    print("\nAguardando confirmação para prosseguir com a Limpeza Profunda (Remoção de Duplicatas por Hierarquia, Filtro de Nomes, etc).")
    
except Exception as e:
    print(f"Erro ao analisar arquivo: {e}")
