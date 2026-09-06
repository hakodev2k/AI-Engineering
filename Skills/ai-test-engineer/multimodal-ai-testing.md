# Multimodal AI Testing

## Purpose
Test AI systems that consume or produce combinations of text, images, audio, video, or documents, including cross-modal grounding and modality-specific failure modes.

## When to use
Use for vision-language models, document understanding, speech assistants, image analysis, multimodal agents, and media generation workflows.

## Inputs
Supported modalities, representative assets, expected behavior, accessibility requirements, safety rules, model configuration, and output criteria.

## Preconditions
Test assets are legally usable and expected behavior is defined for each supported modality.

## Context to inspect
Inspect preprocessing, compression, resizing, OCR or transcription stages, modality limits, prompt assembly, metadata handling, and post-processing.

## Core knowledge
Multimodal failures may arise before inference. Resolution, encoding, orientation, audio quality, frame sampling, page order, metadata, and modality alignment can change results. Cross-modal contradictions must be tested explicitly.

## Procedure
1. Define critical tasks per modality and cross-modal combination.
2. Build clean, degraded, edge, and conflicting test assets.
3. Verify preprocessing preserves relevant information.
4. Test resolution, format, size, orientation, and duration boundaries.
5. Evaluate modality-specific accuracy and cross-modal grounding.
6. Test irrelevant or adversarial content embedded in secondary modalities.
7. Verify structured outputs and citations to regions/pages/timestamps when applicable.
8. Measure latency and resource impact by asset size.
9. Test inaccessible or unsupported media behavior.
10. Add discovered modality failures to regression suites.

## Decision points
Use modality-specific experts or metrics where generic LLM judges cannot reliably assess perceptual correctness. Prefer explicit failure over silent degradation for unsupported inputs.

## Common failure patterns
Testing only pristine assets, ignoring preprocessing, treating OCR errors as model errors without localization, and missing cross-modal instruction conflicts.

## Verification
Confirm representative and degraded cases pass acceptance thresholds and failures can be traced to preprocessing, model behavior, or post-processing.

## Expected output
A multimodal test report with per-modality quality, robustness, cross-modal issues, and operational constraints.

## Stop conditions
Stop when test assets violate rights/privacy requirements or modality behavior cannot be evaluated safely.