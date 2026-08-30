# Security Requirements Rules

## Purpose
Ensure security requirements are explicit, traceable, risk-based, and testable before architecture or implementation decisions are finalized.

## Scope
Applies to new systems, material changes, integrations, migrations, and security-sensitive features.

## MUST
- Security requirements MUST be derived from business impact, data classification, threat exposure, regulatory obligations, and operational context.
- Each material requirement MUST have an accountable owner and a verification method.
- High-risk requirements MUST be traceable to architecture decisions, controls, and acceptance evidence.
- Security requirements MUST distinguish prevention, detection, response, recovery, and assurance needs.
- Ambiguous requirements MUST be clarified before approving architecture that depends on them.

## MUST NOT
- MUST NOT treat a generic framework checklist as a substitute for system-specific requirements.
- MUST NOT approve architecture when critical security assumptions remain undocumented.
- MUST NOT downgrade a mandatory security requirement solely to meet delivery dates without explicit risk acceptance.

## SHOULD
- Requirements SHOULD be expressed in measurable terms where practical.
- Reusable baseline requirements SHOULD be maintained separately from system-specific constraints.

## Exceptions
Exceptions require documented rationale, affected assets, risk, compensating controls, verification evidence, expiration or review date, and accountable approval.

## Verification
Review requirement traceability, threat models, control mappings, architecture decisions, test evidence, and approved exceptions.