# Workflow: Attest → Delegate → Reconcile

## Trigger
Before protected multi-agent fan-out or after any client/hook/policy/topology change.

## Goal
Ensure security controls remain effective and visible across every delegated execution topology.

## Inputs
Policy configuration, topology list, delegate roster, protected operations, parent result schema.

## Baseline
Record current policy hash, supported topologies, parent-visible denial/ask fields, and baseline event coverage.

## Stages
1. Observe current hook/policy configuration.
2. Spawn a harmless test delegate for each topology.
3. Run deterministic canaries for pre-tool `deny` and `ask`/PermissionRequest where supported.
4. Correlate child events with unique delegate and batch IDs.
5. Compare child decision with parent-visible result.
6. Diagnose missing dispatch, identity reuse, or outcome propagation gaps.
7. Apply host-side guard: disable protected delegation for unproven topologies or require an explicit parent-controlled gate.
8. Repeat attestation once.
9. Independent Policy Continuity Verifier returns PASS/BLOCK.

## Responsible agent
Host orchestrator implements gating; `subagents/policy-continuity-verifier.md` verifies independently.

## Tools
Hook logs, structured event channel, `scripts/verify_attestation.py`, harmless canaries.

## Outputs
Attestation JSON, coverage report, topology allow/block matrix, verification result.

## Checkpoints
No protected work before attestation; no fan-out success before child decisions reconcile; no completion before independent verification.

## Metrics
Topology coverage, event-delivery rate, denial propagation, ambiguous identity count, blocked unsafe delegations.

## Retry policy
Maximum one fresh-delegate retry for a failed topology.

## Stop conditions
Stop on second failure, identity collision, missing required event, or unresolved child decision.

## Failure path
Mark topology `unproven`, route protected work to parent/in-process execution with proven controls, and require explicit human approval for any exception.

## Verification
Run the deterministic verifier over the attestation and compare with raw event samples.

## Definition of Done
All used protected topologies are attested PASS, policy hash matches runtime config, child security outcomes are visible to parent, no identity ambiguity remains, and no protected action bypasses the gate.