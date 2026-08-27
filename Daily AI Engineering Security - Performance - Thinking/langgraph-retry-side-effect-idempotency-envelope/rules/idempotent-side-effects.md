# Rules: Idempotent Side Effects

- Every externally visible side effect inside retryable or resumable execution MUST have a stable business-operation identity.
- The stable identity MUST NOT be regenerated per retry attempt.
- Authorization and human approval MUST remain separate from idempotency and MUST NOT be bypassed because a claim exists.
- A non-idempotent external effect MUST NOT execute until an atomic claim is acquired.
- A completed claim MUST return the persisted result and MUST NOT repeat the side effect.
- A fresh in-progress claim MUST block concurrent duplicate execution.
- A stale claim with unknown external outcome MUST NOT be automatically replayed unless policy explicitly allows safe reconciliation.
- Retry attempts MUST be bounded.
- Check-then-act logic without an atomic claim MUST NOT be treated as sufficient duplicate protection under concurrency.
- Result records MUST NOT contain secrets unless the backing store is explicitly designed and approved for secret storage.
- Before completion, restart/replay tests MUST demonstrate one externally visible effect for one stable operation identity.
- The implementing agent MUST NOT be the only verifier for consequential side effects.