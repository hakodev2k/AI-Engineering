# Rules — Consequential Action Authorization

- Transport authentication **MUST NOT** be treated as authorization for an exact consequential action.
- Every consequential action **MUST** be bound to caller, receiver, task, message digest, semantic action, parameter digest, purpose, expiry, nonce, one-use authorization ID and `max_uses=1`.
- The current action **MUST** be verified against the envelope immediately before the side effect.
- Changed parameters, receiver, task, message, purpose or action **MUST** invalidate the prior authorization.
- Expired, future-dated, malformed or consumed authorization **MUST** fail closed.
- Authorization consumption **MUST** be made atomic with the side effect when possible; otherwise the downstream operation **MUST** use an idempotency key derived from or bound to the authorization ID.
- An ambiguous network result **MUST NOT** be blindly replayed; the executor **MUST** reconcile downstream state first.
- A retry **MUST NOT** silently mint broader authorization.
- Dangerous or irreversible actions **MUST** have explicit human approval bound to the exact envelope.
- Shared credentials **MUST NOT** erase the caller identity used by action authorization; when end-principal identity cannot be established, consequential execution **MUST** stop.
- Secrets, bearer tokens and private keys **MUST NOT** be placed in envelope fields or audit messages.
- The implementation agent **MUST NOT** be the only verifier for a high-risk action boundary.
- Reconciliation loops **MUST** be bounded to one state query plus explicit human escalation if outcome remains ambiguous.