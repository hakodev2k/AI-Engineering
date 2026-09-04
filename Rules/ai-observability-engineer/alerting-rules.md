# Alerting Rules

## Purpose
Ensure alerts identify actionable AI production risk without creating noise that hides real incidents.

## Scope
Applies to reliability, latency, quality, cost, security, dependency, and observability-pipeline alerts.

## MUST
- Every paging alert MUST identify an actionable condition, accountable responder, severity, and investigation entry point.
- Alert thresholds MUST be justified by SLOs, risk limits, validated baselines, or known failure behavior.
- Alerts MUST distinguish symptoms from root-cause hypotheses.
- Alert routing MUST reflect ownership and escalation policy.
- Material alert changes MUST be reviewed and correlated with historical incident behavior.

## MUST NOT
- Alerts MUST NOT page solely on low-severity informational events.
- A dashboard threshold MUST NOT be copied into paging policy without validating operational significance.
- Persistent alerts MUST NOT be muted indefinitely without risk acceptance or remediation ownership.
- AI quality alerts MUST NOT rely on an unvalidated single proxy for high-impact escalation.

## SHOULD
- Prefer multi-window burn-rate or sustained-condition alerts over isolated transient spikes where appropriate.
- Include links to traces, dashboards, deployment history, and runbooks.

## Exceptions
Temporary muting requires reason, owner, expiry, and documented residual risk.

## Verification
Inspect alert definitions, ownership, recent firing history, false-positive rates, mute records, and incident outcomes. Test representative alert paths in a controlled environment.