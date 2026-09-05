# Schema and Contract Compatibility

## Purpose
Protect downstream consumers from breaking changes in structured AI outputs, tool schemas, APIs, event payloads, and persistence contracts.

## When to use
Use when changing response schemas, function/tool definitions, validators, model providers, event formats, or data contracts.

## Inputs
Current and candidate schemas, consumers, compatibility policy, sample payloads, contract tests, migration plan.

## Preconditions
Critical consumers and supported contract versions are known.

## Context to inspect
JSON schemas, tool definitions, API specifications, parsers, validators, event consumers, database constraints, SDKs, and fallback logic.

## Core knowledge
LLM structured output reliability is probabilistic unless constrained and validated. Contract compatibility includes syntax, semantics, nullability, enum behavior, field meanings, ordering assumptions, and error behavior.

## Procedure
1. Inventory producers and consumers.
2. Classify changes as backward-compatible, conditionally compatible, or breaking.
3. Validate schemas independently of model behavior.
4. Add contract tests using real candidate outputs.
5. Test missing, extra, malformed, and semantically invalid fields.
6. Version breaking contracts explicitly.
7. Support dual-read or dual-write during migrations when needed.
8. Coordinate consumer upgrades before removing old versions.
9. Monitor parse/validation errors during rollout.
10. Retire legacy contracts only after usage is zero or approved.

## Decision points
Prefer additive changes over destructive changes. Use adapters when provider-specific output differences should not leak to consumers.

## Common failure patterns
Assuming valid JSON equals valid semantics, changing enums silently, removing optional fields still used by consumers, and relying only on prompt wording for schema conformance.

## Verification
Contract tests pass across supported versions and production telemetry shows no unexplained validation increase.

## Expected output
A compatibility assessment, migration sequence, contract tests, and retirement criteria.

## Stop conditions
Stop release when a breaking contract lacks coordinated consumer migration or safe versioning.