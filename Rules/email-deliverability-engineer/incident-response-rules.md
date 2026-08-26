# Deliverability Incident Response Rules

## Purpose
Restore safe delivery quickly while preserving evidence and avoiding reputation-amplifying actions.

## Scope
Blocks, deferrals, authentication outages, complaint spikes, queue failures, provider incidents, and severe placement degradation.

## MUST
- Incidents MUST establish affected streams, recipient domains, start time, recent changes, business impact, and current containment.
- Mitigation MUST prioritize stopping harmful traffic before attempting reputation recovery.
- Diagnostic hypotheses MUST be tested against headers, SMTP responses, provider events, DNS, metrics, and change history.
- High-risk production changes MUST have explicit owner, approval, verification, and rollback.
- Recovery MUST be gradual when reputation or receiver trust may have been damaged.
- Post-incident review MUST capture root cause or bounded causal evidence, detection gaps, and corrective actions.

## MUST NOT
- MUST NOT rotate infrastructure blindly, spam receiver support channels, or increase retries without evidence.
- MUST NOT delete diagnostic data needed to understand the incident.
- MUST NOT declare recovery from a short-lived metric improvement alone.

## SHOULD
- Maintain receiver and provider escalation information before incidents occur.
- Separate containment, remediation, and recovery decisions.

## Exceptions
Emergency action may precede full diagnosis when ongoing harm is clear, but scope, evidence, approval, and follow-up MUST be recorded.

## Verification
Review incident timeline, evidence, approvals, changes, recovery metrics, postmortem actions, and whether recurrence tests or monitors were added.