# Delegated Context Freshness Rules

- A delegating agent **MUST** define the critical context file set before relying on delegated work.
- A child **MUST NOT** be treated as current merely because its parent is current.
- The host **MUST** compare a hash-bound epoch immediately before spawn/resume when critical context may have changed.
- A stale epoch **MUST** block delegation unless the child is explicitly refreshed and a new epoch is recorded.
- Freshness **MUST NOT** be inferred from modification time alone.
- The checker **MUST NOT** execute, import, source, or evaluate repository-controlled context files.
- Missing, newly created, deleted, or content-changed critical files **MUST** count as drift.
- The implementing agent **MUST NOT** be the sole verifier for a freshness exception.
- A refresh loop **MUST** stop after two failed rechecks and escalate with evidence.
- Teams **SHOULD** keep the critical set narrow, but **MUST NOT** omit correctness- or security-critical instructions merely to reduce overhead.
