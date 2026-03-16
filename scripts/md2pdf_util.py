import sys
from xhtml2pdf import pisa
import markdown2

def convert_md_to_pdf(md_path, pdf_path):
    with open(md_path, 'r', encoding='utf-8') as f:
        md_text = f.read()

    html_content = markdown2.markdown(md_text, extras=['tables', 'gfm', 'fenced-code-blocks'])

    css = """
    @page {
        size: a4 portrait;
        @frame content_frame {
            left: 50pt; width: 495pt; top: 50pt; height: 742pt;
        }
    }
    body {
        font-family: Helvetica, Arial, sans-serif;
        color: #334155;
        line-height: 1.6;
        font-size: 11pt;
    }
    h1 {
        color: #1e3a8a;
        font-size: 22pt;
        border-bottom: 2pt solid #3b82f6;
        padding-bottom: 8pt;
        margin-bottom: 18pt;
    }
    h2 {
        color: #1e40af;
        font-size: 15pt;
        margin-top: 18pt;
        margin-bottom: 8pt;
        border-bottom: 0.5pt solid #e2e8f0;
    }
    h3 {
        color: #2563eb;
        font-size: 12pt;
        margin-top: 12pt;
    }
    table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 10pt;
        margin-bottom: 15pt;
    }
    th {
        background-color: #f1f5f9;
        color: #1e40af;
        text-align: left;
        font-weight: bold;
        padding: 8pt;
        border: 1pt solid #cbd5e1;
    }
    td {
        padding: 8pt;
        border: 1pt solid #e2e8f0;
    }
    ul, ol {
        margin-left: 20pt;
    }
    li {
        margin-bottom: 4pt;
    }
    .footer {
        text-align: center;
        font-size: 9pt;
        color: #94a3b8;
        margin-top: 30pt;
    }
    """

    full_html = f"""
    <html>
    <head>
        <style>{css}</style>
    </head>
    <body>
        <p style="text-align: right; color: #64748b; font-size: 10pt;">Documento Confidencial | Orflie</p>
        {html_content}
        <div class="footer">
            <p>Gerado pelo Synkra AIOS - Orion Cluster</p>
        </div>
    </body>
    </html>
    """

    with open(pdf_path, "w+b") as result_file:
        pisa_status = pisa.CreatePDF(full_html, dest=result_file)

    if not pisa_status.err:
        print(f"PDF gerado: {pdf_path}")
    else:
        print(f"Erro: {pisa_status.err}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python md2pdf_util.py <input.md> <output.pdf>")
        sys.exit(1)
    convert_md_to_pdf(sys.argv[1], sys.argv[2])
