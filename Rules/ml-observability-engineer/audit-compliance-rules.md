# Audit and Compliance Observability

## Purpose
Ensure monitoring evidence can support review of regulated, governed, or high-impact ML behavior without compromising sensitive data.

## Scope
Applies to audit trails for model versions, evaluations, policy decisions, access, changes, alerts, and production investigations.

## MUST
- High-impact model decisions and monitoring changes MUST retain traceable version, timestamp, actor or automation identity, and approval evidence where required.
- Audit evidence MUST be protected from unauthorized alteration and retained according to applicable policy.
- Compliance-relevant metrics MUST have documented definitions and reproducible calculation logic.
- Access to sensitive monitoring evidence MUST be logged and periodically reviewable.

## MUST NOT
- MUST NOT fabricate, backfill, or alter audit evidence to make historical behavior appear compliant.
- MUST NOT expose regulated data in broadly accessible dashboards.
- MUST NOT treat dashboard screenshots as the sole durable audit record when structured evidence is available.

## SHOULD
- Automate evidence capture at deployment, evaluation, and approval boundaries.
- Minimize retained sensitive content while preserving required provenance.

## Exceptions
Deviations from required evidence retention or access controls require documented legal or governance basis and explicit accountable approval.

## Verification
Inspect audit logs, retention and access settings, change histories, evaluation artifacts, approval records, and reproducibility checks.