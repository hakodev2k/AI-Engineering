# Configuration Safety
## Purpose
Prevent invalid or conflicting mesh configuration from reaching production.
## Scope
Policy objects, route configuration, selectors, defaults, precedence, and validation.
## MUST
- Configuration MUST pass schema and semantic validation before promotion.
- Selectors and inheritance MUST be reviewed for unintended scope.
- High-risk changes MUST have a deterministic rollback path.
## MUST NOT
- MUST NOT apply unreviewed global defaults to production.
- MUST NOT rely on object creation success as proof the effective configuration is correct.
- MUST NOT leave conflicting policies unresolved.
## SHOULD
- Policy repositories SHOULD use automated linting, policy tests, and diff previews.
## Exceptions
Emergency changes require incident linkage, peer review when feasible, and post-change verification.
## Verification
Inspect rendered/effective config, CI validation, policy diffs, conflict analyzers, and targeted connectivity tests.