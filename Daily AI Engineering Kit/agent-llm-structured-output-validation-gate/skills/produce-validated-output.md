# Produce Validated Structured Output

## Purpose
Prevent downstream automation from consuming malformed or semantically unsupported LLM output.

## When to use
Use whenever an agent result is parsed by code, passed to another agent, used in CI, or can trigger side effects.

## Inputs
Task requirements, `schemas/agent-output.schema.json`, repository evidence, and output path.

## Preconditions
Schema is version-controlled; required evidence sources are accessible; output is not allowed to directly perform approval-gated actions.

## Allowed tools
Read/search repository, tests, logs and official docs; write task artifacts; run local validators and tests.

## Constraints
Do not weaken the schema to make an invalid answer pass. Do not invent evidence. Maximum repair attempts: 2.

## Process
1. Extract required claims and acceptance criteria.
2. Gather evidence before forming final findings.
3. Assign stable finding IDs and attach evidence to each ID.
4. Emit JSON only according to the schema.
5. Run `python scripts/run_gate.py <output>` from the package root.
6. On validation failure, preserve validator output, repair only the reported defect, and rerun.
7. After two failed repair attempts, set the task outcome to failed/inconclusive and escalate.
8. A `verified` status is permitted only when schema and semantic checks are both true.

## Expected output
A schema-valid JSON result with evidence-linked findings and explicit verification state.

## Verification
Validator exits 0; every finding has evidence; verified output has all verification flags true.

## Failure handling
Malformed JSON, schema mismatch, or missing evidence is a validation failure. Tool/environment errors are not evidence that the output is valid. Preserve stderr and stop after two repair attempts.

## Stop conditions
Stop on successful validation, approval boundary, unavailable required evidence, or exhausted repair attempts.
