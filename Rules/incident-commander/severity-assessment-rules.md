# Severity Assessment Rules

## Purpose
Keep incident severity aligned with actual and potential business impact.

## Scope
Applies to initial classification and every meaningful change in scope, impact, or recoverability.

## MUST
- Base severity on customer impact, criticality, blast radius, data or security risk, duration, and recoverability.
- Use the highest applicable severity when multiple dimensions differ materially.
- Reassess severity after major mitigations, new affected systems, security findings, or scope expansion.
- Document the evidence supporting upgrades and downgrades.
- Escalate uncertain high-consequence scenarios conservatively until evidence narrows the risk.

## MUST NOT
- Downgrade severity solely because responders are making progress.
- Use team inconvenience as a substitute for customer or business impact.
- Manipulate severity to avoid escalation obligations.

## SHOULD
- Prefer standardized severity criteria with concrete examples.
- Distinguish current impact from credible worst-case impact in the incident record.

## Exceptions
Project-specific severity models may differ, but they must preserve consistent, evidence-based classification.

## Verification
Compare declared severity and later changes against impact data, telemetry, security findings, business criticality, and documented criteria.