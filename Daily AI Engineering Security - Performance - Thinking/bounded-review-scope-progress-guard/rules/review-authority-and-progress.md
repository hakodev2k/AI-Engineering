# Rules — Review Authority and Progress

- Reviewers **MUST** identify defects but **MUST NOT** redefine product requirements or authorize scope expansion.
- A finding **MUST** be blocking only when it maps to an approved requirement, is caused by the reviewed diff, is reproducible under stated assumptions, and has evidence.
- Out-of-scope findings **MUST** be recorded separately and **MUST NOT** enter the active implementation loop without owner approval.
- Severity labels **MUST NOT** substitute for scope authorization.
- The coordinator **MUST** maintain a stable approved-requirements ledger during a review cycle.
- Progress **MUST** be measured using accepted artifacts, passing tests, completed implementation slices, or equivalent state changes; messages/tool calls **MUST NOT** count as production progress.
- Review/rework loops **MUST** have a configured maximum cycle count.
- A cycle with no measurable progress and no valid blocker **MUST** stop rather than auto-continue.
- A blocking finding that remains unresolved after the retry budget **MUST** escalate with evidence.
- The implementing agent **MUST NOT** be the only final verifier when the change is high-risk.
