# Production Change Approval

## Purpose
Prevent observability work from silently exceeding authority when changes can affect production models, traffic, data, security, or detection coverage.

## Scope
Applies to production deployments, monitoring-policy changes, baseline resets, alert suppression, destructive actions, access changes, and emergency remediation.

## MUST
- Work MUST distinguish analysis, recommendation, preparation, and execution; execution MUST occur only within explicitly granted authority.
- Human approval MUST be obtained before destructive data operations, production deployment, security-control weakening, irreversible monitoring changes, or disabling critical detection unless an established emergency procedure explicitly authorizes the action.
- Approval requests MUST state impact, evidence, rollback or recovery plan, verification steps, and residual risk.
- Executed production changes MUST be traceable to the approved scope.

## MUST NOT
- MUST NOT suppress or redefine critical metrics merely to make a system appear healthy.
- MUST NOT delete evidence needed for an active investigation without authorized retention handling.
- MUST NOT broaden access or weaken privacy controls to simplify diagnosis without approval.

## SHOULD
- Prefer reversible, narrowly scoped changes and progressive rollout.
- Require independent review for changes that can hide model-quality or safety regressions.

## Exceptions
Emergency execution is allowed only under preauthorized incident procedures and MUST be documented and reviewed after stabilization.

## Verification
Review change records, approvals, diffs, access logs, rollback evidence, post-change validation, and incident records for scope compliance.