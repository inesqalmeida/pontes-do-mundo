/*
  Auditoria simples de referências locais.

  Como usar:
  1. Ter Node.js instalado.
  2. Abrir terminal na pasta do projecto.
  3. Executar: node ferramentas/auditoria-referencias.js

  O script procura referências a assets, CSS e JS nos ficheiros principais
  e avisa se algum caminho local não existir.
*/

const fs = require('fs');
const path = require('path');

const raiz = path.resolve(__dirname, '..');
const ficheiros = [
  'index.html',
  'css/style.css',
  'css/mini-jogos.css',
  'js/script.js',
  'js/mini-jogos.js'
];

const padroes = [
  /(?:src|href|data-avatar)="([^"]+)"/g,
  /url\(["']?([^"')]+)["']?\)/g,
  /["'`]((?:\.\.\/)?assets\/[^"'`]+?)["'`]/g,
  /["'`](css\/[^"'`]+?)["'`]/g,
  /["'`](js\/[^"'`]+?)["'`]/g
];

const ignorar = [/^https?:\/\//, /^mailto:/, /^#/, /^$/];
const referencias = new Set();

for (const ficheiro of ficheiros) {
  const absoluto = path.join(raiz, ficheiro);
  if (!fs.existsSync(absoluto)) continue;

  const conteudo = fs.readFileSync(absoluto, 'utf8');
  const pastaBase = path.dirname(absoluto);

  for (const padrao of padroes) {
    let match;
    while ((match = padrao.exec(conteudo))) {
      const ref = match[1].trim();
      if (ref.includes('${')) continue;
      if (ignorar.some((p) => p.test(ref))) continue;
      if (ref.includes('fonts.googleapis.com') || ref.includes('fonts.gstatic.com')) continue;

      const resolvido = ref.startsWith('../')
        ? path.resolve(pastaBase, ref)
        : path.resolve(raiz, ref);

      referencias.add(`${ref}::${resolvido}`);
    }
  }
}

let falhas = 0;
for (const item of [...referencias].sort()) {
  const [ref, resolvido] = item.split('::');
  if (!fs.existsSync(resolvido)) {
    falhas += 1;
    console.log(`FALTA: ${ref}`);
  }
}

if (falhas === 0) {
  console.log('Auditoria concluída: nenhuma referência local em falta encontrada nos ficheiros principais.');
} else {
  console.log(`Auditoria concluída: ${falhas} referência(s) local(is) em falta.`);
  process.exitCode = 1;
}
