import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import process from 'process';
import { execSync } from 'child_process';
import render from 'preact-render-to-string';

// import { gsap } from 'gsap';
// import { Draggable } from 'gsap/Draggable';
import { useGSAP } from '@gsap/react';

import * as preact from 'preact';
import * as preactHooks from 'preact/hooks';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const compiled = execSync('sh parenize.sh PREBUILD', {
  input: fs.readFileSync("src/main.paren"),
  encoding: 'utf8'
});

function rewriteToGlobalFunctions(code) {
  return code.replace(/function\s+(\w+)\s*\(([^)]*)\)\s*{([^}]*)}/g, 'global.$1 = function($2) {$3}');
}

const code2=rewriteToGlobalFunctions(compiled.replace('useGSAP', 'preactHooks.useEffect'));
eval(code2);

const dehydrated = render(preact.h(Game, null));

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const replaced = template.replace(
  `<script src="http://localhost:8080/skewer"></script>`,
  dehydrated
);

fs.writeFileSync(toAbsolute('dist/index.html'), replaced);
