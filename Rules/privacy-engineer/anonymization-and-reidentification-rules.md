# Anonymization and Re-identification Rules

## Purpose
Prevent unsupported claims that data is anonymous and manage re-identification risk.

## Scope
Aggregated datasets, research extracts, analytics outputs, public releases, synthetic data, and de-identified exports.

## MUST
- Anonymization claims MUST be supported by a documented method and re-identification risk assessment.
- Assessments MUST consider auxiliary data, uniqueness, rare combinations, temporal linkage, and realistic attacker capability.
- Published aggregates MUST use thresholds or other controls when small groups create disclosure risk.
- Material changes in dataset richness or external data availability MUST trigger reassessment.

## MUST NOT
- MUST NOT treat removal of names or direct identifiers as sufficient anonymization.
- MUST NOT permit unauthorized re-identification attempts.

## SHOULD
- Prefer privacy-preserving aggregation, perturbation, generalization, or synthetic approaches when utility permits.

## Exceptions
Exceptions require documented risk acceptance, owner, safeguards, and approval.

## Verification
Review anonymization methodology, attack simulations, uniqueness analysis, aggregation thresholds, and release approvals.