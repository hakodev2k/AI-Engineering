# Detect Tool Output Schema Drift

## Purpose
Detect when an AI agent's tool response no longer matches the structure its planner, parser, or verifier expects.

## When to use
Use after tool/API upgrades, intermittent parsing failures, missing fields, type changes, or before enabling autonomous execution against an external tool.

## Inputs
- Captured tool response JSON.
- Expected contract in `schemas/tool-output-contract.schema.json`.
- Optional previous known-good response.

## Preconditions
Work from sanitized captures. Secrets and personal data must not be persisted in evidence.

## Allowed tools
Read-only repository inspection, JSON parsing, schema validation, diff tools, and test runners.

## Constraints
Do not infer a field from prose when the machine contract requires it. Do not silently coerce incompatible values.

## Procedure
1. Capture the raw response before agent normalization.
2. Run `python scripts/validate-tool-output.py --input <response.json> --schema schemas/tool-output-contract.schema.json`.
3. Record each missing field, unexpected type, invalid enum, and unknown status.
4. Compare with a known-good response when available.
5. Classify drift as additive, compatible, ambiguous, or breaking.
6. Identify every parser, planner, retry rule, and verifier consuming the changed field.
7. If drift is breaking or ambiguous, stop automated mutation and produce `templates/drift-report.json`-compatible evidence.
8. If drift is compatible, update adapters only when acceptance criteria explicitly allow the new form.
9. Run fixture tests and final verification.

## Expected output
A validated response or a structured drift report containing evidence, impact, confidence, and recommended action.

## Verification
The validator exits 0, fixtures pass, and no consumer relies on an unvalidated field.

## Failure handling
Malformed JSON is a validation failure, not a transient tool failure. Preserve a redacted sample and stop. A transient tool call may be retried at most twice by the workflow.

## Stop conditions
Stop when required fields are absent, types are incompatible, an unknown status changes control flow, or safe interpretation requires guessing.