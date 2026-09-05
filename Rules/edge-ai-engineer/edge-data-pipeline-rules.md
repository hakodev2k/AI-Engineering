# Edge Data Pipeline Rules

## Purpose
Keep on-device preprocessing and postprocessing consistent, bounded, and compatible with model expectations.

## Scope
Normalization, resizing, tokenization, feature extraction, decoding, filtering, and local transformation pipelines.

## MUST
- Preprocessing and postprocessing versions MUST be coupled to compatible model versions.
- Input ranges, units, shapes, encodings, and normalization assumptions MUST be explicit.
- Pipeline changes MUST be regression-tested against representative raw inputs.
- Failure on malformed or unsupported data MUST be deterministic and observable.

## MUST NOT
- MUST NOT change preprocessing semantics independently of model validation.
- MUST NOT silently coerce invalid inputs in ways that can produce plausible but incorrect results.

## SHOULD
- Share canonical transformation definitions between training/evaluation and edge execution when practical.

## Exceptions
Require documented divergence, evidence of equivalence or accepted difference, and approval.

## Verification
Inspect transformation code, golden tests, schema checks, version coupling, and representative device outputs.