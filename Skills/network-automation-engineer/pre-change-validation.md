# Pre-Change Validation

## Purpose
Prove prerequisites and safety conditions before automated network changes begin.

## When to use
Use before configuration deployment, maintenance, migrations, routing/security changes, and fleet automation.

## Inputs
Change intent, target list, topology, health metrics, redundancy, dependencies, maintenance constraints, and rollback plan.

## Context to inspect
Reachability, routing adjacencies, interface errors, redundancy state, recent incidents, configuration drift, capacity, and control-plane health.

## Core knowledge
A valid intended change can still be unsafe on a degraded network. Prechecks should test assumptions that make rollback and blast-radius limits valid.

## Procedure
1. Confirm exact target scope and source-of-truth state.
2. Validate management reachability and authentication.
3. Check current config/state for unexpected drift.
4. Verify redundant paths/peers are healthy.
5. Check utilization and error thresholds.
6. Confirm no conflicting incidents or maintenance.
7. Validate backup/checkpoint and rollback mechanism.
8. Test dependencies and policy gates.
9. Record baseline state for postcomparison.
10. Block execution on failed critical assertions.

## Decision points
Warnings may permit human-approved continuation; hard safety assertions should fail closed. Tighten gates for high-blast-radius changes.

## Common failure patterns
Ping-only prechecks, stale inventory, ignoring redundancy degradation, no baseline capture, and allowing automation to override failed checks silently.

## Verification
Inject failing preconditions in test environments and confirm execution blocks with actionable evidence.

## Expected output
Machine-readable precheck result, baseline snapshot, approved warnings, and go/no-go decision.

## Stop conditions
Stop on failed critical checks, ambiguous target scope, missing rollback, or degraded failure-domain redundancy.