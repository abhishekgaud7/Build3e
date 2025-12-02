const { ensureDatabaseUrl } = require('./util');
const { spawnSync } = require('child_process');

ensureDatabaseUrl();

const r = spawnSync('npx', ['ts-node-dev', '--respawn', '--transpile-only', 'src/main.ts'], { stdio: 'inherit', shell: true });
process.exit(r.status ?? 0);
