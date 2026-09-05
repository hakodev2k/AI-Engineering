# Retry Budget Rules

1. Retry-policy changes **MUST** have a measured pre-change baseline.
2. Errors **MUST** be classified from observable provider/tool contracts or trace evidence, not model speculation.
3. Every retry episode **MUST** have bounded attempt and elapsed-time budgets.
4. Repeated identical error fingerprints **MUST** have a separate bounded no-progress budget.
5. Authentication, permission, policy, and security failures **MUST NOT** be retried to bypass a control.
6. Unknown error classes **MUST** stop automatic retry until explicitly classified.
7. Every retry decision **MUST** log sanitized class, fingerprint, attempt, elapsed time, verdict, reason, and delay.
8. Backoff **MUST** be bounded; code **MUST NOT** sleep without an upper limit.
9. A repeated-error retry **SHOULD** require observable state change or remain strictly below its fingerprint budget.
10. Side-effecting operations **MUST NOT** be retried unless idempotency, deduplication, or reconciliation is established and required approval remains valid.
11. Performance improvement **MUST** be demonstrated with before/after metrics and a task-success/quality guardrail.
12. The implementation agent **MUST NOT** be the only verifier of retry-policy changes.
13. Tuning **MUST** stop after two unsuccessful cycles; teams **MUST NOT** repeatedly raise budgets to hide a persistent failure.