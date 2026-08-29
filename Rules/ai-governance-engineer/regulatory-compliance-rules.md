# AI Regulatory Compliance Rules

## Purpose
Ensure AI systems are evaluated against applicable legal, regulatory, contractual, and policy obligations without treating compliance as a one-time launch activity.

## Scope
Applies to jurisdictional applicability, regulatory classification, prohibited practices, documentation duties, user rights, record retention, reporting, and control changes driven by external obligations.

## MUST
- Each material AI use case MUST identify relevant jurisdictions, regulatory regimes, contractual commitments, and internal policies before production approval.
- Applicability conclusions MUST be documented with the authoritative source, interpretation owner, and assumptions that could change the conclusion.
- Regulatory obligations MUST be translated into concrete system, process, evidence, and review requirements.
- Changes in system purpose, users, geography, autonomy, data, model, or provider MUST trigger applicability reassessment when they can alter obligations.
- Prohibited practices or mandatory legal constraints MUST block deployment unless an authorized legal interpretation establishes that the restriction does not apply.
- Required records and evidence MUST be retained for the applicable period and remain attributable to the relevant system version.

## MUST NOT
- MUST NOT claim regulatory compliance solely because a vendor, model, or cloud provider advertises compliance.
- MUST NOT treat legal review as equivalent to technical control verification.
- MUST NOT rely on outdated regulatory assumptions after material law, guidance, or deployment changes.
- MUST NOT use an internal risk acceptance to waive a binding legal or contractual obligation.

## SHOULD
- Regulatory mappings SHOULD reuse common controls where requirements are equivalent while preserving jurisdiction-specific differences.
- High-risk systems SHOULD track regulatory change signals and assigned owners for reassessment.
- Compliance evidence SHOULD be generated from normal engineering and operational workflows where possible rather than reconstructed manually after the fact.

## Exceptions
Interpretive exceptions MUST be owned by the appropriate legal or compliance authority and document rationale, scope, assumptions, residual risk, and review triggers. Engineering teams cannot unilaterally waive external obligations.

## Verification
Inspect applicability assessments, legal or compliance interpretations, control mappings, evidence records, retention settings, release approvals, and change history. Sample obligations and verify implementation evidence exists for the released system.