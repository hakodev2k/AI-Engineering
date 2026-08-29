# Auditability and Records Rules

## Purpose
Ensure material AI governance decisions and system states can be reconstructed from trustworthy records without relying on memory or unverifiable claims.

## Scope
Applies to system inventory, risk assessments, approvals, evaluations, incidents, exceptions, changes, model versions, configurations, evidence, and governance review history.

## MUST
- High-risk AI systems MUST retain enough records to reconstruct what system version was approved, what evidence supported the decision, and which controls were active.
- Governance records MUST identify authorship or source, relevant timestamps, system or release scope, and version where applicable.
- Approval, exception, incident, and risk-acceptance records MUST preserve decision rationale and responsible authority.
- Evidence used for material decisions MUST be immutable or protected against unauthorized alteration to a degree appropriate to its risk.
- Retention periods MUST align with applicable policy, legal, contractual, operational, and investigation requirements.
- Access to sensitive governance evidence MUST follow least privilege while remaining available to authorized reviewers.
- Corrections to material records MUST preserve an audit trail rather than silently replacing history.

## MUST NOT
- MUST NOT rely on chat messages, ephemeral dashboards, or personal notes as the sole authoritative evidence for high-risk approval.
- MUST NOT retain sensitive prompts, outputs, personal data, or secrets merely because they may be useful for audit.
- MUST NOT fabricate missing historical evidence after an event; gaps MUST be identified explicitly.
- MUST NOT delete records subject to an active incident, legal hold, investigation, or required retention period.

## SHOULD
- Evidence collection SHOULD be automated from authoritative engineering and operational systems where practical.
- Records SHOULD use stable identifiers linking system, model, release, risk, evaluation, and approval artifacts.
- Audit packages SHOULD distinguish raw evidence from reviewer interpretation.

## Exceptions
Exceptions MUST document the missing or shortened record, reason, affected assurance claim, compensating evidence, residual risk, duration, and authorized approval. Required legal holds cannot be waived through governance exception.

## Verification
Sample lifecycle decisions and reconstruct them from stored records. Check version identifiers, access controls, retention configuration, evidence integrity, change history, and links between inventory, evaluations, approvals, incidents, and exceptions.