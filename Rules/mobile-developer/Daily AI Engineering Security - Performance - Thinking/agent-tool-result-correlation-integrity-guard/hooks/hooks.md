# Hooks

## Pre-tool-dispatch hook

**Trigger:** Immediately before any tool execution.

**Action:** Register composite invocation identity and reject duplicates.

**Command/script:** Host writes invocation to ledger, then runs `python scripts/correlation_guard.py --ledger runtime-ledger.json --policy config/correlation-policy.json` when validating an existing active set.

**Expected result:** Invocation identity is unique and ledger remains valid.

**Failure behavior:** Do not execute the tool; emit `DUPLICATE_INVOCATION_ID` or invalid-identity reason.

## Post-tool-result hook

**Trigger:** Tool result arrives.

**Action:** Append result event, hash payload, reconcile identity.

**Command/script:** `python scripts/correlation_guard.py --ledger runtime-ledger.json --policy config/correlation-policy.json --report correlation-report.json`

**Expected result:** Exit 0 and result classified as accepted or harmless duplicate.

**Failure behavior:** Pause model continuation; quarantine uncertain result.

## Pre-model-continuation hook

**Trigger:** Runtime is about to send tool results back to the model.

**Action:** Enforce zero unresolved active calls unless partial continuation is explicitly configured.

**Command/script:** Same guard command.

**Expected result:** `status=safe_to_continue`.

**Failure behavior:** Do not construct continuation request. Start bounded reconciliation workflow.

## Retry/fallback hook

**Trigger:** Model fallback, transport retry, response regeneration, or transcript rollback.

**Action:** Increment generation, freeze old-generation dispatch, enumerate live old executions, quarantine late results.

**Command/script:** Host orchestration plus guard validation after ledger update.

**Expected result:** New generation has a clean namespace and old actions are classified.

**Failure behavior:** Block replay of side-effectful tools without idempotency proof or human approval.

## Post-recovery verification hook

**Trigger:** Correlation incident was repaired.

**Action:** Independent verifier reruns deterministic tests/guard against repaired ledger.

**Command/script:** `python -m unittest tests/test_correlation_guard.py`

**Expected result:** Tests pass and repaired incident produces exit 0.

**Failure behavior:** Keep run blocked and escalate; never weaken correlation policy to force progress.