# Continuous Monitoring Rules

## Purpose
Detect compliance drift after release instead of relying only on point-in-time reviews.

## Scope
Applies to configurations, access, dependencies, control health, data handling, evidence freshness, and policy-relevant runtime state.

## MUST
- Controls whose state can drift MUST define a monitoring or periodic revalidation method.
- Monitoring frequency MUST reflect the speed and impact of plausible change.
- Detected material drift MUST create an owned remediation or escalation record.
- Missing monitoring data MUST be treated as unknown state, not evidence of compliance.

## MUST NOT
- MUST NOT claim continuous compliance from annual or one-time evidence alone.
- MUST NOT suppress recurring control failures without documented root-cause treatment or approved risk acceptance.

## SHOULD
- Automate control-health dashboards and aging indicators for stale evidence.

## Exceptions
Reduced monitoring requires documented stability evidence, residual risk, review interval, and approval.

## Verification
Inspect monitoring jobs, dashboards, alert history, stale-evidence reports, remediation records, and control review cadence.