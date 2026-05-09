import fs from 'fs';
const required = [
  'package.json', 'app/page.js', 'app/login/page.js', 'app/dashboard/page.js',
  'app/api/generate/route.js', 'app/api/billing/checkout/route.js',
  'app/api/billing/webhook/route.js', 'supabase/schema.sql', '.env.example'
];
let ok = true;
for (const file of required) {
  if (!fs.existsSync(file)) { console.error('Missing:', file); ok = false; }
}
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
if (!pkg.dependencies?.next) { console.error('Missing next dependency'); ok = false; }
console.log(ok ? 'Healthcheck passed.' : 'Healthcheck failed.');
process.exit(ok ? 0 : 1);
