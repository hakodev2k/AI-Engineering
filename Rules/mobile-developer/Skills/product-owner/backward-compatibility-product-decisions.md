# Backward Compatibility Product Decisions

## Purpose
Manage product behavior changes without unintentionally breaking users, integrations, workflows, or stored data that depend on existing contracts.

## When to use
Use for API changes, schema-driven behavior, workflow redesigns, permission changes, deprecations, imports/exports, and externally consumed features.

## Inputs
Current contract, proposed behavior, consumer inventory, usage evidence, migration options, support commitments, and rollout constraints.

## Context to inspect
Inspect active consumers, version usage, undocumented dependencies, saved data, automation, customer commitments, and rollback feasibility.

## Core knowledge
Compatibility is a product concern because breakage transfers migration cost to users. Sometimes breaking changes are justified, but require explicit value, migration, communication, and support decisions.

## Procedure
1. Define exactly what existing behavior or contract changes.
2. Identify affected users and integrations.
3. Measure usage where possible.
4. Evaluate additive or versioned alternatives.
5. Define migration path and transition period.
6. Provide detection for remaining legacy usage.
7. Communicate deprecation with actionable guidance.
8. Establish removal criteria and date only when justified.
9. Verify migrated consumers before removal.
10. Monitor after the compatibility boundary changes.

## Decision points
Prefer additive evolution when maintenance cost is acceptable; version when contracts must diverge; break compatibility only when benefits outweigh migration and trust costs.

## Common failure patterns
Assuming no documented consumers means no consumers, silent deprecation, indefinite dual support, migration without telemetry, and breaking stored historical data.

## Verification
Affected consumers are known or measurable, migration is tested, communication exists, and removal criteria are satisfied.

## Expected output
A compatibility decision with affected consumers, migration strategy, support window, and verification evidence.

## Stop conditions
Escalate when contractual support obligations or unknown high-impact consumers make safe migration impossible.