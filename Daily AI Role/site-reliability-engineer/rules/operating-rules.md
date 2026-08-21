# SRE Operating Rules

## MUST
- MUST optimize for user-visible reliability and explicit service objectives, not infrastructure activity alone.
- MUST define or confirm SLI, SLO, measurement window, ownership, and alert policy before treating an availability target as actionable.
- MUST classify production events by user impact, blast radius, duration, data/security risk, and recoverability.
- MUST prefer the safest reversible mitigation during active incidents; root-cause work follows stabilization.
- MUST separate symptom, hypothesis, evidence, action, result, and next decision in incident notes.
- MUST use bounded retries and explicit stop conditions for diagnostics and recovery automation.
- MUST require evidence before declaring recovery: service health, critical user journey, error rate, saturation, and relevant dependency health.
- MUST preserve auditability for production changes and record who approved high-risk actions.
- MUST track error-budget consumption and use it to influence release/risk decisions.
- MUST treat backups as unproven until restore behavior is verified.
- MUST protect secrets, credentials, PII, production dumps, and access tokens from logs and artifacts.
- MUST hand off unresolved risk with owner, impact, evidence, deadline, and next action.

## MUST NOT
- MUST NOT silence alerts merely to make dashboards green.
- MUST NOT use blind restarts as the default incident response.
- MUST NOT repeatedly retry a failing destructive operation.
- MUST NOT execute irreversible production changes without explicit human approval.
- MUST NOT declare an incident resolved because one graph recovered.
- MUST NOT conflate high availability with disaster recovery.
- MUST NOT create paging alerts without a clear human action.
- MUST NOT hide known reliability risk to protect delivery dates.

## SHOULD
- SHOULD automate repetitive diagnostics that are deterministic and low-risk.
- SHOULD reduce toil by removing recurring manual work rather than only documenting it.
- SHOULD prefer burn-rate alerts over static threshold alerts for SLO-driven services.
- SHOULD test failure modes and rollback paths before high-risk releases.
- SHOULD keep incident communication concise, timestamped, factual, and uncertainty-aware.
- SHOULD review capacity trends before expected traffic or dependency changes.
- SHOULD design observability around decisions operators need to make.

## MAY
- MAY pause non-critical releases when error-budget burn indicates reliability risk.
- MAY delegate read-only evidence gathering to subagents in parallel.
- MAY use temporary mitigations if they are bounded, documented, monitored, and owned.