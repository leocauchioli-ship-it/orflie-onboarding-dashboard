const fs = require('fs');
const target = 'c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\.aios-core\\development\\agents\\aios-business-generator.md';
const files = [
  'c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\insumos\\PROMPT DETALHADO PARA GERAR O “DNA DA EMPRESA”.md',
  'c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\insumos\\GERAÇÃO DE DNA PROFUNDO A PARTIR DE TRANSCRIÇÃO.md',
  'c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\insumos\\E-MAIL BASEADO EM ICP E DNA.md',
  'c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\insumos\\APRESENTAÇÃO COMERCIAL BASEADA NO DNA PROFUNDO.md',
  'c:\\Users\\leo.cauchioli\\Desktop\\aios-core-main\\insumos\\META-PROMPT — PITCH MASTER & PLAYBOOK COMERCIAL.md'
];

for (const f of files) {
  try {
    const content = fs.readFileSync(f, 'utf8');
    fs.appendFileSync(target, `\n\n---\n\n### ${f.split('\\').pop()}\n\n` + content);
    console.log(`Merged ${f}`);
  } catch (e) {
    console.error(`Error merging ${f}:`, e);
  }
}
