#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { basename, dirname, extname, join, relative, resolve, sep } from "node:path";
import process from "node:process";
import Ajv2020 from "ajv/dist/2020.js";

const repositoryRoot = resolve(import.meta.dirname, "..");
const strict = process.argv.includes("--strict");
const packageCollections = [
  "Daily AI Engineering Kit",
  "Daily AI Engineering Security - Performance - Thinking",
  "Daily AI Role",
];
const documentCollections = ["Rules", "Skills"];
const ignoredDirectories = new Set([".git", ".venv", "__pycache__", "coverage", "dist", "node_modules"]);
const scriptExtensions = new Set([".js", ".mjs", ".ps1", ".py", ".sh", ".ts"]);
const packagePathPrefixes = [
  "checklists/",
  "config/",
  "evidence/",
  "examples/",
  "fixtures/",
  "hooks/",
  "knowledge/",
  "metrics/",
  "rules/",
  "schemas/",
  "scripts/",
  "skills/",
  "subagents/",
  "templates/",
  "tests/",
  "workflows/",
];
const externalPythonPackages = new Map([
  ["anthropic", "anthropic"],
  ["cryptography", "cryptography"],
  ["fastapi", "fastapi"],
  ["httpx", "httpx"],
  ["jsonschema", "jsonschema"],
  ["numpy", "numpy"],
  ["openai", "openai"],
  ["pandas", "pandas"],
  ["pydantic", "pydantic"],
  ["pytest", "pytest"],
  ["redis", "redis"],
  ["requests", "requests"],
  ["tiktoken", "tiktoken"],
  ["yaml", "pyyaml"],
]);

const errors = [];
const warnings = [];
const counters = {
  packages: 0,
  catalogEntries: 0,
  disciplines: 0,
  contentDocuments: 0,
  markdownLinks: 0,
  referencedPaths: 0,
  scripts: 0,
  schemas: 0,
  schemaExamples: 0,
  schemaReferences: 0,
};

function display(path) {
  return relative(repositoryRoot, path).split(sep).join("/");
}

function walk(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isSymbolicLink()) {
      errors.push(`symbolic link is not portable: ${display(path)}`);
    } else if (entry.isDirectory()) {
      files.push(...walk(path));
    } else if (entry.isFile()) {
      files.push(path);
    }
  }
  return files;
}

function childDirectories(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !ignoredDirectories.has(entry.name))
    .map((entry) => join(directory, entry.name));
}

function isInside(path, boundary) {
  const normalizedPath = resolve(path);
  const normalizedBoundary = resolve(boundary);
  return normalizedPath === normalizedBoundary || normalizedPath.startsWith(`${normalizedBoundary}${sep}`);
}

