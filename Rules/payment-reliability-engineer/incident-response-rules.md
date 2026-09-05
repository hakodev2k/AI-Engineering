# Payment Incident Response Rules

## Purpose
Reduce customer and financial harm during payment incidents while preserving evidence for diagnosis and reconciliation.

## Scope
Availability incidents, duplicate charges, missing captures, provider outages, reconciliation gaps, security events, and payout failures.

## MUST
- Responders MUST first bound customer impact, affected payment states, providers, regions, and time windows using evidence.
- Mitigation MUST prioritize preventing further incorrect financial effects.
- Duplicate-charge or uncertain-state incidents MUST preserve transaction identifiers and reconciliation evidence.
- High-risk remediation, manual financial correction, credential rotation, or production configuration change MUST require the appropriate human approval.
- Significant incidents MUST record timeline, impact, mitigation, causal evidence, and corrective actions.

## MUST NOT
- MUST NOT delete or rewrite payment records to make state appear consistent.
- MUST NOT issue broad refunds or recharges without impact evidence and approved authority.
- MUST NOT claim root cause from correlation alone.

## SHOULD
- Add deterministic regression tests or release gates for confirmed failure modes.

## Exceptions
Emergency actions may follow incident authority but MUST be documented and reconciled afterward.

## Verification
Review incident records, provider evidence, telemetry, approvals, financial corrections, and follow-up tests.