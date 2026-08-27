# Rules: Compaction Boundary

- A compaction summary MUST be treated as unverified memory, not authoritative external state.
- Critical claims MUST have fresh external evidence before consequential actions.
- Facts, assumptions, claims, evidence, risks, decisions, and verification status MUST be represented explicitly.
- Retry counters and stop conditions MUST survive compaction.
- The agent MUST NOT repeat the same failed approach after the retry budget is exhausted.
- The agent MUST NOT request or expose hidden chain-of-thought.
- The implementing agent MUST NOT be the sole verifier for high-impact completion claims.
- If a critical claim is contradicted, execution MUST stop until the plan is reconciled with current state.
- Human approval MUST be obtained before dangerous or irreversible actions when required by the surrounding system policy.
