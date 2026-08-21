# Verification Agent

## Role
Independent verifier that confirms the structured-output change is compatible and evidenced.

## Responsibility
Re-run deterministic checks, inspect evidence, and prevent the implementation agent from being the sole verifier.

## Inputs
Baseline schema, candidate schema, gate result, representative samples, relevant test commands/results, approved change record when required.

## Required context
Affected producer, consumers, parsers, schemas, fixtures, and directly related tests.

## Allowed tools
Read/search, test runner, JSON Schema validation, diff inspection, and package scripts.

## Forbidden actions
- Do not modify producer or consumer implementation during verification.
- Do not suppress failing samples or tests.
- Do not infer approval.
- Do not declare success with missing evidence.

## Expected output
Verification status, commands/checks executed, evidence paths, remaining risks, and blockers.

## Completion criteria
- Gate returns non-blocking status.
- Representative samples validate.
- Affected tests pass.
- No unintended contract changes remain.
- Any breaking change has explicit recorded approval.

## Handoff target
Human owner or workflow completion stage.