function decodeLinkTarget(rawTarget) {
  let target = rawTarget.trim();
  if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
  target = target.split(/\s+["']/u, 1)[0];
  const pathPart = target.split("#", 1)[0];
  if (!pathPart || /^(?:https?:|mailto:|#)/iu.test(target)) return null;
  try {
    return decodeURIComponent(pathPart);
  } catch {
    return undefined;
  }
}

function validatePortableMarkdownLinks(markdownPath, copyBoundary) {
  const content = readFileSync(markdownPath, "utf8");
  const linkPattern = /!?\[[^\]]*\]\(([^)]+)\)/gu;
  for (const match of content.matchAll(linkPattern)) {
    const decoded = decodeLinkTarget(match[1]);
    if (decoded === null) continue;
    counters.markdownLinks += 1;
    if (decoded === undefined) {
      errors.push(`invalid URL encoding in ${display(markdownPath)}: ${match[1]}`);
      continue;
    }
    const resolved = resolve(dirname(markdownPath), decoded);
    if (!isInside(resolved, copyBoundary)) {
      errors.push(`relative link leaves supported copy unit in ${display(markdownPath)}: ${match[1]}`);
    } else if (!existsSync(resolved)) {
      errors.push(`broken link in ${display(markdownPath)}: ${match[1]}`);
    }
  }
}

function validateReadmePathReferences(packageDirectory, readmeContent) {
  const inlineCodePattern = /`([^`\r\n]+)`/gu;
  const seen = new Set();
  for (const match of readmeContent.matchAll(inlineCodePattern)) {
    let candidate = match[1].trim().replaceAll("\\", "/");
    if (!packagePathPrefixes.some((prefix) => candidate.startsWith(prefix))) continue;
    candidate = candidate.replace(/[.,;:]$/u, "");
    if (!candidate || /[<>*?{}|]/u.test(candidate) || candidate.includes("..")) continue;
    if (/\s/u.test(candidate)) continue;
    if (seen.has(candidate)) continue;
    seen.add(candidate);
    counters.referencedPaths += 1;
    const resolved = resolve(packageDirectory, candidate);
    if (!isInside(resolved, packageDirectory)) {
      errors.push(`README path leaves package in ${display(packageDirectory)}: ${candidate}`);
    } else if (!existsSync(resolved)) {
      errors.push(`README references missing package path in ${display(packageDirectory)}: ${candidate}`);
    }
  }
}

function hasHeading(content, expression) {
  return content
    .split(/\r?\n/u)
    .some((line) => /^#{2,6}\s+\S/u.test(line) && expression.test(line.replace(/^#{2,6}\s+/u, "")));
}

function importedExternalModules(files) {
  const modules = new Set();
  for (const path of files.filter((file) => extname(file).toLowerCase() === ".py")) {
    const content = readFileSync(path, "utf8");
    for (const line of content.split(/\r?\n/u)) {
      const match = line.match(/^\s*(?:from|import)\s+([A-Za-z_][A-Za-z0-9_]*)/u);
      if (match && externalPythonPackages.has(match[1])) modules.add(match[1]);
    }
  }
  return modules;
}

function packageDeclaresPythonDependency(packageDirectory, readmeContent, distributionName) {
  const declarations = ["requirements.txt", "requirements-dev.txt", "pyproject.toml"]
    .map((name) => join(packageDirectory, name))
    .filter(existsSync)
    .map((path) => readFileSync(path, "utf8"));
  declarations.push(readmeContent);
  const normalizedName = distributionName.toLowerCase().replaceAll("-", "[-_]");
  const dependencyPattern = new RegExp(`(?:^|[^a-z0-9_-])${normalizedName}(?:[^a-z0-9_-]|$)`, "iu");
  return declarations.some((content) => dependencyPattern.test(content));
}

function validateSchemaReferences(packageDirectory, schemaPath, value) {
  if (Array.isArray(value)) {
    for (const item of value) validateSchemaReferences(packageDirectory, schemaPath, item);
    return;
  }
  if (!value || typeof value !== "object") return;
  if (typeof value.$ref === "string" && !value.$ref.startsWith("#")) {
    counters.schemaReferences += 1;
    const reference = value.$ref.split("#", 1)[0];
    if (/^(?:https?:|urn:)/iu.test(reference)) {
      warnings.push(`schema relies on an external reference in ${display(schemaPath)}: ${value.$ref}`);
    } else {
      let decoded;
      try {
        decoded = decodeURIComponent(reference);
      } catch {
        errors.push(`invalid schema reference encoding in ${display(schemaPath)}: ${value.$ref}`);
        return;
      }
      const resolved = resolve(dirname(schemaPath), decoded);
      if (!isInside(resolved, packageDirectory)) {
        errors.push(`schema reference leaves package in ${display(schemaPath)}: ${value.$ref}`);
      } else if (!existsSync(resolved)) {
        errors.push(`schema reference is missing in ${display(schemaPath)}: ${value.$ref}`);
      }
    }
  }
  for (const child of Object.values(value)) validateSchemaReferences(packageDirectory, schemaPath, child);
}

function validatePackage(packageDirectory) {
  counters.packages += 1;
  const readmePath = join(packageDirectory, "README.md");
  if (!existsSync(readmePath)) {
    errors.push(`missing package README: ${display(readmePath)}`);
    return;
  }

  const readmeContent = readFileSync(readmePath, "utf8");
  const files = walk(packageDirectory);
  for (const path of files.filter((file) => extname(file).toLowerCase() === ".md")) {
    validatePortableMarkdownLinks(path, packageDirectory);
  }
  validateReadmePathReferences(packageDirectory, readmeContent);

  const scripts = files.filter((file) => {
    if (!scriptExtensions.has(extname(file).toLowerCase())) return false;
    const path = display(file);
    return /(?:^|\/)scripts\//u.test(path) || /(?:^|\/)hooks\//u.test(path);
  });
  counters.scripts += scripts.length;
  for (const script of scripts) {
    const relativePath = relative(packageDirectory, script).split(sep).join("/");
    const basename = relativePath.split("/").at(-1);
    if (!readmeContent.includes(relativePath) && !readmeContent.includes(basename)) {
      errors.push(`package README does not document script: ${display(script)}`);
    }
  }

  if (scripts.length > 0) {
    if (!hasHeading(readmeContent, /(?:usage|quick start|run|integration)/iu)) {
      warnings.push(`executable package lacks a usage/integration heading: ${display(packageDirectory)}`);
    }
    if (!hasHeading(readmeContent, /(?:validat|verif|test|self-check)/iu)) {
      warnings.push(`executable package lacks a verification heading: ${display(packageDirectory)}`);
    }
  }

  for (const moduleName of importedExternalModules(files)) {
    const distributionName = externalPythonPackages.get(moduleName);
    if (!packageDeclaresPythonDependency(packageDirectory, readmeContent, distributionName)) {
      errors.push(
        `package imports ${moduleName} but lacks a package-local ${distributionName} dependency declaration: ${display(packageDirectory)}`,
      );
    }
  }

  const schemas = files.filter((file) => /\.schema\.json$/iu.test(file));
  counters.schemas += schemas.length;
  if (schemas.length > 0) {
    for (const schemaPath of schemas) {
      try {
        validateSchemaReferences(packageDirectory, schemaPath, JSON.parse(readFileSync(schemaPath, "utf8")));
      } catch {
        // The repository JSON audit reports parse errors with their source path.
      }
    }
    const examples = files.filter((file) => {
      if (extname(file).toLowerCase() !== ".json" || /\.schema\.json$/iu.test(file)) return false;
      const localPath = relative(packageDirectory, file).split(sep).join("/");
      return /(?:^|\/)(?:examples?|fixtures?|tests?)(?:\/|$)/iu.test(localPath) || /(?:example|sample|fixture|valid)/iu.test(localPath);
    });
    if (examples.length === 0) {
      warnings.push(`package has JSON schema but no local JSON example or fixture: ${display(packageDirectory)}`);
    }

    let exampleValidator;
    try {
      exampleValidator = new Ajv2020({ allErrors: true, logger: false, strict: false, validateFormats: false });
      for (const schemaPath of schemas) {
        const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
        exampleValidator.addSchema(schema, schema.$id || basename(schemaPath));
      }
    } catch (error) {
      errors.push(`cannot load package schemas in ${display(packageDirectory)}: ${error.message}`);
    }

    for (const schemaPath of schemas) {
      const schemaStem = basename(schemaPath).replace(/\.schema\.json$/iu, "");
      const matchingExamples = examples.filter((examplePath) => {
        const exampleStem = basename(examplePath).replace(/\.(?:example|fixture|sample|valid)\.json$/iu, "");
        return exampleStem === schemaStem && examplePath !== schemaPath;
      });
      for (const examplePath of matchingExamples) {
        counters.schemaExamples += 1;
        try {
          const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
          const example = JSON.parse(readFileSync(examplePath, "utf8"));
          if (!exampleValidator) continue;
          const validate = exampleValidator.getSchema(schema.$id || basename(schemaPath));
          if (!validate) throw new Error("schema was not registered by the validator");
          if (!validate(example)) {
            const details = validate.errors
              ?.map((error) => `${error.instancePath || "/"} ${error.message}`)
              .join("; ");
            errors.push(`schema example is invalid: ${display(examplePath)} against ${display(schemaPath)}: ${details}`);
          }
        } catch (error) {
          errors.push(`cannot validate schema example ${display(examplePath)} against ${display(schemaPath)}: ${error.message}`);
        }
      }
    }
  }
}

function validatePackageCatalog(collectionDirectory) {
  const catalogPath = join(collectionDirectory, "CATALOG.md");
  const collectionReadmePath = join(collectionDirectory, "README.md");
  if (!existsSync(catalogPath)) {
    errors.push(`missing collection package catalog: ${display(catalogPath)}`);
    return;
  }
  const catalogContent = readFileSync(catalogPath, "utf8");
  validatePortableMarkdownLinks(catalogPath, collectionDirectory);
  if (!existsSync(collectionReadmePath) || !readFileSync(collectionReadmePath, "utf8").includes("CATALOG.md")) {
    errors.push(`collection README does not link its catalog: ${display(collectionReadmePath)}`);
  }
  for (const packageDirectory of childDirectories(collectionDirectory)) {
    const packageName = basename(packageDirectory);
    const escapedPackageName = packageName.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
    const linkPattern = new RegExp(`\\]\\((?:\\./)?${escapedPackageName}/?\\)`, "u");
    if (!linkPattern.test(catalogContent)) {
      errors.push(`collection catalog does not link package: ${display(packageDirectory)}`);
    } else {
      counters.catalogEntries += 1;
    }
  }
}

function sectionExists(content, section) {
  const escaped = section.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return new RegExp(`^#{2,6}\\s+${escaped}(?:\\s|$)`, "imu").test(content);
}

