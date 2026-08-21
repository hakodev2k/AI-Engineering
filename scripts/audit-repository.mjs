#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import process from "node:process";
import { parser as pythonParser } from "@lezer/python";
import { parseDocument } from "yaml";

const root = resolve(import.meta.dirname, "..");
const strictCollections = process.argv.includes("--strict-collections");
const collections = [
  "Daily AI Engineering Kit",
  "Daily AI Engineering Security - Performance - Thinking",
  "Daily AI Role",
  "MCP-API",
  "Rules",
  "Skills",
];
const ignoredDirectories = new Set([".git", ".venv", "coverage", "dist", "node_modules", "__pycache__"]);
const errors = [];
const warnings = [];
const counters = { files: 0, markdown: 0, json: 0, yaml: 0, python: 0, links: 0, packages: 0 };

function reportCollectionGap(message) {
  (strictCollections ? errors : warnings).push(message);
}

function display(path) {
  return relative(root, path).split(sep).join("/");
}

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...walk(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

function childDirectories(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !ignoredDirectories.has(entry.name))
    .map((entry) => join(directory, entry.name));
}

function validateRequiredDocumentation() {
  for (const collection of collections) {
    const directory = join(root, collection);
    if (!existsSync(directory)) {
      errors.push(`missing collection: ${collection}`);
      continue;
    }
    if (!existsSync(join(directory, "README.md"))) errors.push(`missing collection README: ${collection}/README.md`);
    for (const packageDirectory of childDirectories(directory)) {
      counters.packages += 1;
      if (!existsSync(join(packageDirectory, "README.md"))) {
        reportCollectionGap(`missing package README: ${display(packageDirectory)}/README.md`);
      }
    }
  }
}

function validateIndexes() {
  for (const collection of ["Rules", "Skills"]) {
    for (const directory of childDirectories(join(root, collection))) {
      const indexPath = join(directory, "README.md");
      if (!existsSync(indexPath)) continue;
      const index = readFileSync(indexPath, "utf8");
      for (const entry of readdirSync(directory, { withFileTypes: true })) {
        if (!entry.isFile() || extname(entry.name) !== ".md" || entry.name === "README.md") continue;
        if (!index.includes(`](${entry.name})`)) {
          reportCollectionGap(`index does not link ${display(join(directory, entry.name))}`);
        }
      }
    }
  }
}

function validateMarkdown(path) {
  counters.markdown += 1;
  const content = readFileSync(path, "utf8");
  const h1Count = content.split(/\r?\n/).filter((line) => /^#\s+\S/.test(line)).length;
  if (h1Count === 0) warnings.push(`no H1 heading: ${display(path)}`);

  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of content.matchAll(linkPattern)) {
    let target = match[1].trim();
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    target = target.split(/\s+"/)[0];
    if (!target || /^(?:https?:|mailto:|#)/i.test(target)) continue;
    counters.links += 1;
    const pathPart = target.split("#", 1)[0];
    let decoded;
    try {
      decoded = decodeURIComponent(pathPart);
    } catch {
      errors.push(`invalid URL encoding in ${display(path)}: ${target}`);
      continue;
    }
    const resolved = resolve(dirname(path), decoded);
    if (!resolved.startsWith(root + sep) && resolved !== root) {
      errors.push(`link escapes repository in ${display(path)}: ${target}`);
    } else if (!existsSync(resolved)) {
      errors.push(`broken link in ${display(path)}: ${target}`);
    }
  }
}

function validateJson(path) {
  counters.json += 1;
  try {
    JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    errors.push(`invalid JSON in ${display(path)}: ${error.message}`);
  }
}

function validateYaml(path) {
  counters.yaml += 1;
  const document = parseDocument(readFileSync(path, "utf8"), { uniqueKeys: true });
  for (const error of document.errors) {
    errors.push(`invalid YAML in ${display(path)}: ${error.message.split("\n", 1)[0]}`);
  }
  for (const warning of document.warnings) {
    warnings.push(`YAML warning in ${display(path)}: ${warning.message.split("\n", 1)[0]}`);
  }
}

function validatePython(path) {
  counters.python += 1;
  const content = readFileSync(path, "utf8");
  const cursor = pythonParser.parse(content).cursor();
  do {
    if (cursor.type.isError) {
      const line = content.slice(0, cursor.from).split(/\r?\n/).length;
      errors.push(`invalid Python syntax in ${display(path)} at line ${line}`);
      return;
    }
  } while (cursor.next());
}

function validateMcpConnectors() {
  const connectorRoot = join(root, "MCP-API");
  const required = [".env.example", "README.md", "manifest.yaml", "package.json", "tsconfig.json", "src/server.ts"];
  for (const directory of childDirectories(connectorRoot)) {
    for (const item of required) {
      if (!existsSync(join(directory, item))) errors.push(`incomplete MCP connector ${display(directory)}: missing ${item}`);
    }
    const tests = join(directory, "tests");
    if (!existsSync(tests) || !statSync(tests).isDirectory()) {
      errors.push(`incomplete MCP connector ${display(directory)}: missing tests/`);
    }
    const packagePath = join(directory, "package.json");
    if (!existsSync(packagePath)) continue;
    try {
      const packageJson = JSON.parse(readFileSync(packagePath, "utf8"));
      for (const script of ["build", "start", "test"]) {
        if (!packageJson.scripts?.[script]) errors.push(`${display(packagePath)}: missing ${script} script`);
      }
      if (packageJson.engines?.node && !packageJson.engines.node.includes("20")) {
        warnings.push(`${display(packagePath)}: verify Node.js engine remains compatible with the workspace baseline`);
      }
    } catch {
      // The general JSON validator reports the parse failure.
    }
  }
}

validateRequiredDocumentation();
validateIndexes();
const files = walk(root);
counters.files = files.length;
for (const path of files) {
  if (extname(path) === ".md") validateMarkdown(path);
  if (extname(path) === ".json") validateJson(path);
  if ([".yaml", ".yml"].includes(extname(path))) validateYaml(path);
  if (extname(path) === ".py") validatePython(path);
}
validateMcpConnectors();

const report = {
  status: errors.length ? "failed" : "passed",
  checked: counters,
  errors,
  warnings,
};
console.log(JSON.stringify(report, null, 2));
process.exitCode = errors.length ? 1 : 0;
