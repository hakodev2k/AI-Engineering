# Error Analysis Rules

## Purpose
Turn model failures into evidence for targeted engineering decisions.

## Scope
False positives, false negatives, localization errors, identity switches, OCR errors, segmentation failures, and downstream failures.

## MUST
- Material regressions MUST be investigated using representative failing samples and bounded root-cause hypotheses.
- Errors MUST be segmented by relevant class, environment, device, distance, scale, occlusion, quality, and other deployment factors.
- Proposed fixes MUST identify which error mode they target and how success will be measured.
- Recurrent high-impact failures MUST become regression cases or evaluation slices when feasible.

## MUST NOT
- Broad retraining or architecture changes MUST NOT be justified solely by anecdotal examples.
- Cherry-picked successes MUST NOT substitute for systematic error analysis.

## SHOULD
- Error taxonomies SHOULD remain stable enough to compare model generations.

## Exceptions
Urgent mitigations may precede full root-cause analysis when risk reduction is time-critical; follow-up evidence remains required.

## Verification
Inspect error dashboards, sampled failures, taxonomy counts, regression suites, hypotheses, and before/after slice metrics.