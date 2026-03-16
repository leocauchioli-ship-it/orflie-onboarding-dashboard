import pypdf
import os

files = [
    "c:/Users/leo.cauchioli/Desktop/aios-core-main/insumos/100M Offers - Alex Hormozi PT-BR.pdf",
    "c:/Users/leo.cauchioli/Desktop/aios-core-main/insumos/100M-Leads-by-Alex-Hormozi (1).pdf"
]

results = []

for f in files:
    print(f"--- Extracting {os.path.basename(f)} ---")
    try:
        reader = pypdf.PdfReader(f)
        # Extract middle pages and end pages for more "Hormozi" advice
        pages_to_read = [10, 20, 50, 100, 150]
        for p_idx in pages_to_read:
            if p_idx < len(reader.pages):
                text = reader.pages[p_idx].extract_text()
                results.append(f"Source: {os.path.basename(f)} - Page {p_idx}\n{text}\n")
    except Exception as e:
        print(f"Error reading {f}: {e}")

with open("c:/Users/leo.cauchioli/Desktop/aios-core-main/scripts/hormozi_deep_extract.txt", "w", encoding="utf-8") as out:
    out.write("\n".join(results))
print("Extraction complete.")
