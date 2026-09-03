# Grounding and Localization

## Purpose
Connect model outputs to concrete regions, timestamps, spans, objects, or source segments so multimodal predictions are traceable and spatially or temporally precise.

## When to use
Use for object grounding, phrase-region alignment, temporal event localization, document citations, visual referring expressions, or any high-trust system that must show evidence.

## Inputs
Annotated regions or timestamps, model outputs, source media, coordinate conventions, evaluation thresholds.

## Preconditions
Define the required localization granularity and the coordinate or temporal reference system.

## Context to inspect
Inspect image resizing/cropping, page coordinates, video frame rates, audio timestamps, token spans, region proposal logic, and source transformations.

## Core knowledge
Grounding errors can arise even when semantic answers are correct. Coordinate transforms, crop offsets, frame-rate conversions, and tokenization must be reversible. Localization confidence should be evaluated separately from answer confidence.

## Procedure
1. Define grounding target types and coordinate systems.
2. Preserve source-to-model transform metadata.
3. Build or select region/span/timestamp supervision.
4. Train or configure grounding outputs.
5. Reverse-transform predictions to source coordinates.
6. Add bounds and consistency validation.
7. Evaluate semantic correctness and localization separately.
8. Test resized, cropped, rotated, and variable-duration inputs.
9. Inspect ambiguous multi-object references.
10. Calibrate thresholds for acceptable overlap or timing error.
11. Expose evidence to downstream consumers.
12. Log ungrounded or weakly grounded outputs for review.

## Decision points
Use explicit detector-style grounding when precise coordinates matter; use attention-derived evidence only when validated as sufficiently faithful. Prefer source-region citations for documents rather than generated prose references alone.

## Common failure patterns
Coordinate drift; incorrect crop offsets; treating attention as proof; temporal off-by-one errors; mismatched page numbering; semantic success hiding localization failure.

## Verification
Measure IoU, localization accuracy, temporal overlap, or span F1 as appropriate and manually inspect transformed coordinates on source media.

## Expected output
A traceable grounding pipeline with reversible transforms, calibrated thresholds, and separate semantic/localization metrics.

## Stop conditions
Stop when source transforms cannot be reconstructed, required localization precision exceeds model capability, or evidence cannot be reliably associated with the generated output.