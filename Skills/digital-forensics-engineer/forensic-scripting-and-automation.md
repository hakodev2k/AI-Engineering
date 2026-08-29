# Forensic Scripting and Automation

## Purpose
Automate repetitive forensic parsing, enrichment, correlation, and validation while preserving provenance and auditability.

## When to use
Use for large evidence sets, repeated artifact extraction, timeline enrichment, hash processing, indicator matching, or reproducible case workflows.

## Inputs
Evidence copies, artifact schemas, parser requirements, expected outputs, test samples, and case constraints.

## Context to inspect
Existing tools, file formats, encoding, timestamp semantics, scale, sensitive fields, and whether scripts will touch original evidence.

## Core knowledge
Forensic automation must be deterministic where possible, fail visibly, preserve source references, and avoid silently transforming evidence. Parsing errors are investigative risks, not merely software bugs.

## Procedure
1. Define the exact question and expected structured output.
2. Work only on verified copies or exported artifacts.
3. Parse conservatively and preserve raw source values.
4. Add source file, offset/record ID, parser version, and error fields.
5. Normalize only into additional fields; do not overwrite originals.
6. Implement bounded error handling and explicit skipped-record reporting.
7. Test against known-positive, malformed, empty, and edge-case samples.
8. Compare a representative sample manually or with an independent parser.
9. Version the script and record runtime dependencies.

## Decision points
Use established validated tools when they answer the question reliably; write custom code when format, scale, or correlation needs justify it.

## Common failure patterns
Silent parse failures, destructive normalization, unbounded recursion, timezone loss, encoding assumptions, and processing original evidence in place.

## Verification
Reproduce outputs from pinned inputs and compare sample records against independent interpretation.

## Expected output
Auditable script or pipeline, structured results, validation evidence, and known limitations.

## Stop conditions
Stop when format semantics are unknown, output cannot be validated, or automation would alter original evidence.