# Saga Compensation Safety Rules

## MUST
- Assign a stable saga ID and a stable idempotency key to every side-effecting step.
- Define a concrete compensation action for every reversible side effect before execution.
- Record step outcome, external receipt/reference, retry count, and compensation outcome as evidence.
- Execute compensations in reverse dependency order unless the domain contract explicitly requires otherwise.
- Verify compensation preconditions before executing compensation.
- Stop before any compensation that deletes data, changes production configuration, alters schema, weakens security, or performs another irreversible action unless explicit human approval is present.
- Preserve original failure evidence before retries or compensation.
- Bound normal retries and compensation retries to the configured maximum.

## MUST NOT
- Retry a non-idempotent action without a stable deduplication/idempotency mechanism.
- Treat a timeout as proof that the external action failed; reconcile outcome first.
- Run compensation merely because an acknowledgement was lost.
- Hide partial success or claim rollback when compensation is incomplete.
- Increase privileges, bypass authorization, or expose secrets to unblock recovery.
- Force-push, rewrite Git history, deploy to production, or mutate infrastructure as part of this kit.

## SHOULD
- Prefer compensating actions that restore business invariants rather than mechanically reversing bytes.
- Store external operation receipts and correlation IDs.
- Make compensations independently idempotent.
- Separate facts, hypotheses, decisions, evidence, and open questions in incident records.
