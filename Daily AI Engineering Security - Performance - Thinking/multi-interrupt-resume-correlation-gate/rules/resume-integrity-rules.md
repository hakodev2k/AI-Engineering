# Resume Integrity Rules

1. The system **MUST** read pending interrupt IDs from authoritative runtime/checkpoint state immediately before resume.
2. Pending interrupt IDs **MUST** be unique and non-empty.
3. Multi-interrupt resume **MUST** use an explicit ID-keyed mapping.
4. The response key set **MUST** equal the current pending interrupt ID set exactly before execution resumes.
5. A scalar or object-valued answer **MUST NOT** be interpreted as an interrupt map unless the envelope explicitly declares `mode: by_id`.
6. `mode: single` **MUST NOT** be accepted when pending interrupt count differs from one.
7. Correlation **MUST NOT** rely on array position, task scheduling order, timestamp order, or UI rendering order.
8. Stale or unknown interrupt IDs **MUST** block resume.
9. A changed checkpoint/pending set between validation and resume **MUST** trigger revalidation and **MUST NOT** silently reuse the previous decision.
10. Resume retries **MUST** be bounded to one state-refresh retry unless an operator explicitly starts a new recovery episode.
11. Application adapters **SHOULD** keep the canonical envelope separate from framework-specific command construction.
12. Logs **SHOULD** record IDs, mode, decision, and checkpoint identity while avoiding sensitive answer content by default.
13. The implementation agent **MUST NOT** be the only verifier for changes to resume correlation behavior.
