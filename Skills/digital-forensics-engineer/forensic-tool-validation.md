# Forensic Tool Validation

## Purpose
Validate forensic tools and parsers before relying on them for consequential investigative conclusions.

## When to use
Use when introducing a new tool, upgrading versions, parsing a new artifact format, or when different tools disagree.

## Inputs
Tool/version, artifact type, known test data, expected results, reference documentation, and comparison tooling.

## Context to inspect
Supported OS/filesystem versions, parser assumptions, known bugs, dependency versions, locale/timezone behavior, and output transformations.

## Core knowledge
A popular tool is not automatically correct for every artifact version. Validation should test both accuracy and failure behavior using known inputs and independent methods where practical.

## Procedure
1. Define which artifact fields and interpretations matter.
2. Create or obtain known-ground-truth samples covering normal and edge cases.
3. Record tool version, configuration, dependencies, and execution environment.
4. Run the tool and compare outputs against ground truth.
5. Test malformed, missing, boundary, and version-specific records.
6. Compare pivotal fields with an independent parser or manual decoding.
7. Document discrepancies and whether they affect conclusions.
8. Pin validated versions for the case or workflow.

## Decision points
Accept minor formatting differences only when semantic values match. Reject or constrain a tool when errors affect evidence interpretation.

## Common failure patterns
Validating only happy paths, changing tool versions mid-case without review, trusting GUI output without raw provenance, and ignoring timezone/locale effects.

## Verification
Maintain repeatable test cases and evidence showing expected versus actual outputs.

## Expected output
Validation record, approved use scope, known limitations, and pinned tool configuration.

## Stop conditions
Stop using the tool when errors are unexplained, unsupported artifact versions are encountered, or outputs cannot be independently validated.