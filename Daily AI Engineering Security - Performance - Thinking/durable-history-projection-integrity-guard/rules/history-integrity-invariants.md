# Durable History Integrity Rules

1. The durable event log **MUST** be treated as authoritative over a derived UI/resume projection unless a stronger source is explicitly defined.
2. A resumed agent **MUST NOT** treat projected history as complete until ordinal/range coverage has been checked against the durable source.
3. Projection readers **MUST NOT** silently stop on an unsupported non-terminal record; they **MUST** emit the failing ordinal/type and a recoverable error artifact.
4. Missing projected ordinals that contain user, assistant, tool, decision, approval, or terminal events **MUST** block normal reasoning continuation.
5. Durable terminal evidence and projected terminal status **MUST** agree before a thread is reported complete, interrupted, or in progress.
6. A renderer/UI **SHOULD** expose whether history is partial and the loaded/expected range; invisible truncation **MUST NOT** be represented as complete history.
7. Rebuild/replay loops **MUST** be bounded. The same deterministic failing ordinal **MUST NOT** be retried more than twice without changing the parser, migration, or quarantine policy.
8. Recovery **MUST NOT** discard durable records merely to make the projection succeed. A quarantined non-critical record must remain referenced by ordinal, type, hash, and reason.
9. A degraded recovery mode **MUST** be read-only for consequential actions until missing critical history is restored or explicitly reviewed by a human.
10. The agent performing a projection repair **MUST NOT** be the sole verifier of the repaired projection.
11. Verification evidence **MUST** distinguish durable presence, projection presence, renderer visibility, and terminal-state consistency.
12. Unsupported conclusions based on incomplete history **MUST** be withdrawn or reverified after recovery.
