# Postprocessing Rules

## Purpose
Make downstream interpretation of model outputs deterministic, validated, and compatible.

## Scope
Thresholding, NMS, decoding, mask resizing, tracking association, OCR decoding, filtering, and business-rule mapping.

## MUST
- Postprocessing parameters MUST be versioned with the evaluated model configuration.
- Thresholds MUST be selected using representative validation evidence and operational error costs.
- Ordering, tie-breaking, clipping, coordinate conversion, and empty-output behavior MUST be deterministic where required.
- Changes to postprocessing MUST trigger end-to-end regression evaluation.

## MUST NOT
- Thresholds MUST NOT be tuned on production incidents ad hoc without controlled validation and change management.
- Evaluation postprocessing MUST NOT differ silently from serving behavior.

## SHOULD
- Postprocessing SHOULD be kept simple and observable unless complexity yields measured benefit.

## Exceptions
Emergency threshold changes require explicit risk approval, monitoring, rollback criteria, and subsequent validation.

## Verification
Compare offline and serving outputs on golden inputs, inspect parameter versions, run boundary tests, and reproduce threshold-selection analysis.