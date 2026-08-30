# API and Contract Governance

## Purpose
Establish durable interface practices across teams so APIs, events, schemas, and shared contracts can evolve without unnecessary coupling or breaking consumers.

## When to use
Use when many teams publish or consume shared interfaces, versioning conflicts recur, or compatibility failures create operational risk.

## Inputs
API specifications, event schemas, consumer inventory, versioning practices, compatibility requirements, deprecation constraints.

## Preconditions
Major interface owners and consumers are discoverable.

## Context to inspect
Existing contracts, change history, client update cadence, schema registries, gateway policies, integration incidents, and ownership metadata.

## Core knowledge
Good contract governance protects consumer autonomy. Backward compatibility, explicit ownership, versioning, idempotency, semantic stability, and deprecation discipline are more valuable than centralized approval of every change.

## Procedure
1. Inventory important shared contracts and owners.
2. Classify compatibility expectations.
3. Define additive and breaking-change rules.
4. Establish versioning and deprecation policies.
5. Require machine-testable contracts where practical.
6. Define consumer notification and migration windows.
7. Add observability for contract usage and errors.
8. Create an exception path for justified breaking changes.
9. Review governance effectiveness using incident and adoption data.

## Decision points
Prefer additive evolution when practical. Version only when semantic compatibility cannot be preserved. Use events when temporal decoupling is valuable, not as a substitute for clear ownership.

## Common failure patterns
Unknown consumers, schema reuse across unrelated domains, breaking changes hidden behind minor versions, permanent old versions, and governance that becomes a manual bottleneck.

## Verification
Run contract and compatibility tests, verify consumer migration evidence, and confirm deprecated versions have measurable retirement plans.

## Expected output
A reusable contract governance model with ownership, compatibility rules, tests, deprecation policy, and escalation paths.

## Stop conditions
Stop when consumer impact cannot be determined or a breaking change affects external contractual obligations without appropriate approval.