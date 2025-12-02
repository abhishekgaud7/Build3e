const { ensureDatabaseUrl } = require('./util');
const { spawnSync } = require('child_process');

ensureDatabaseUrl();

const r = spawnSync('npx', ['prisma', 'migrate', 'dev'], { stdio: 'inherit', shell: true });
process.exit(r.status ?? 0);
