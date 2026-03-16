import urllib.request

url = 'https://raw.githubusercontent.com/marketing-orflie/forms.onboarding/main/index.html'
raw = urllib.request.urlopen(url).read()

# The file has double-encoded UTF-8 characters.
# E.g. 'á' (UTF-8: c3 a1) was re-encoded as 'Ã¡' (UTF-8: c3 83 c2 a1)
# Fix: replace bad byte sequences with correct UTF-8 bytes

replacements_bytes = [
    # Lowercase accented
    (b'\xc3\x83\xc2\xa1', 'á'.encode('utf-8')),   # Ã¡ -> á
    (b'\xc3\x83\xc2\xa3', 'ã'.encode('utf-8')),   # Ã£ -> ã
    (b'\xc3\x83\xc2\xa7', 'ç'.encode('utf-8')),   # Ã§ -> ç
    (b'\xc3\x83\xc2\xa2', 'â'.encode('utf-8')),   # Ã¢ -> â
    (b'\xc3\x83\xc2\xa0', 'à'.encode('utf-8')),   # Ã  -> à
    (b'\xc3\x83\xc2\xa9', 'é'.encode('utf-8')),   # Ã© -> é
    (b'\xc3\x83\xc2\xaa', 'ê'.encode('utf-8')),   # Ãª -> ê
    (b'\xc3\x83\xc2\xa8', 'è'.encode('utf-8')),   # Ã¨ -> è
    (b'\xc3\x83\xc2\xad', 'í'.encode('utf-8')),   # Ã­ -> í
    (b'\xc3\x83\xc2\xb3', 'ó'.encode('utf-8')),   # Ã³ -> ó
    (b'\xc3\x83\xc2\xb4', 'ô'.encode('utf-8')),   # Ã´ -> ô
    (b'\xc3\x83\xc2\xb5', 'õ'.encode('utf-8')),   # Ãµ -> õ
    (b'\xc3\x83\xc2\xba', 'ú'.encode('utf-8')),   # Ãº -> ú
    (b'\xc3\x83\xc2\xbc', 'ü'.encode('utf-8')),   # Ã¼ -> ü
    # Uppercase accented
    (b'\xc3\x83\xc2\x81', 'Á'.encode('utf-8')),   # Ã\x81 -> Á
    (b'\xc3\x83\xc2\x80', 'À'.encode('utf-8')),   # À
    (b'\xc3\x83\xc2\x82', 'Â'.encode('utf-8')),   # Â
    (b'\xc3\x83\xc2\x83', 'Ã'.encode('utf-8')),   # Ã
    (b'\xc3\x83\xc2\x87', 'Ç'.encode('utf-8')),   # Ç
    (b'\xc3\x83\xc2\x89', 'É'.encode('utf-8')),   # É
    (b'\xc3\x83\xc2\x8a', 'Ê'.encode('utf-8')),   # Ê
    (b'\xc3\x83\xc2\x93', 'Ó'.encode('utf-8')),   # Ó
    (b'\xc3\x83\xc2\x94', 'Ô'.encode('utf-8')),   # Ô
    (b'\xc3\x83\xc2\x95', 'Õ'.encode('utf-8')),   # Õ
    (b'\xc3\x83\xc2\x9a', 'Ú'.encode('utf-8')),   # Ú
    (b'\xc3\x83\xc2\x9c', 'Ü'.encode('utf-8')),   # Ü
    # Special chars
    (b'\xc3\x82\xc2\xb7', '·'.encode('utf-8')),   # Â· -> ·
    (b'\xc3\x82\xc2\xba', 'º'.encode('utf-8')),   # Âº -> º
    (b'\xc3\x82\xc2\xaa', 'ª'.encode('utf-8')),   # Âª -> ª
    (b'\xc3\x82\xc2\xb0', '°'.encode('utf-8')),   # Â° -> °
    # Em dash and smart quotes (triple-encoded)
    (b'\xe2\x80\x9c\xc3\xa2\xc2\x80\xc2\x9c', '"'.encode('utf-8')),
    (b'\xc3\xa2\xc2\x80\xc2\x9d', '"'.encode('utf-8')),  # â€ -> "
    (b'\xc3\xa2\xc2\x80\xc2\x9c', '"'.encode('utf-8')),  # â€œ -> "
    (b'\xc3\xa2\xc2\x80\xc2\x93', '–'.encode('utf-8')),  # â€" -> –
    (b'\xc3\xa2\xc2\x80\xc2\x94', '—'.encode('utf-8')),  # â€" -> —
    (b'\xc3\xa2\xc2\x80\xc2\x98', "'".encode('utf-8')),  # â€˜ -> '
    (b'\xc3\xa2\xc2\x80\xc2\x99', "'".encode('utf-8')),  # â€™ -> '
    (b'\xc3\xa2\x86\x92', '→'.encode('utf-8')),  # â†' -> →
    (b'\xc3\xa2\x80\x93', '–'.encode('utf-8')),  # â€" -> –   (alternative encoding)
    # Emoji (triple encoded)
    (b'\xc3\xb0\xc5\xb8\x92\xa1', '💡'.encode('utf-8')),  # ðŸ'¡ -> 💡
    (b'\xc3\xb0\xc5\xb8\x94\x8a', '📊'.encode('utf-8')),  # ðŸ"Š -> 📊
    (b'\xc3\xa2\xc5\x93\x85', '✅'.encode('utf-8')),        # âœ… -> ✅
    # Fullwidth plus
    (b'\xef\xbc\x8b', '+'.encode('utf-8')),               # ï¼‹ -> +
]

content = raw
for bad, good in replacements_bytes:
    content = content.replace(bad, good)

# Decode and verify
text = content.decode('utf-8', errors='replace')

# Check results
import re
remaining_mojibake = re.findall(r'[Ã][^\x00-\x7f]', text)
print(f"Remaining mojibake patterns: {len(remaining_mojibake)}")
print("Sample fixed title:", text[text.find('Formul'):text.find('Formul')+30])

# Save to file
out_path = r'C:\Users\leo.cauchioli\Desktop\aios-core-main\index_fixed.html'
with open(out_path, 'w', encoding='utf-8') as f:
    f.write(text)

print(f"\nSaved to: {out_path}")
print(f"File size: {len(text)} chars")

# Show a sample of the fixed text
sample_start = text.find('<title>')
print("\nSample fixed text:")
print(text[sample_start:sample_start+200])
