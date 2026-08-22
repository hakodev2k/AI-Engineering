# API Contracts and Versioning

## Purpose
Evolve synchronous service contracts without breaking independent consumers or forcing lockstep deployments.

## When to use
Use for HTTP/RPC APIs, shared schemas, internal service contracts, and public integrations.

## Inputs
Current contract, consumer inventory, compatibility policy, deployment model, and planned change.

## Context to inspect
Inspect request/response schemas, generated clients, validation behavior, consumer usage, gateways, and deprecation telemetry.

## Core knowledge
Independent deployment requires backward-compatible evolution. Additive changes are often safer but can still break strict consumers. Behavioral compatibility matters as much as schema compatibility.

## Procedure
1. Identify all known consumer classes and compatibility promises.
2. Classify proposed change as additive, behavioral, or breaking.
3. Prefer tolerant additive evolution when semantics remain clear.
4. Define defaults and unknown-field behavior.
5. Version only when incompatible semantics cannot be evolved safely.
6. Support overlapping versions for a bounded migration period.
7. Add contract tests and compatibility checks.
8. Instrument old-version usage.
9. Communicate deprecation with dates and migration guidance.
10. Remove old contracts only after verified migration.

## Decision points
Prefer one evolvable version over permanent version proliferation. Introduce a new major contract when meaning, required fields, or behavior cannot remain compatible.

## Common failure patterns
Breaking field renames, changing enum meaning, removing optional-looking fields still used by clients, and deprecating without usage evidence.

## Verification
Run producer/consumer contract tests across supported versions and verify old clients against the new deployment.

## Expected output
A compatibility-safe contract change with migration and deprecation plan.

## Stop conditions
Escalate when consumer inventory is unavailable and the change is potentially breaking.