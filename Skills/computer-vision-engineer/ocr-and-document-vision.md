# OCR and Document Vision

## Purpose
Engineer document-vision pipelines that reliably detect, recognize, structure, and validate text and layout under real-world document variation.

## When to use
Use for OCR, document extraction, forms, receipts, invoices, scanned archives, screenshots, or layout-aware downstream automation.

## Inputs
Document images/PDF renders, field or transcription ground truth, language/script requirements, layout types, downstream schema, and privacy constraints.

## Preconditions
Target fields, acceptable transcription errors, and downstream validation requirements are explicit.

## Context to inspect
Inspect scan resolution, skew, rotation, compression, handwriting, languages, tables, reading order, repeated fields, templates, and whether native text is already available.

## Core knowledge
Document systems often require detection, orientation, OCR, layout analysis, field linking, normalization, and validation. Character/word error rate alone does not measure structured extraction utility.

## Procedure
1. Determine whether native text extraction should precede OCR.
2. Profile document families and degradation conditions.
3. Define transcription and field-level evaluation rules.
4. Establish OCR/layout baselines.
5. Normalize orientation and rendering without erasing fine text.
6. Separate text detection, recognition, layout, and extraction errors.
7. Evaluate by language, template, font size, scan quality, and field type.
8. Add domain dictionaries or constrained decoding only when justified.
9. Validate extracted values against schema and business rules.
10. Preserve confidence and source coordinates for auditability.
11. Benchmark end-to-end document latency and memory.
12. Add regression documents for known difficult layouts.

## Decision points
Use template rules when layout is stable and rules are cheaper; layout-aware learned models when variability defeats fixed coordinates. Prefer native text over OCR when trustworthy source text exists.

## Common failure patterns
OCRing searchable PDFs unnecessarily, optimizing character accuracy while key fields fail, losing reading order, aggressive image cleanup deleting punctuation, and silently coercing low-confidence values.

## Verification
Verify transcription plus field-level exact/tolerant metrics, coordinates, confidence handling, schema validation, language slices, and end-to-end downstream correctness.

## Expected output
An auditable document-vision pipeline with error taxonomy, validation rules, confidence policy, and production benchmarks.

## Stop conditions
Stop if sensitive-document handling is unauthorized, critical fields cannot be validated, or source quality is below the minimum recoverable resolution.