# Incident Response Rules

## Purpose
Control production incidents through clear roles, evidence, containment, communication, and recovery.

## Scope
Applies to service degradation, outages, data-risk events, security-adjacent reliability incidents, and major operational failures.

## MUST
- Significant incidents MUST have an identified incident commander or accountable coordinator.
- Response MUST prioritize user safety, containment, and restoration before nonessential analysis.
- Major actions MUST be timestamped and recorded with observed evidence and outcome.
- Escalation MUST occur when impact, uncertainty, or required authority exceeds the current responders.
- Recovery MUST be verified through user-facing health and telemetry, not deployment completion alone.

## MUST NOT
- MUST NOT make multiple high-risk changes simultaneously when doing so prevents attribution or rollback.
- MUST NOT delete diagnostic evidence merely to simplify recovery.
- MUST NOT declare resolution while critical symptoms remain unexplained or unverified.

## SHOULD
- Separate command, operations, and communications roles during large incidents.
- Prefer reversible mitigation before invasive remediation.

## Exceptions
Emergency action may bypass normal workflow only when delay creates greater risk; action, reason, approver, and follow-up MUST be recorded.

## Verification
Review incident timelines, action logs, escalation records, recovery evidence, and post-incident findings.