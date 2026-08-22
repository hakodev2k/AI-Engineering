# External Action Lifecycle Hooks

## 1. Pre-action registration
**Trigger:** immediately before any external write.

**Preconditions:** exact target and canonical request are known.

**Action:** create `artifacts/action-attempt.json`, then fingerprint it.

**Command:**
```bash
python3 scripts/fingerprint-attempt.py artifacts/action-attempt.json --output artifacts/action-fingerprint.json
```

**Expected result:** stable attempt fingerprint exists before the external side effect.

**Failure behavior:** block execution. **Blocking:** yes.

## 2. Post-transport receipt capture
**Trigger:** after response, timeout, connection loss, or tool error.

**Action:** persist an immutable `action-receipt-NNN.json`; classify transport uncertainty as `outcome=unknown` unless authoritative business outcome was received.

**Expected result:** every invocation has evidence.

**Failure behavior:** stop; do not replay. **Blocking:** yes.

## 3. Unknown-outcome freeze
**Trigger:** latest receipt outcome is `unknown`.

**Action:** prohibit write replay/compensation; execute only authoritative read-only status/read-back probe and persist a probe receipt.

**Retry:** one retry maximum, only for transient read-only probe/tool failure.

**Failure behavior:** escalate to human decision after retry budget. **Blocking:** yes.

## 4. Reconciliation evaluation
**Trigger:** after receipt/probe capture.

**Command:**
```bash
python3 scripts/evaluate-reconciliation.py artifacts/action-attempt.json artifacts/action-receipt-*.json --policy config/reconciliation-policy.json --output artifacts/reconciliation.json
```

**Expected result:** `resolved` with `accept-success`/`accept-failure`, or a blocking/nonterminal status.

**Failure behavior:** preserve evidence and stop. **Blocking:** yes unless resolved.

## 5. High-risk independent review
**Trigger:** risk is `high` or `critical` and reconciliation resolved.

**Action:** Reconciliation Verifier produces `artifacts/reconciliation-review.json` bound to the attempt fingerprint.

**Failure behavior:** block final verification. **Blocking:** yes.

## 6. Final verification
**Trigger:** before claiming external action verified.

**Command:**
```bash
python3 scripts/verify-final-gate.py artifacts/action-attempt.json artifacts/reconciliation.json --policy config/reconciliation-policy.json --review artifacts/reconciliation-review.json --approval artifacts/approval.json --output artifacts/final-gate.json
```
Omit `--review` for low/medium risk and omit `--approval` only when the action is not dangerous.

**Expected result:** `status=verified`.

**Failure behavior:** block completion; never reinterpret blocked as success. **Blocking:** yes.
