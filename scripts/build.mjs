import { cp, mkdir, rm, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = new URL('src/', root);
const output = new URL('dist/', root);
// Validate JavaScript before producing the deployment assets.
new vm.Script(await readFile(new URL('app.js', source), 'utf8'));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
console.log(`Build complete: ${fileURLToPath(output)}`);
