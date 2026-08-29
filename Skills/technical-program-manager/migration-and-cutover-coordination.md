# Migration and Cutover Coordination

## Purpose
Plan and coordinate complex technical migrations and cutovers so sequencing, validation, rollback, communication, and operational ownership are controlled.

## When to use
Use for platform migrations, database moves, cloud transitions, identity changes, API version cutovers, or major infrastructure replacements.

## Inputs
Migration design, dependency map, data or traffic plan, validation criteria, rollback plan, change window, owner roster.

## Context to inspect
Historical incidents, environment parity, replication lag, compatibility constraints, maintenance windows, support coverage, and regulatory obligations.

## Core knowledge
A Senior TPM treats cutover as a temporary high-risk operating mode. Success depends on explicit checkpoints, stop/go criteria, command structure, rollback thresholds, and real-time evidence.

## Procedure
1. Define target state and migration success criteria.
2. Break the cutover into ordered, reversible steps where possible.
3. Assign owners and timestamps to each step.
4. Define prechecks, validation checkpoints, and rollback triggers.
5. Confirm communications, incident channels, and escalation paths.
6. Rehearse with representative data or traffic.
7. Freeze the runbook before execution except for approved changes.
8. Execute with one source of truth for state.
9. Validate post-cutover stability before closing.

## Decision points
Prefer phased or canary migration when rollback cost is high. Use big-bang cutover only when coexistence is impossible or risk is otherwise lower.

## Common failure patterns
Unrehearsed rollback, ambiguous command ownership, hidden manual steps, weak validation, and closing before stability is demonstrated.

## Verification
Confirm success metrics, data integrity, service health, and rollback readiness at each gate.

## Expected output
A validated cutover plan, execution record, and confirmed stable target state.

## Stop conditions
Stop when prechecks fail, rollback is unavailable, unexpected data loss appears, or critical owners are absent.