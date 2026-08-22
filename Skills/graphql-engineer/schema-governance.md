# Schema Governance

## Purpose
Establish lightweight controls that keep a growing GraphQL schema coherent, owned, documented, compatible, and reviewable across teams.

## When to use
Use for shared graphs, multi-team ownership, federation, or schemas experiencing inconsistent conventions and accidental breaking changes.

## Inputs
Schema, team ownership, review workflow, registry/tooling, release process, and API standards.

## Context to inspect
Inspect naming patterns, descriptions, ownership metadata, deprecated fields, schema checks, review responsibilities, and consumer usage telemetry.

## Core knowledge
Governance should automate invariants and make ownership clear without centralizing every design decision. Schema quality degrades when no team owns fields after creation.

## Procedure
1. Define ownership at domain/type/field level as appropriate.
2. Document a small set of enforceable schema conventions.
3. Add linting and schema compatibility checks to CI.
4. Require design review for cross-domain or breaking-risk changes.
5. Track deprecations and consumer usage.
6. Define exception and escalation paths.
7. Maintain discoverable schema documentation.
8. Review orphaned, duplicated, and obsolete fields periodically.
9. Measure governance outcomes such as break prevention and deprecation completion.
10. Update standards from real incidents rather than preference alone.

## Decision points
Automate objective rules; use human review for domain semantics and trade-offs. Central approval is justified for shared invariants but should not block local additive changes unnecessarily.

## Common failure patterns
Style bureaucracy, no ownership, manual compatibility checks, permanent deprecated fields, standards without enforcement, and governance based on personal preferences.

## Verification
Confirm CI catches known breaking changes, every shared area has an owner, deprecations have measurable status, and exceptions are recorded.

## Expected output
A practical governance model that improves consistency and safe evolution.

## Stop conditions
Stop if governance changes require organizational authority not available to the implementer; document the decision needed.