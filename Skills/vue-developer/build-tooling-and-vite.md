# Build Tooling and Vite

## Purpose
Maintain fast, reproducible Vue builds and diagnose bundling, environment, dependency, and deployment issues.

## When to use
Use for Vite configuration, dependency upgrades, build failures, bundle regressions, or environment configuration changes.

## Inputs
Package manifest, Vite config, environment variables, CI logs, bundle output, and deployment target.

## Context to inspect
Inspect scripts, plugins, aliases, transpilation targets, env loading, asset paths, chunking, and CI/runtime differences.

## Core knowledge
Build-time environment values become client-visible if embedded. Dev-server behavior can differ from production. Plugin order, module format, browser targets, and dependency prebundling affect behavior.

## Procedure
1. Reproduce with the same package manager and lockfile.
2. Separate dev-only from production-build failures.
3. Inspect config, plugin, alias, and environment resolution.
4. Verify browser targets and module compatibility.
5. Analyze output chunks and assets when size matters.
6. Remove accidental Node-only/browser-incompatible dependencies.
7. Ensure secrets are never embedded in client bundles.
8. Validate base paths and history fallback in deployment.
9. Run clean install, build, preview, and CI checks.

## Decision points
Customize chunking only with measured benefit. Add plugins when they solve durable needs and maintenance cost is acceptable.

## Common failure patterns
Committing secrets in env files, relying only on dev server, unpinned dependency drift, oversized vendor bundles, brittle aliases, and environment-specific hidden behavior.

## Verification
Clean build succeeds, production preview works, deployed assets resolve, bundle contents are inspected, and CI reproduces locally where feasible.

## Expected output
Reproducible build configuration with safe environment handling.

## Stop conditions
Stop when deployment environment or required secret-management behavior is unknown.