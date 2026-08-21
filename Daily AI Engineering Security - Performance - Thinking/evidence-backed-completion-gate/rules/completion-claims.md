# Rules: Completion Claims

- Every material user requirement **MUST** have a durable status before finalization.
- A requirement **MUST NOT** be marked `verified` without fresh observable evidence appropriate to that claim.
- `Implemented` and `Verified` **MUST** remain distinct states.
- Test/build/lint/typecheck claims **MUST** reference commands or tool events that actually ran and their observed results.
- Focused checks **MUST NOT** be summarized as full-suite verification.
- Failed, skipped, cancelled, unavailable, or not-run checks **MUST** remain visible in the evidence ledger.
- Evidence tied to relevant files **MUST** become stale when those files change after the evidence sequence.
- A stale pass **MUST NOT** support a current `verified` status until refreshed.
- Partial milestones, plans, reports, caches, logs, or audit metadata **MUST NOT** substitute for the requested deliverable unless the user explicitly defined them as the deliverable.
- Final success **MUST** be blocked while any required row is `implemented_unverified`, `partial`, `blocked`, or `not_addressed`, unless the user explicitly accepts that exception.
- The implementing agent **MUST NOT** be the only verifier for high-risk or consequential changes when an independent verifier is available.
- Recovery loops **MUST** be bounded; after two unsuccessful verification/recovery cycles, the task **MUST** surface the blocker rather than repeat indefinitely.
- Completion reporting **MUST NOT** expose or request hidden chain-of-thought; it **SHOULD** report only requirements, artifacts, commands, observed results, risks, and verification status.
- A completion gate failure **MUST NOT** be overridden by changing wording from “verified” to an equivalent unsupported success claim.
