# Skill: Delegation Policy Attestation

## Purpose
Prove that required security hooks and policy outcomes remain observable across parent, in-process subagent, background subagent, and agent-team/delegated process boundaries.

## Trigger
Before delegated work that can write files, execute shell commands, change repository state, access secrets, call MCP tools, or request elevated permissions.

## Inputs
Parent task ID, delegate ID, execution topology, required hook names, protected operations, correlation ID, policy configuration.

## Preconditions
Delegates can emit structured events or acknowledgements to a parent-controlled channel. Harmless canary operations are available.

## Required context
Only policy identifiers, delegate identity, correlation data, and canary results. Do not include secrets.

## Allowed tools
Read-only policy inspection, hook event logs, structured IPC/message channel, deterministic canary command, hash/signature utilities where available.

## Constraints
Canaries MUST be non-destructive. A missing acknowledgement MUST NOT be interpreted as allow. Parent session ID alone MUST NOT be treated as unique delegate identity.

## Procedure
1. Generate a unique correlation ID for the delegation batch.
2. Assign each delegate a unique local identity independent of parent session ID.
3. Declare required control points: pre-tool, permission-request, denial propagation, completion acknowledgement.
4. Run a harmless canary expected to trigger each required control in every topology.
5. Record observed event source, delegate identity, correlation ID, decision, and timestamp.
6. Reconcile the child event with the parent-visible result.
7. If any required control is absent, ambiguous, or attributed only to the parent, classify coverage as `unproven`.
8. Permit protected delegated work only when coverage is `proven` for that topology and policy version.

## Decision points
- Missing PermissionRequest for a required `ask` => BLOCK.
- Child denial not visible at parent => BLOCK protected fan-out.
- Duplicate/ambiguous delegate identity => BLOCK concurrent protected work.
- Policy version changed after attestation => re-attest.

## Expected output
Structured attestation with topology, policy version/hash, delegate IDs, canary observations, parent reconciliation result, and PASS/BLOCK.

## Metrics
Coverage ratio, missing-event rate, ambiguous-identity rate, denial-propagation success, false-success count, attestation latency.

## Verification
An independent verifier repeats canaries for at least one representative delegate per topology and validates event-to-parent reconciliation.

## Failure handling
Retry one fresh delegate once. If the second attestation fails, disable protected delegation for that topology and escalate rather than bypassing controls.

## Stop conditions
Stop after two failed attestations, identity collision, event-correlation mismatch, or any policy outcome that cannot be reconciled with parent state.