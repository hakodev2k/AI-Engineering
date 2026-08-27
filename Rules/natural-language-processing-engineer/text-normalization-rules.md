# Text Normalization Rules

## Purpose
Preserve linguistic meaning while producing stable, reproducible text representations.

## Scope
Normalization, Unicode handling, casing, whitespace, punctuation, locale-sensitive transforms, and preprocessing contracts.

## MUST
- Normalization MUST define its Unicode form, locale assumptions, ordering, and reversibility requirements.
- Training and serving MUST apply equivalent normalization for the same model contract.
- Meaning-changing transforms MUST be justified with task evidence and covered by representative tests.
- Raw input MUST remain recoverable when audit, debugging, or reprocessing requirements demand it.

## MUST NOT
- MUST NOT strip accents, punctuation, casing, or symbols merely for convenience when they can carry task signal.
- MUST NOT silently mix normalization versions within one dataset or production path.
- MUST NOT use locale-sensitive behavior without an explicit locale policy.

## SHOULD
- Normalization SHOULD be idempotent and versioned.
- Pipelines SHOULD preserve offsets when downstream span alignment depends on them.

## Exceptions
Exceptions require documented task rationale, affected languages, measured impact, migration implications, and reviewer approval for production contract changes.

## Verification
Use golden multilingual fixtures, idempotence tests, train/serve parity tests, offset-alignment checks, and dataset diffs. Review representative failures before approving a normalization change.