# Compatibility and Versioning Strategy

## Purpose
Define how APIs, SDKs, models, schemas, and developer tooling evolve without creating unpredictable breakage across independently deployed clients.

## When to use
Use when designing version policies, introducing new protocol fields, changing defaults, updating generated SDKs, or coordinating multi-surface platform evolution.

## Inputs
Public contracts, client inventory, model lifecycle, SDK release cadence, protocol schemas, semantic-versioning policy, support windows, and deployment architecture.

## Context to inspect
Inspect historical breaking changes, client parsing assumptions, generated types, default values, enum handling, endpoint versions, model aliases, and release-note quality.

## Core knowledge
Compatibility includes syntax, behavior, performance, and operational expectations. Additive schema changes can still break clients with strict parsers. Default changes can be more disruptive than new fields. Model aliases create behavioral versioning even when the wire contract is unchanged.

## Procedure
1. Enumerate public compatibility boundaries.
2. Define which changes are additive, behavior-changing, or breaking for each boundary.
3. Establish version identifiers and support windows.
4. Require tolerant-reader behavior where protocols permit it.
5. Avoid reusing existing fields or enums for new semantics.
6. Pin behavior-sensitive examples and tests to explicit versions where appropriate.
7. Define default-change policy and announcement requirements.
8. Maintain contract fixtures for old and new clients.
9. Run cross-version compatibility tests before release.
10. Document behavioral changes separately from wire-schema changes.
11. Track deprecated versions and migration readiness.

## Decision points
Version the whole API only when changes cannot be isolated safely. Prefer additive capability negotiation for optional features. Use immutable model snapshots when reproducibility matters; use aliases when managed evolution is an explicit product contract.

## Common failure patterns
Strict enum parsing, changing defaults silently, removing response fields believed unused, generated clients lagging server behavior, conflating package version with API version, and undocumented alias changes.

## Verification
Test supported old clients against new services and new clients against supported old services where applicable, compare behavioral fixtures, and confirm release notes enumerate compatibility impacts.

## Expected output
A compatibility matrix, version policy, test strategy, lifecycle rules, and migration triggers.

## Stop conditions
Stop when support guarantees are contradictory, affected clients cannot be inventoried, or a proposed behavior change cannot be isolated from existing consumers.