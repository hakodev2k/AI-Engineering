# Incident Response Rules

## Purpose
Provide disciplined network incident handling that restores service while preserving evidence and minimizing blast radius.

## Scope
Production incidents involving connectivity, degradation, failover, shared network services, or configuration changes.

## MUST
- Incident response MUST prioritize user impact reduction and service restoration.
- Responders MUST identify recent relevant changes before making broad corrective actions.
- Mitigation decisions MUST use available telemetry, topology, and dependency evidence.
- Significant incidents MUST record timeline, impact, mitigation, causal evidence, and follow-up actions.
- High-risk remediation MUST follow required approval authority.

## MUST NOT
- MUST NOT destroy logs, configuration history, or topology evidence needed for investigation.
- MUST NOT make multiple unrelated emergency changes without tracking them.
- MUST NOT declare root cause from timing correlation alone.

## SHOULD
- Prefer reversible containment before complex repair during active impact.
- Add regression checks for confirmed failure modes.

## Exceptions
Authorized emergency actions may precede normal review but MUST be documented afterward.

## Verification
Review incident records, telemetry, change history, mitigation evidence, and corrective tests.