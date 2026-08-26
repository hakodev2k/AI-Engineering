# Multimodal Adversarial Testing

## Purpose
Test AI systems for attacks carried through images, audio, video, documents, and mixed-modality context.

## When to use
Use when a system accepts or derives decisions from non-text inputs or OCR/transcription pipelines.

## Inputs
Supported modalities, preprocessing pipeline, model configuration, tool access, content policies, sample media, and test environment.

## Context to inspect
Trace decoding, metadata extraction, OCR/ASR, resizing, frame sampling, document parsing, modality fusion, and downstream actions.

## Core knowledge
Adversarial content can be visible, hidden, low-salience, metadata-borne, temporally sparse, or introduced during preprocessing. Cross-modal contradictions can manipulate model interpretation.

## Procedure
1. Define modality-specific protected outcomes.
2. Build benign controls for each media type.
3. Embed adversarial instructions in visible and low-salience regions.
4. Test metadata, OCR, transcription, and document-layer injection.
5. Test conflicting text/image/audio instructions.
6. Test transformations such as crop, compression, resizing, and transcoding.
7. Attempt unauthorized tool actions triggered by media.
8. Record preprocessing artifacts and model outputs.
9. Validate mitigations across representative transformations.

## Decision points
Sanitize or flatten complex formats when feature loss is acceptable. Treat extracted text as untrusted and enforce authorization independently of modality.

## Common failure patterns
Testing only clean screenshots; ignoring metadata or document layers; assuming OCR sanitizes instructions; evaluating model output without downstream effects.

## Verification
Confirm attack variants fail across supported preprocessing paths and benign media quality remains within product requirements.

## Expected output
A modality-by-modality attack matrix, reproducible artifacts, impact analysis, and mitigation evidence.

## Stop conditions
Stop if media processing can trigger uncontrolled external effects or if test artifacts could escape into production datasets.