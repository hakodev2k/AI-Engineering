# External Action Receipt Reconciliation Workflow

## Trigger
Any external write whose caller can lose acknowledgement or whose result may be asynchronous/ambiguous.

## Entry conditions
- The action is in scope.
- Target and request are identifiable.
- Idempotency/reconciliation capabilities are understood enough to proceed safely.
- Dangerous action approval exists before execution.

## Inputs
Task requirement, target identity, request metadata, risk, policy, integration/tool, status/read-back method.

## Context
Repository integration path, official external API semantics, nearby tests, current environment identity, existing receipts.

## Flow
```text
Trigger
  ↓
Prepare attempt + fingerprint + idempotency key
  ↓
Approval gate when dangerous
  ↓
Execute once
  ↓
Capture receipt
  ↓
Confirmed? ── yes ──> Reconcile result
  │
  no / unknown
  ↓
Freeze replay + compensation
  ↓
Authoritative read-back/status probe
  ↓
Confirmed? ── no after bounded probe retry ──> Human decision required
  │
  yes
  ↓
Independent review when high/critical
  ↓
Final gate
  ↓
Verified
```

## Stages and ownership
1. **Prepare** — External Action Coordinator creates attempt and correlation fields.
2. **Approval** — human approves exact dangerous attempt fingerprint.
3. **Execute** — Coordinator invokes the write once.
4. **Receipt** — Coordinator records response/timeout/error immutably.
5. **Reconcile** — Coordinator performs authoritative read-back for unknown outcome.
6. **Evaluate** — deterministic script produces terminal or blocked state.
7. **Review** — Reconciliation Verifier independently checks high/critical decisions.
8. **Final gate** — deterministic script proves attempt/reconciliation/review/approval consistency.

## Produced artifacts
- `artifacts/action-attempt.json`
- `artifacts/action-fingerprint.json`
- `artifacts/action-receipt-*.json`
- `artifacts/reconciliation.json`
- optional `artifacts/reconciliation-review.json`
- optional `artifacts/approval.json`
- `artifacts/final-gate.json`

## Checkpoints
After attempt creation, before dangerous execution, after every receipt, before replay/compensation decision, before final verified claim.

## Retry rules
- External write replay while outcome unknown: **0**.
- Transient read-only status probe failure: **maximum 1 retry**.
- Validation/permission failure: **0 retries**.
- Contradictory authoritative evidence: **0 automated retries; human decision**.

Preserve all receipts before every retry/escalation.

## Approval points
Dangerous original action and any dangerous compensation/retry are separately approval-bound actions.

## Failure paths
Unknown after bounded probe, missing provider correlation support for high risk, mismatched receipt, stale approval/review, permission failure, or contradictory evidence all block completion.

## Definition of Done
- Attempt was pre-registered.
- Idempotency and request fingerprints are stable.
- Every external call has a receipt.
- No unknown outcome was replayed or compensated.
- Terminal result is backed by authoritative evidence.
- High/critical result has independent review.
- Required approval binds the exact attempt.
- Final gate is `verified`.
