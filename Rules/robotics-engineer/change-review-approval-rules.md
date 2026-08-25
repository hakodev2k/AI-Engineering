# Change Review and Approval Rules
## Purpose
Apply senior engineering judgment to changes that can alter physical, safety, security, or production behavior.
## Scope
Code, firmware, hardware, configuration, calibration, limits, infrastructure, and operating procedures.
## MUST
- Classify change risk by physical consequence, reversibility, blast radius, compatibility, and evidence available.
- Require independent review for safety-, security-, control-, or production-critical changes.
- Document material assumptions, trade-offs, validation evidence, and rollback/recovery strategy.
- Obtain authorized human approval before production deployment, safety-control weakening, irreversible calibration/migration, high-risk access changes, or destructive actions.
- Distinguish analysis, recommendation, preparation, and execution authority.
## MUST NOT
- Force push or rewrite shared history as part of routine delivery.
- Let an automated agent silently exceed granted execution authority.
## SHOULD
- Prefer reversible, incremental changes with observable acceptance gates.
## Exceptions
Emergency actions require incident authority, minimal necessary scope, contemporaneous evidence, and retrospective review.
## Verification
Inspect pull requests, risk classification, approvals, test evidence, diffs, deployment records, and rollback readiness.