# Regression Gate Rules

## Purpose
Prevent AI releases from degrading critical behavior despite improvements in aggregate metrics.

## Scope
Applies to model, prompt, retrieval, tool, policy, orchestration, and configuration changes evaluated before release.

## MUST
- Release gates MUST define explicit pass, fail, and escalation criteria before candidate results are reviewed.
- Critical safety, security, policy, and task-completion regressions MUST have non-compensatory thresholds where appropriate.
- Candidate systems MUST be compared against the approved production or reference baseline under equivalent evaluation conditions.
- New failures on high-severity test cases MUST be reviewed individually even when aggregate metrics improve.
- Gate overrides MUST document evidence, risk, owner, expiry or follow-up action, and human approval.

## MUST NOT
- MUST NOT move thresholds after seeing results solely to make a release pass.
- MUST NOT allow gains in low-risk categories to cancel unacceptable regressions in high-risk categories.
- MUST NOT treat missing evaluation results as passing results.

## SHOULD
- Gates SHOULD distinguish hard blockers from warning thresholds requiring expert review.
- Repeated borderline failures SHOULD trigger investigation into benchmark variance or system instability.

## Exceptions
Emergency fixes may use reduced evaluation scope only when risk is bounded, compensating validation is performed, and accountable approval is recorded.

## Verification
Inspect gate configuration, baseline identity, threshold history, failed-case review records, override approvals, and CI or evaluation-run evidence showing deterministic gate outcomes.