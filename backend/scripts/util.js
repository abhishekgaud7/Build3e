const path = require('path');
const dotenv = require('dotenv');

function ensureDatabaseUrl() {
  dotenv.config({ path: path.resolve(__dirname, '../.env') });
  const ref = process.env.SUPABASE_PROJECT_REF;
  const pwd = process.env.SUPABASE_DB_PASSWORD;
  if (!process.env.DATABASE_URL && ref && pwd) {
    process.env.DATABASE_URL = `postgresql://postgres:${encodeURIComponent(pwd)}@db.${ref}.supabase.co:5432/postgres?sslmode=require`;
  }
  return process.env.DATABASE_URL || '';
}

module.exports = { ensureDatabaseUrl };
