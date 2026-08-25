# Rules: Authorization Boundary

- A tool dispatcher **MUST** compute authorization from request identity/policy and the effective request tool set immediately before execution.
- Resolver discovery **MUST NOT** grant execution authority by itself.
- A tool absent from the effective request tool set **MUST** be blocked unless an explicit, independently authorized global exception exists.
- Resolver fallback **MUST** default to disabled.
- Enabling fallback **MUST** require a documented owner, threat review, test coverage, and explicit allow-set.
- Model-visible tool schemas **MUST NOT** be cited as proof that dispatch is authorized.
- High-risk/destructive tools **MUST** retain their own authorization and human-approval controls after parity passes.
- Dynamic tool-list changes **MUST** invalidate stale authorization decisions.
- Malformed or missing request authorization state **MUST** fail closed.
- Audit records **MUST NOT** include raw secrets or unnecessary argument payloads.
- Tests **MUST** include a tool known to the global resolver but absent from the request.
- The implementing agent **MUST NOT** be the only verifier of a security-boundary change.
- Teams **SHOULD** measure fallback dispatch frequency and eliminate unused global resolver exposure.