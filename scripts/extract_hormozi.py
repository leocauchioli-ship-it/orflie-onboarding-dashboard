import pypdf
import os

files = [
    "c:/Users/leo.cauchioli/Desktop/aios-core-main/insumos/100M Offers - Alex Hormozi PT-BR.pdf",
    "c:/Users/leo.cauchioli/Desktop/aios-core-main/insumos/100M-Leads-by-Alex-Hormozi (1).pdf"
]

for f in files:
    print(f"--- {os.path.basename(f)} ---")
    try:
        reader = pypdf.PdfReader(f)
        # Extract first 5 pages for summary
        for i in range(min(10, len(reader.pages))):
            text = reader.pages[i].extract_text()
            print(f"Page {i+1}:")
            print(text[:1000]) # Print first 1000 chars
            print("\n")
    except Exception as e:
        print(f"Error reading {f}: {e}")
