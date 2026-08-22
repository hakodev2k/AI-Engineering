# Governance Integrity Rules

## Scope
Applies whenever an agent compacts, summarizes, truncates, evicts, resumes, or reconstructs context that can influence tool use or authorization.

## Rules
- Active security constraints MUST have stable IDs, versions, hashes, scope, source, and lifecycle state outside lossy conversational context.
- Lossy summaries MUST NOT be the authoritative source for permissions, prohibitions, approval state, trust boundaries, or secret-handling rules.
- Every compaction candidate MUST be validated against the authoritative active-constraint set before it replaces the prior context.
- A required active constraint MUST NOT be removed because a summarizer judged it irrelevant.
- Post-compaction context MUST contain stable references to all active required constraints or an application-controlled mechanism that deterministically reloads them before protected actions.
- Tool authorization MUST resolve current constraints from the authoritative ledger at action time.
- Approval records MUST be bound to action scope, actor/session identity where applicable, policy version/hash, and expiry/revocation state.
- A policy version/hash change MUST invalidate approvals that depended on the prior version unless an explicit migration rule proves equivalence.
- Compaction MUST behave as a two-phase transition: candidate generation → deterministic governance validation → commit.
- A failed validation MUST preserve the last known-good context and MUST NOT silently continue with the invalid candidate.
- Recovery MUST NOT weaken security constraints to make the session fit the context window.
- Governance validation MUST be deterministic and auditable; model judgment alone is insufficient.
- Compaction/recovery retries MUST be bounded to 2 attempts per candidate strategy.
- High-impact tool calls after compaction MUST be blocked when the governance ledger is unavailable, corrupted, or inconsistent with pinned references.

## Stop conditions
Stop and require operator/human review when authoritative policy state is unavailable, a required constraint cannot be reconciled, integrity hashes mismatch without an approved migration, or recovery would require dropping a security requirement.
