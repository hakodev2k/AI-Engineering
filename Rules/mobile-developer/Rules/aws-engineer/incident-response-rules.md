# Incident Response Rules
## Purpose
Restore service safely while preserving evidence and controlling secondary damage.
## Scope
AWS production incidents, security events, outages, degradation, and operational recovery.
## MUST
- Establish incident owner, severity, affected scope, communication path, and current evidence.
- Separate containment, mitigation, recovery, and root-cause conclusions.
- Preserve relevant logs, metrics, traces, CloudTrail events, and configuration state.
- Validate recovery against user-impact and system-health evidence.
## MUST NOT
- Make irreversible cleanup changes that destroy evidence without explicit authorization.
- State a root cause as fact when evidence only supports a hypothesis.
## SHOULD
- Prefer reversible mitigations that reduce impact quickly without expanding blast radius.
- Record follow-up actions with owners after stabilization.
## Exceptions
Immediate life/safety or severe security containment may justify abbreviated process, with retrospective documentation.
## Verification
Review incident timeline, evidence, change records, communications, recovery metrics, root-cause analysis, and follow-up ownership.