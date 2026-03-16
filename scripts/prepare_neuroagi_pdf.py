
import os

md_path = r'c:\Users\leo.cauchioli\Desktop\aios-core-main\clients\NeuroAgi\ativos\CADENCIA_EMAILS.md'
desktop = os.path.join(os.environ['USERPROFILE'], 'Desktop')
pdf_path = os.path.join(desktop, 'CADENCIA_EMAILS_NeuroAgi.pdf')
temp_html = os.path.join(os.environ['TEMP'], 'neuroagi_temp.html')

with open(md_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Basic Markdown to HTML conversion for the PDF appearance
html_content = f"""
<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <style>
        body {{ font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; padding: 50px; color: #333; max-width: 800px; margin: auto; }}
        h1 {{ color: #1a1a1a; border-bottom: 2px solid #ff7a2f; padding-bottom: 10px; font-size: 28px; }}
        h2 {{ color: #2c3e50; margin-top: 40px; border-left: 5px solid #ff7a2f; padding-left: 15px; font-size: 22px; }}
        .header {{ margin-bottom: 40px; text-align: center; color: #7a7a92; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; }}
        .email-block {{ background: #f9f9f9; padding: 25px; border-radius: 8px; border: 1px solid #eee; margin-bottom: 30px; }}
        .subject {{ font-weight: bold; color: #ff7a2f; margin-bottom: 15px; display: block; }}
        hr {{ border: 0; border-top: 1px solid #eee; margin: 40px 0; }}
        p {{ margin-bottom: 15px; white-space: pre-wrap; }}
    </style>
</head>
<body>
    <div class="header">NeuroAgi - Cadência de Outbound</div>
    {content.replace('# ', '<h1>').replace('## ', '<h2>').replace('\n', '<br>')}
</body>
</html>
"""

# Refine content a bit
html_content = html_content.replace('<h2>', '</div><div class="email-block"><h2>').replace('</h2>', '</h2><span class="subject">')
# Close the last block and fix the first jump
html_content = html_content.replace('<h1>', '<h1>').replace('<br><br>', '<br>')

with open(temp_html, 'w', encoding='utf-8') as f:
    f.write(html_content)

print(f"TEMP_HTML:{temp_html}")
print(f"PDF_PATH:{pdf_path}")