function validateDocumentDiscipline(collection, disciplineDirectory) {
  counters.disciplines += 1;
  const indexPath = join(disciplineDirectory, "README.md");
  if (!existsSync(indexPath)) {
    errors.push(`missing discipline README: ${display(indexPath)}`);
    return;
  }
  const indexContent = readFileSync(indexPath, "utf8");
  validatePortableMarkdownLinks(indexPath, disciplineDirectory);
  const documents = readdirSync(disciplineDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md")
    .map((entry) => join(disciplineDirectory, entry.name));

  const requiredSections =
    collection === "Rules"
      ? ["Purpose", "Scope", "MUST", "MUST NOT", "SHOULD", "Exceptions", "Verification"]
      : ["Inputs", "Procedure", "Verification", "Expected output", "Stop"];

  for (const path of documents) {
    counters.contentDocuments += 1;
    const content = readFileSync(path, "utf8");
    validatePortableMarkdownLinks(path, disciplineDirectory);
    if (!indexContent.includes(`](${relative(disciplineDirectory, path).split(sep).join("/")})`)) {
      errors.push(`discipline index does not link document: ${display(path)}`);
    }
    for (const section of requiredSections) {
      if (!sectionExists(content, section)) {
        errors.push(`${display(path)}: missing ${section} section`);
      }
    }
  }
}

for (const collection of packageCollections) {
  const collectionDirectory = join(repositoryRoot, collection);
  validatePackageCatalog(collectionDirectory);
  for (const packageDirectory of childDirectories(collectionDirectory)) validatePackage(packageDirectory);
}

for (const collection of documentCollections) {
  for (const disciplineDirectory of childDirectories(join(repositoryRoot, collection))) {
    validateDocumentDiscipline(collection, disciplineDirectory);
  }
}

const failed = errors.length > 0 || (strict && warnings.length > 0);
const report = {
  status: failed ? "failed" : "passed",
  mode: strict ? "strict" : "default",
  checked: counters,
  errors,
  warnings,
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = failed ? 1 : 0;
