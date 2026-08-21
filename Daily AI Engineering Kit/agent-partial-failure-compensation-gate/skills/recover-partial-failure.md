# Skill: Recover a Partial Failure

## Purpose
Recover from a workflow where some side effects succeeded, failed, or have unknown outcome without duplicating effects or compensating the wrong state.

## Inputs
- Current plan and fingerprint.
- Current execution ledger.
- Provider/read-back evidence.
- Policy.
- Independent review for high/critical risk.

## Preconditions
The worker has stopped forward mutation. Ledger is durable and bound to the current plan/repository revision.

## Procedure
1. Freeze forward execution and preserve the first failure/timeout response.
2. Read actual state for every `unknown` step using provider-native identifiers or the step operation key.
3. Reclassify each unknown as `succeeded` or `failed` only from authoritative read-back evidence. If it remains unknowable, stay blocked.
4. Re-read postconditions for already succeeded steps; do not trust stale in-memory state.
5. Decide recovery strategy: resume forward, compensate succeeded steps, or escalate for manual recovery.
6. If compensating, execute only steps proven `succeeded`, in reverse order when policy requires it.
7. Before each compensation, re-check that the inverse is still valid and obtain approval for any dangerous action.
8. Verify each compensation by its declared verification check and update the ledger.
9. Increment recovery attempts and stop when the configured budget is exhausted.
10. Run `evaluate-recovery-gate.py` before forward resume.
11. After terminal success or verified compensation, run `evaluate-final-gate.py`.

## Expected output
Updated ledger plus reconciliation evidence, recovery-gate result, and final-gate result.

## Verification
No step remains `unknown`; every succeeded/compensated step has postcondition evidence; review bindings are current where required.

## Failure handling
Transient read-only provider failure may retry once. Permission, validation, business-rule, or unknown-outcome failures do not auto-retry. Compensation failure stops further automatic mutation.

## Stop conditions
Stop on unresolved unknown outcome, stale plan/revision, recovery budget exhaustion, failed compensation verification, missing approval, or final gate block.
