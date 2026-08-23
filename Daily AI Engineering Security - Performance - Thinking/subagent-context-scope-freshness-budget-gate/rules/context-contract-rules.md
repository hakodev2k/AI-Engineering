# Context Contract Rules

- Every child dispatch MUST have a manifest of context sources and per-source token counts.
- Every source MUST declare provenance and whether it is required or optional.
- Optional memory MUST NOT be injected when the child has not opted in.
- Required security, user, task, and repository constraints MUST NOT be dropped solely to save tokens.
- Context freshness MUST be evaluated at dispatch time for mutable required sources.
- A cache hit or parent-session snapshot MUST NOT be treated as freshness evidence.
- Child token budgeting MUST use the child model/window, not the coordinator's window.
- Required sources changed after capture MUST be refreshed before dispatch or the dispatch MUST be blocked.
- Refresh/re-audit MUST be bounded to one cycle per dispatch.
- If required context alone exceeds budget, the runtime MUST block, escalate, or route to a suitable model; it MUST NOT silently truncate.
- Final manifest and measured input tokens MUST be logged for verification.
- Optimization success MUST include a quality/regression check, not token reduction alone.