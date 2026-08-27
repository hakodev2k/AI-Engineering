# CI Build Integration

## Purpose
Integrate the canonical build into CI without creating a second, divergent build implementation.

## When to use
Use when designing pipelines, consolidating CI scripts, or fixing local/CI behavior differences.

## Inputs
Build entry points, CI platform, worker images, secrets, caches, artifact requirements, test suites, and branch policies.

## Context to inspect
Inspect pipeline YAML, wrapper scripts, bootstrap, environment variables, matrix configuration, cache keys, artifacts, retries, and failure reporting.

## Core knowledge
CI should orchestrate the build, not redefine it. The same repository-owned build targets should run locally and in automation. CI-specific concerns include credentials, retention, concurrency, and reporting.

## Procedure
1. Identify canonical repository build/test/package targets.
2. Make CI call those targets directly.
3. Provision pinned toolchains through the same bootstrap path.
4. Model platform/configuration matrix explicitly.
5. Configure caches only after correctness is established.
6. Scope secrets to steps that require them.
7. Publish required artifacts with immutable identifiers.
8. Surface actionable build diagnostics and timing data.
9. Distinguish infrastructure retries from deterministic build failures.
10. Reproduce representative CI jobs locally or in equivalent workers.

## Decision points
Split jobs for isolation/parallelism when artifact transfer overhead is justified. Keep tightly coupled stages together when splitting adds latency and state complexity.

## Common failure patterns
CI-only compiler flags, duplicated dependency installation, broad secrets, stale caches, retrying deterministic compiler failures, and hiding build errors behind wrapper scripts.

## Verification
Run a clean CI job and equivalent local build; compare target configuration and artifacts; test cache-disabled execution; verify secret absence from logs/artifacts.

## Expected output
A thin CI orchestration layer around canonical build targets with clear matrix, cache, artifact, and security behavior.

## Stop conditions
Stop if required CI permissions/secrets are unavailable or branch protection changes require repository-owner approval.