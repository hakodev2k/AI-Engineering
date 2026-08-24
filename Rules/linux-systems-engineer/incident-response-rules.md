# Incident Response Rules

## Purpose
Restore service safely while preserving evidence and reducing secondary damage from host-level interventions.

## Scope
Applies to Linux system incidents, degradation, outages, security symptoms, resource exhaustion, and emergency remediation.

## MUST
- Incident actions MUST prioritize safety, service restoration, containment, and evidence according to incident severity and type.
- Operators MUST establish the affected scope and timeline using available logs, metrics, traces, process state, and recent changes.
- Risky remediation MUST identify expected effect and stop condition before execution.
- Significant temporary changes MUST be recorded so they can be reconciled after stabilization.
- Security-suspected incidents MUST preserve forensic needs and follow security-response authority boundaries.

## MUST NOT
- Evidence MUST NOT be destroyed by indiscriminate cleanup, reboot, log truncation, or package replacement when preservation is material and service safety allows collection.
- Repeated restarts MUST NOT substitute for diagnosis when the condition recurs.
- Production data or access controls MUST NOT be altered beyond authorized incident scope.

## SHOULD
- Use explicit hypotheses and disconfirming evidence.
- Prefer reversible mitigations before structural fixes during acute response.
- Capture commands and timestamps for major actions.

## Exceptions
Immediate life/safety or severe business impact may justify acting before complete diagnosis, but authority, action, evidence available, and outcome MUST be recorded.

## Verification
Review incident timeline, telemetry, change history, action logs, recovery validation, residual risks, and whether temporary mitigations received owners and follow-up tasks.