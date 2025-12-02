const { ensureDatabaseUrl } = require('./util');
const { spawnSync } = require('child_process');

ensureDatabaseUrl();

const r = spawnSync('npx', ['prisma', 'generate'], { stdio: 'inherit', shell: true });
process.exit(r.status ?? 0);
