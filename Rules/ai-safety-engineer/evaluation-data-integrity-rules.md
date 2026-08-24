# Evaluation Data Integrity Rules

## Purpose
Preserve the validity and independence of safety evaluation evidence.

## Scope
Applies to benchmark construction, labeling, storage, access, reuse, and contamination management.

## MUST
- Version evaluation datasets and record provenance, transformations, labeling criteria, and known limitations.
- Restrict access to held-out safety sets when exposure could bias development.
- Detect and disclose known or suspected contamination.
- Separate development/tuning sets from final acceptance evidence where practical.

## MUST NOT
- Modify labels or exclusions after seeing model results without documented rationale and auditability.
- Report contaminated benchmarks as independent evidence without qualification.
- Delete unfavorable evaluation cases merely to improve metrics.

## SHOULD
- Use adjudication for ambiguous high-impact labels.
- Maintain rotating hidden sets for capabilities prone to rapid overfitting.

## Exceptions
Reuse of exposed data requires justification, explicit labeling as non-independent evidence, and complementary fresh evaluation.

## Verification
Review dataset hashes, provenance, access records, labeling audits, contamination analysis, and separation between tuning and acceptance sets.
