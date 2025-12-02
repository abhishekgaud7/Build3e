const { ensureDatabaseUrl } = require('./util');
const { spawnSync } = require('child_process');

ensureDatabaseUrl();

const m = spawnSync('npx', ['prisma', 'migrate', 'deploy'], { stdio: 'inherit', shell: true });
if ((m.status ?? 0) !== 0) process.exit(m.status ?? 1);

const r = spawnSync('node', ['dist/main.js'], { stdio: 'inherit', shell: true });
process.exit(r.status ?? 0);
