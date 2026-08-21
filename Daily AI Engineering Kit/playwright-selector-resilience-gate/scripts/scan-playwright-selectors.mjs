#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

function die(msg, code = 2) { console.error(msg); process.exit(code); }
function arg(name, fallback = null) {
  const i = process.argv.indexOf(name);
  return i >= 0 && i + 1 < process.argv.length ? process.argv[i + 1] : fallback;
}
const repo = path.resolve(arg('--repo', '.'));
const policyPath = path.resolve(arg('--policy', 'config/selector-policy.json'));
const output = path.resolve(arg('--output', 'selector-inventory.json'));
if (!fs.existsSync(repo) || !fs.statSync(repo).isDirectory()) die(`Repository not found: ${repo}`);
if (!fs.existsSync(policyPath)) die(`Policy not found: ${policyPath}`);
const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
const excludes = new Set(policy.scan.exclude_dirs || []);
const maxBytes = Number(policy.scan.max_file_bytes || 1048576);
const testName = /\.(spec|test|e2e)\.(ts|js)$/i;

function revision() {
  try { return execFileSync('git', ['-C', repo, 'rev-parse', 'HEAD'], {encoding:'utf8'}).trim(); }
  catch { return 'unknown'; }
}
function walk(dir, out = []) {
  for (const ent of fs.readdirSync(dir, {withFileTypes:true})) {
    if (ent.isDirectory() && excludes.has(ent.name)) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(p, out);
    else if (testName.test(ent.name) && fs.statSync(p).size <= maxBytes) out.push(p);
  }
  return out;
}
function classify(kind, expression) {
  const w = policy.weights || {};
  let score = 0;
  const evidence = [];
  if ((policy.risk.preferred_kinds || []).includes(kind)) evidence.push('preferred-semantic-kind');
  if (kind === 'getByText') { score += w.text_selector || 0; evidence.push('text-coupled'); }
  if (kind === 'locator-css') { score += w.css_selector || 0; evidence.push('css-structure-coupled'); }
  if (kind === 'locator-xpath') { score += w.xpath_selector || 0; evidence.push('xpath-structure-coupled'); }
  for (const raw of policy.risk.blocked_patterns || []) {
    const rx = new RegExp(raw, 'i');
    if (rx.test(expression)) { score += w.positional_selector || 0; evidence.push(`fragile-pattern:${raw}`); }
  }
  let risk = 'low';
  if (score >= Number(policy.thresholds.blocked_score || 8)) risk = 'critical';
  else if (score >= Number(policy.thresholds.review_required_score || 4)) risk = 'high';
  else if (score > 0) risk = 'medium';
  return {score, risk, evidence};
}
const methodRx = /(getByRole|getByLabel|getByPlaceholder|getByTestId|getByText|locator)\s*\(([^\n;]*)\)/g;
const selectors = [];
for (const file of walk(repo)) {
  const rel = path.relative(repo, file).replaceAll(path.sep, '/');
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    methodRx.lastIndex = 0;
    let m;
    while ((m = methodRx.exec(line)) !== null) {
      let kind = m[1];
      const args = m[2].trim();
      const expression = `${kind}(${args})`;
      if (kind === 'locator') {
        const first = args.match(/^\s*(['"`])([\s\S]*?)\1/);
        const value = first ? first[2] : args;
        kind = value.startsWith('//') || value.startsWith('xpath=') ? 'locator-xpath' : 'locator-css';
      }
      const c = classify(kind, expression);
      const id = crypto.createHash('sha256').update(`${rel}:${idx+1}:${expression}`).digest('hex').slice(0, 20);
      selectors.push({id, file:rel, line:idx+1, kind, expression, risk:c.risk, score:c.score, evidence:c.evidence, runtime_probe:null});
    }
  }
}
const result = {version:'1.0.0', generated_at:new Date().toISOString(), repository_revision:revision(), selectors};
fs.mkdirSync(path.dirname(output), {recursive:true});
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(JSON.stringify({status:'ok', selector_count:selectors.length, output}, null, 2));
