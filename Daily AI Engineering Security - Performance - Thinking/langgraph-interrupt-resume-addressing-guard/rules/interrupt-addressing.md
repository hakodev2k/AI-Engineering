# Rules: Interrupt Resume Addressing

1. Every resume **MUST** be based on the current authoritative pending-interrupt set.
2. Durable interrupt IDs **MUST** be preserved from runtime to UI/API and back.
3. A resume envelope **MUST** explicitly declare `kind=scalar` or `kind=by_id`.
4. Payload shape **MUST NOT** be used to infer addressing mode.
5. `kind=scalar` **MUST NOT** be accepted when more than one interrupt is pending under the default policy.
6. `kind=by_id` **MUST** reject IDs that are not currently pending.
7. Duplicate pending interrupt IDs **MUST** block resume.
8. When `require_all_pending_for_by_id=true`, an ID map **MUST** address every current pending interrupt exactly once.
9. A stale checkpoint/thread identity **MUST** block resume rather than fall back to ordering.
10. UI prompt text **MUST NOT** be treated as a stable resume identifier.
11. The caller **SHOULD** re-read pending state immediately after resume and verify expected resolution.
12. A workflow **MUST NOT** claim Verified merely because execution continued.
13. Retries **MUST** be bounded: one authoritative-state refresh is allowed for stale-state detection; persistent ambiguity stops execution.
14. High-impact approvals **SHOULD** be independently verified against action identity before side effects occur.
15. Observable records **SHOULD** contain interrupt IDs, checkpoint/thread identifiers, addressing mode, and resolution status, but **MUST NOT** require hidden chain-of-thought.
