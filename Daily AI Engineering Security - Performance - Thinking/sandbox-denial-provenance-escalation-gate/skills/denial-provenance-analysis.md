# Skill: Denial Provenance Analysis

## Purpose
Determine whether a failed tool operation represents a normal execution failure or an authorization denial that must constrain later agent actions.

## Trigger
A sandbox, permission layer, policy engine, hook, or tool adapter rejects an operation; or a model proposes an alternate executor after a rejection.

## Inputs
Raw tool result, executor metadata, active sandbox/approval policy, proposed fallback operation, and trust-zone configuration.

## Preconditions
The evaluator can inspect structured runtime metadata without exposing secrets.

## Required context
Operation type and target; side-effect level; executor/trust zone; policy decision source; approval state.

## Allowed tools
Read-only logs, policy configuration, structured tool traces, local deterministic scripts.

## Constraints
Do not infer approval from successful execution. Do not weaken a denial to preserve task progress. Do not store secret payloads in provenance records.

## Procedure
1. Capture the runtime's authoritative decision before generic result serialization.
2. Classify the event as `allowed`, `execution_failure`, or `denied_by_policy`.
3. For denial, normalize action, target, side effect, trust zone, policy source, timestamp, and approval requirement.
4. Build the operation fingerprint and write it to the task-scoped denial ledger.
5. If a fallback is proposed, compare its semantic operation and privilege/trust-zone level with active denials.
6. If equivalent or stronger, require an approval that explicitly covers the fallback trust zone.
7. Record the final allow/block decision and evidence.

## Decision points
- Missing authoritative decision metadata: fail closed for privileged fallback and flag instrumentation defect.
- Different action/target: allow normal evaluation under its own policy.
- Equivalent action with equal/higher privilege or broader trust zone: block unless explicitly approved.

## Expected output
A normalized denial envelope and an auditable allow/block decision.

## Metrics
Provenance preservation rate, cross-surface bypass block rate, false-positive rate, approval attribution coverage.

## Verification
Replay fixtures where a denied local command is proposed through MCP/SSH; the fallback must be blocked absent explicit cross-zone approval.

## Failure handling
If normalization fails, preserve the raw security classification and block privileged fallback. Retry normalization once after schema validation; then escalate.

## Stop conditions
Stop after a deterministic decision is recorded, or after one normalization retry fails and the operation is safely blocked.
