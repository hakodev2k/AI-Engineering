# Anonymization and Pseudonymization Rules

## Purpose
Ensure de-identification controls are designed against realistic re-identification risk rather than labels alone.

## Scope
Applies to anonymized, pseudonymized, tokenized, masked, aggregated, and synthetic representations of personal data.

## MUST
- De-identification claims MUST state the transformation, attacker assumptions, auxiliary-data risks, and intended use.
- Pseudonymous identifiers MUST be protected as personal data whenever re-linking remains possible.
- Re-identification keys or mapping tables MUST be access-controlled separately from pseudonymized datasets.
- High-risk anonymization claims MUST be supported by documented technical analysis or testing.

## MUST NOT
- Hashing a direct identifier MUST NOT automatically be treated as anonymization.
- Small-group aggregates MUST NOT be released without assessing singling-out or inference risk.
- Re-linking mechanisms MUST NOT be exposed to analysts or services that do not require them.

## SHOULD
- Transformations SHOULD minimize precision and linkage while preserving required utility.
- Re-identification risk SHOULD be reassessed when datasets are combined or new auxiliary data becomes available.

## Exceptions
Exceptions require documented risk, business necessity, safeguards, and accountable approval.

## Verification
Inspect transformation code, key storage, access policies, sample outputs, linkage tests, aggregation thresholds, and re-identification assessments.