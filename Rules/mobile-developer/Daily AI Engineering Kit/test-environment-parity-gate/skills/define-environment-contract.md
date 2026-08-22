# Skill: Define Test Environment Contract

## Purpose
Turn production/staging/runtime assumptions into an explicit, value-free environment contract that tests can be compared against.

## When to use
Before relying on integration/E2E/performance tests for release confidence, after changing runtime dependencies, or when a defect reproduces only outside test environments.

## Inputs
Target environment, runtime/dependency manifests, container/IaC files, CI configuration, provider documentation already approved for use, and relevant incident/test evidence.

## Preconditions
Read-only access is sufficient. Do not retrieve secrets. Separate facts from hypotheses.

## Procedure
1. Identify the target kind: local, CI, staging, production-like, or production-target.
2. Enumerate behavior-affecting dimensions: runtime, OS, database, cache, broker, browser, external provider, feature flags.
3. For each dimension record provider/engine, major version, required capabilities and whether it is mandatory.
4. Prefer evidence from lockfiles, containers, IaC, deployment manifests and runtime metadata over memory.
5. Do not encode secret values, credentials, hostnames containing secrets, tokens or private payloads.
6. Validate that each capability is behavior-relevant; remove decorative metadata.
7. Save a contract using `templates/environment-contract.example.json` as the shape.
8. Record unresolved assumptions separately; do not convert them into facts.

## Expected output
A stable environment contract consumable by `scripts/evaluate-parity.py`.

## Verification
Every required dimension has provider, version and capability evidence; target kind is explicit; no secret values are present.

## Failure handling
If target runtime evidence is unavailable, mark the verification blocked for release-critical work rather than assuming parity.

## Stop conditions
Stop before changing production infrastructure/configuration or secrets; those require explicit human approval.
