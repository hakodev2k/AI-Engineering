# Vision-Language Model Integration

## Purpose
Integrate vision-language models into production systems while preserving input fidelity, grounding quality, predictable outputs, and operational control.

## When to use
Use when adding image understanding, visual question answering, document image reasoning, chart interpretation, or image-conditioned generation to an application.

## Inputs
Model/API contract, image samples, prompt or instruction format, output schema, quality and latency requirements.

## Preconditions
Confirm supported image formats, size limits, multi-image semantics, model context constraints, and data handling requirements.

## Context to inspect
Inspect image acquisition, orientation metadata, resizing, compression, prompt assembly, downstream parsing, retries, and model versioning.

## Core knowledge
Vision-language behavior is sensitive to image resolution, crop strategy, text embedded in images, ordering of multiple images, prompt grounding, and model-specific tokenization of visual content. High visual reasoning accuracy does not imply reliable OCR, counting, spatial precision, or factuality.

## Procedure
1. Define the exact visual task and expected output contract.
2. Establish representative image-quality bands.
3. Normalize orientation and validate image integrity.
4. Select resize/crop policy based on task detail requirements.
5. Design prompts that reference images unambiguously.
6. Separate deterministic extraction from generative reasoning where possible.
7. Add structured output validation.
8. Test multi-image ordering and reference behavior.
9. Evaluate OCR-heavy, spatial, low-light, dense, and adversarial cases.
10. Add confidence or escalation rules for high-impact decisions.
11. Benchmark latency and image-token cost.
12. Pin and regression-test model versions.

## Decision points
Use dedicated OCR or detectors when exact extraction is more important than general reasoning. Use tiled/high-resolution processing only when measured quality gains justify cost.

## Common failure patterns
Blind trust in visual counting; aggressive downscaling; ignoring EXIF orientation; mixing multiple images without explicit references; parsing free-form output as structured data; no model-version regression testing.

## Verification
Compare predictions against labeled visual tasks, inspect failure slices, verify structured output, and measure quality across input-resolution tiers.

## Expected output
A production-ready VLM integration with validated preprocessing, prompting, output handling, evaluation, and fallback rules.

## Stop conditions
Stop when required visual precision exceeds model capability, privacy constraints prohibit processing, or critical output cannot be independently validated.