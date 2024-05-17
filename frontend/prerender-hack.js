/*
  This script post-processes the vite build by pre-rendering "dehydrated" HTML
  using Preact, and then injecting it into the built HTML file with a string
  substitution. I thought that was kind of hacky but it's the way the official
  Vite Vue plugin does it:

  https://github.com/vitejs/vite-plugin-vue/blob/main/playground/ssr-vue/prerender.js

  The way this is implemented is absolutely horrendous, since it shells out to
  compile the Parenscript and then evals (!!!) it, but it does work. For now.
 */
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';
import process from 'process';
import { execSync } from 'child_process';
import render from 'preact-render-to-string';

import { useGSAP } from '@gsap/react';

import * as preact from 'preact';
import * as preactHooks from 'preact/hooks';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const compiled = execSync('sh parenize.sh PREBUILD', {
  input: fs.readFileSync("src/main.paren"),
  encoding: 'utf8'
});

const code2 = compiled.replace('useGSAP', 'preactHooks.useEffect');
eval(code2+'global.Game = Game;');

const dehydrated = render(preact.h(Game, null));

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const replaced = template.replace(
  `<script src="http://localhost:8080/skewer"></script>`,
  dehydrated
);

fs.writeFileSync(toAbsolute('dist/index.html'), replaced);
