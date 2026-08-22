// Repository-wide, credential-free production-readiness checks for every connector.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname);
const rootPackage = readJson(join(root, 'package.json'));
const ignoredDirectories = new Set(['node_modules', 'dist', 'scripts']);
const connectorDirectories = readdirSync(root, { withFileTypes: true })
  .filter(entry => entry.isDirectory() && !ignoredDirectories.has(entry.name))
  .filter(entry => existsSync(join(root, entry.name, 'package.json')))
  .map(entry => entry.name)
  .sort();
const workspaces = [...rootPackage.workspaces].sort();
const errors = [];

if (JSON.stringify(connectorDirectories) !== JSON.stringify(workspaces)) {
  errors.push(`workspaces must exactly match connector directories; expected ${connectorDirectories.join(', ')}`);
}

for (const connector of connectorDirectories) {
  validateConnector(connector);
}

if (errors.length > 0) {
  console.error(JSON.stringify({ status: 'failed', connectors: connectorDirectories.length, errors }, null, 2));
  process.exitCode = 1;
} else {
  console.log(JSON.stringify({ status: 'passed', connectors: connectorDirectories.length }, null, 2));
}

function validateConnector(connector) {
  const directory = join(root, connector);
  const packagePath = join(directory, 'package.json');
  const packageJson = readJson(packagePath);
  const requiredFiles = ['.env.example', 'README.md', 'manifest.yaml', 'package.json'];

  for (const file of requiredFiles) {
    if (!existsSync(join(directory, file))) errors.push(`${connector}: missing ${file}`);
  }

  if (packageJson.private !== true) errors.push(`${connector}: package must be private`);
  if (packageJson.type !== 'module') errors.push(`${connector}: package must use ESM`);
  if (!packageJson.engines?.node) errors.push(`${connector}: package must declare a Node.js engine`);

  for (const script of ['start', 'test', 'typecheck']) {
    if (!packageJson.scripts?.[script]) errors.push(`${connector}: missing ${script} script`);
  }
  if (packageJson.scripts?.test?.startsWith('vitest') && !packageJson.scripts.test.includes('--dir tests')) {
    errors.push(`${connector}: Vitest must be restricted to the source tests directory`);
  }

  const sdkV1 = packageJson.dependencies?.['@modelcontextprotocol/sdk'];
  if (sdkV1 && !/^\^?1\.(?:[3-9]\d|2[6-9])\./.test(sdkV1)) {
    errors.push(`${connector}: @modelcontextprotocol/sdk must include the cross-client isolation security fix (>=1.26.0)`);
  }

  const tsconfig = join(directory, 'tsconfig.json');
  if (existsSync(tsconfig)) {
    if (!packageJson.scripts?.build) errors.push(`${connector}: TypeScript package is missing build script`);
    if (packageJson.scripts?.start?.includes('tsx') || /src[/\\][^ ]+\.ts(?:\s|$)/.test(packageJson.scripts?.start ?? '')) {
      errors.push(`${connector}: production start script must execute compiled JavaScript`);
    }
  }

  const tests = join(directory, 'tests');
  if (!existsSync(tests) || readdirSync(tests).filter(name => /\.test\.(?:ts|mjs)$/.test(name)).length === 0) {
    errors.push(`${connector}: missing automated tests`);
  }

  const manifestPath = join(directory, 'manifest.yaml');
  if (existsSync(manifestPath)) {
    const manifest = readFileSync(manifestPath, 'utf8');
    if (!/^\s*(?:tools|capabilities)\s*:/m.test(manifest)) errors.push(`${connector}: manifest does not declare capabilities`);
    if (!/\b(?:read|write|high_risk|destructive)\b/i.test(manifest)) errors.push(`${connector}: manifest does not classify tool risk`);
  }

  const envPath = join(directory, '.env.example');
  if (existsSync(envPath)) {
    const env = readFileSync(envPath, 'utf8');
    for (const line of env.split(/\r?\n/)) {
      if (!line || line.startsWith('#')) continue;
      const [key, ...parts] = line.split('=');
      const value = parts.join('=').trim();
      if (/(?:TOKEN|SECRET|API_KEY|PRIVATE_KEY|PASSWORD)$/i.test(key.trim()) && value && !/^<[^>]+>$/.test(value)) {
        errors.push(`${connector}: ${key.trim()} must use an angle-bracket placeholder in .env.example`);
      }
    }
  }

  const sourceDirectory = join(directory, 'src');
  if (existsSync(sourceDirectory)) {
    const source = readdirSync(sourceDirectory)
      .filter(name => /\.(?:ts|mjs)$/.test(name))
      .map(name => readFileSync(join(sourceDirectory, name), 'utf8'))
      .join('\n');
    const manifest = existsSync(manifestPath) ? readFileSync(manifestPath, 'utf8') : '';
    if (/\b(?:write|high_risk|destructive)\b/i.test(manifest) && !/approv/i.test(source)) {
      errors.push(`${connector}: risky tools require an approval control in source`);
    }
    if (/(?:fetch\(|\.request\(|new WebClient\(|new Stripe\(|twilio\()/i.test(source) && !/(?:timeout|AbortSignal|AbortController)/i.test(source)) {
      errors.push(`${connector}: upstream calls require a bounded timeout`);
    }
    const serverSource = readdirSync(sourceDirectory)
      .filter(name => /^server\.(?:ts|mjs)$/.test(name))
      .map(name => readFileSync(join(sourceDirectory, name), 'utf8'))
      .join('\n');
    if (serverSource && !(/SIGINT/.test(serverSource) && /SIGTERM/.test(serverSource)) && !/serveStdio/.test(serverSource)) {
      errors.push(`${connector}: stdio server must close gracefully on SIGINT and SIGTERM`);
    }
  }
}

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch (error) {
    errors.push(`${path}: invalid JSON: ${error.message}`);
    return {};
  }
}
