# Skill: Idempotency Assessment

## Purpose
Determine whether a tool action can be replayed safely and construct the stable operation identity needed for durable execution.

## Trigger
Run before a tool with external side effects, and whenever a retry/resume could re-enter that tool.

## Inputs
Workflow ID, action name, target resource, canonical arguments, tool side-effect class, provider idempotency support, current ledger record, and retry/resume metadata.

## Preconditions
The caller can distinguish the logical action from an individual execution attempt. A durable store is available for production usage.

## Required context
User-approved goal, target identity, normalized arguments, tool semantics, and any provider-specific reconciliation endpoint.

## Allowed tools
Read durable state, inspect tool schemas/docs, query an external system read-only for reconciliation, and execute the local gate script.

## Constraints
- Do not invent a new logical operation key during retry or resume.
- Do not treat timeout/cancellation as proof the side effect failed.
- Do not replay an `unknown` high-impact action without reconciliation or explicit approval.
- Do not include secrets in operation-key material or logs.

## Procedure
1. Classify the tool as read-only or side-effecting.
2. Identify the durable logical action boundary and target.
3. Canonicalize arguments deterministically; exclude volatile attempt metadata but include values that change the requested effect.
4. Compute the operation key from configured fields.
5. Read the durable ledger by operation key.
6. If no record exists, claim it as `in_progress` before external execution.
7. If `succeeded`, return the stored result fingerprint/result reference instead of executing again.
8. If `failed` and attempts remain, verify failure was definitive before retrying.
9. If `unknown`, reconcile using provider records, target state, receipt IDs, or other read-only evidence.
10. For high-impact ambiguity without decisive evidence, block and request human approval.
11. After execution, atomically persist `succeeded`, `failed`, or `unknown` with evidence.

## Decision points
- Read-only: execute normally; ledger optional.
- New side effect: claim then execute.
- Previously succeeded: reuse; no replay.
- Definitively failed: retry within limit using same key.
- Ambiguous: reconcile; never blindly retry.

## Expected output
Operation key, effect classification, ledger state, decision, attempt count, reconciliation requirement, and evidence references.

## Metrics
Coverage of side-effecting calls, operation-key reuse rate, ambiguous-outcome reconciliation rate, duplicate-effect count, and blocked unsafe replay count.

## Verification
Run replay fixtures where the remote effect succeeds but the local call times out. Verification passes only if a resumed attempt does not duplicate the external effect.

## Failure handling
If the ledger is unavailable, fail closed for high-impact writes. Low-impact writes may follow an application-specific degraded-mode policy only if explicitly configured.

## Stop conditions
Stop when the action is succeeded, definitively failed after the configured attempt limit, or remains ambiguous and requires escalation.
