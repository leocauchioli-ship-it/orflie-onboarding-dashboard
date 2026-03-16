import pypdf
import os

pdf_file = "c:/Users/leo.cauchioli/Desktop/aios-core-main/insumos/$100M Money Models - How To Make Money_ pt-BR_251009_213857.pdf"

print(f"--- Extracting {os.path.basename(pdf_file)} ---")
try:
    reader = pypdf.PdfReader(pdf_file)
    content = []
    # Extract first 30 pages to get the core models
    for i in range(min(30, len(reader.pages))):
        text = reader.pages[i].extract_text()
        content.append(f"Page {i+1}:\n{text}\n")
    
    with open("c:/Users/leo.cauchioli/Desktop/aios-core-main/scripts/money_models_extract.txt", "w", encoding="utf-8") as out:
        out.write("\n".join(content))
    print("Extraction complete.")
except Exception as e:
    print(f"Error reading {pdf_file}: {e}")
