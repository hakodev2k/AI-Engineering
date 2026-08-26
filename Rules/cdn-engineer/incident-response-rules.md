# Incident Response Rules

## Purpose
Restore CDN-delivered services safely while preserving evidence for durable correction.

## Scope
Applies to outages, elevated latency, cache corruption, routing failures, certificate incidents, attacks, and origin overload.

## MUST
- Incident actions MUST prioritize user impact, security, reversibility, and blast-radius control.
- Hypotheses MUST be distinguished from confirmed facts.
- Material actions and observed outcomes MUST be timestamped.
- Mitigation MUST be separated from root-cause determination.
- Risky production actions MUST follow incident authority and approval boundaries.
- After stabilization, root cause or bounded causal evidence MUST inform corrective actions.

## MUST NOT
- MUST NOT purge, reroute, disable security, or bypass TLS reflexively without evaluating secondary impact.
- MUST NOT destroy logs or diagnostic state needed for investigation.
- MUST NOT attribute failure to the CDN solely because users observe edge errors.

## SHOULD
- Compare affected and healthy regions, paths, protocols, and cache states.
- Maintain tested runbooks for common high-impact failures.
- Record provider escalations and external dependencies.

## Exceptions
Immediate safety actions may precede complete diagnosis when delay materially increases harm; rationale and follow-up verification MUST be recorded.

## Verification
Review incident timeline, dashboards, logs, traces, configuration diffs, action approvals, mitigation outcomes, root-cause evidence, and corrective-action tracking.