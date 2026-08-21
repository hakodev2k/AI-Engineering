# Contract Baseline Review

## Purpose
Create a trustworthy baseline for structured LLM output before changing prompts, models, tool definitions, parsers, or schemas.

## When to use
Use before a change can alter JSON or other structured output consumed by code, tests, agents, APIs, queues, or databases.

## Inputs
- Current producer prompt/tool/schema.
- Current consumer code and tests.
- Baseline JSON Schema.
- Representative successful and failed outputs.

## Preconditions
The baseline must represent behavior currently accepted in production or the target branch.

## Allowed tools
Repository search, test runner, static inspection, logs with secrets redacted, and `scripts/schema_drift_gate.py`.

## Constraints
Do not infer compatibility from prompt text alone. Consumer code and executable tests are stronger evidence.

## Procedure
1. Locate every consumer of the structured output.
2. Identify required fields, field types, enum values, nullability, nesting, and unknown-field behavior.
3. Locate parser fallbacks and error handling.
4. Compare implementation with the baseline schema and record mismatches.
5. Gather representative outputs that cover success, optional fields, edge cases, and known failures.
6. Run existing contract/parser tests.
7. Resolve baseline ambiguities before evaluating a candidate change.
8. Record facts separately from assumptions.

## Expected output
A reviewed baseline schema, evidence list, consumer list, and unresolved assumptions.

## Verification
Baseline parses as JSON Schema, existing samples validate, and relevant parser/contract tests pass.

## Failure handling
If production behavior and schema disagree, stop compatibility approval and escalate the mismatch. Do not silently rewrite the baseline.

## Stop conditions
Stop when no authoritative baseline can be established or required evidence is inaccessible.
