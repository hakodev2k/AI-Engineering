# Dependency Resolution

## Purpose
Design predictable, secure dependency resolution for source and binary dependencies.

## When to use
Use when adopting package managers, resolving version conflicts, improving offline builds, or hardening dependency acquisition.

## Inputs
Dependency manifests, lockfiles, repositories/registries, version policies, checksums, licenses, and transitive graphs.

## Context to inspect
Inspect direct/transitive dependencies, resolution rules, mirrors, credentials, scopes, substitutions, optional/platform dependencies, and update automation.

## Core knowledge
Resolution should separate requested constraints from the resolved graph. Lockfiles provide repeatability only when registries, artifacts, and tool versions are controlled. Dependency confusion and mutable artifacts are supply-chain risks.

## Procedure
1. Map direct and transitive dependency graphs.
2. Define allowed sources and precedence.
3. Pin resolved versions and integrity metadata.
4. Prevent ambiguous public/private package resolution.
5. Configure authenticated mirrors where required.
6. Detect duplicate/conflicting versions and understand runtime/ABI implications.
7. Define update policy and review gates.
8. Support deterministic offline or cache-backed restoration where feasible.
9. Validate licenses and vulnerability policy integration.
10. Test clean resolution from an empty local cache.

## Decision points
Prefer exact resolved versions for applications; libraries may expose compatible ranges while testing against minimum/maximum supported versions. Deduplicate only when semantic and ABI compatibility are proven.

## Common failure patterns
Floating ranges in production builds, mutable artifacts, registry fallback surprises, missing integrity checks, hidden transitive downloads, and lockfiles generated differently by platform.

## Verification
Resolve twice from clean state; compare graphs and hashes; simulate registry unavailability; test unauthorized source injection; build and test after dependency updates.

## Expected output
A deterministic resolution policy, locked graph, source trust rules, and update procedure.

## Stop conditions
Stop if required artifacts lack stable identity/integrity, license/security policy blocks a dependency, or conflict resolution requires application-level behavior changes outside scope.