# Safety and Correctness Rules

## MUST

- Prove the transaction boundary with repository or runtime evidence before changing delivery behavior.
- Persist business state and the corresponding outbox record atomically when the pattern applies.
- Use stable message identifiers for retry and deduplication.
- Bound dispatcher retries and surface terminal failures.
- Preserve evidence for build/test/scanner failures.
- Verify duplicate-delivery tolerance before claiming reliability.
- Keep facts, hypotheses, decisions, and open questions separate.
- Require independent verification after implementation.
- Stop before approval-required actions.

## MUST NOT

- Do not claim exactly-once delivery unless every relevant boundary proves it; prefer at-least-once plus idempotency.
- Do not publish directly from a protected business transaction if doing so recreates a dual-write failure window.
- Do not delete failed outbox records merely to make the queue appear healthy.
- Do not retry indefinitely.
- Do not silently increase database, broker, filesystem, or cloud permissions.
- Do not execute production migrations, destructive SQL, production deploys, infrastructure changes, secret changes, force pushes, or breaking public/message-contract changes without explicit human approval.
- Do not weaken authentication, authorization, encryption, validation, or auditing controls to unblock delivery.
- Do not treat static scanner output as proof of a defect.

## SHOULD

- Prefer repository-native transaction and background-worker abstractions.
- Keep dispatcher batches bounded and observable.
- Use exponential backoff with a maximum attempt/age policy appropriate to the host system.
- Record timestamps and error summaries without storing secrets.
- Test crash windows around publish and completion marking.
- Keep schema and dependency changes minimal.
- Inspect the final diff for unrelated modifications.
