# Rules: Subagent Handoff Acceptance

1. A child status of `completed` or `success` **MUST NOT** by itself satisfy parent acceptance.
2. Every accepted child **MUST** provide either a non-empty inline deliverable or a durable artifact reference retrievable by the parent.
3. Artifact handoffs **MUST** include an integrity digest when policy requires it, and the parent **MUST** verify the digest before acceptance.
4. Terminal reasons indicating deferred, cancelled, stalled, interrupted, or token-limited work **MUST** block completion unless task-specific policy explicitly classifies the work as complete through separate evidence.
5. Any unfinished tool call **MUST** block a normal success handoff.
6. Required verification evidence **MUST** be present before the parent marks the delegated task complete.
7. Long-running delegated work **SHOULD** persist externally useful checkpoints so a lost final response does not erase all evidence.
8. Checkpoints **MUST NOT** be presented as the final deliverable unless they satisfy the original acceptance criteria.
9. Retry loops **MUST** be bounded to two recovery attempts and each retry **MUST** address a named blocking reason.
10. The implementing child **MUST NOT** be the only verifier for high-risk code, security, deployment, or irreversible changes.
11. The system **MUST NOT** persist or request hidden chain-of-thought as a durability mechanism.
12. A parent **MUST** distinguish `Implemented`, `Measured`, and `Verified` states in final task status.
