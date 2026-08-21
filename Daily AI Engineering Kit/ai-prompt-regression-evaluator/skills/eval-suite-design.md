# Eval Suite Design Skill

## Purpose
Build a reusable regression suite for prompts, model settings, context assembly, tool instructions, or agent policies.

## When to use
Use before changing prompts, model/provider settings, retrieval/context logic, tool descriptions, or agent instructions that may alter output quality, cost, latency, safety, or schema compliance.

## Inputs
- Behavior to protect
- Existing baseline prompt/config
- Candidate prompt/config
- Known failure modes
- Representative user/task examples
- Required output contracts
- Quality, cost, latency, and safety thresholds

## Preconditions
- The intended behavior is defined well enough to distinguish correct from unacceptable output.
- Test data does not contain secrets or production-only sensitive information unless explicitly approved and isolated.

## Required context
- Current prompt/instructions
- Existing production incidents or quality defects
- Output schemas/API contracts
- Domain-specific acceptance criteria

## Allowed tools
Repository read/search, test fixtures, offline scripts, approved model/eval runner, JSON/schema validators.

## Constraints
- Do not encode implementation details as expected behavior unless they are externally required.
- Do not make all cases happy-path.
- Do not use a single example as evidence of general quality.

## Procedure
1. Identify protected behaviors and known failure modes.
2. Split them into atomic eval cases.
3. For each case define input, required assertions, forbidden outcomes, rubric dimensions, weight, and severity.
4. Include normal, boundary, adversarial, ambiguity, and refusal/safety cases when relevant.
5. Mark deterministic assertions separately from semantic rubric items.
6. Define minimum number of repeated runs for nondeterministic outputs.
7. Define blocking thresholds for critical cases and aggregate thresholds for the suite.
8. Add cost and latency budgets when the candidate can increase resource use.
9. Validate the suite with `scripts/validate-suite.py`.
10. Review whether the suite can detect at least one known bad behavior.

## Expected output
A JSON eval suite matching `schemas/eval-suite.schema.json`.

## Verification
- Schema validation passes.
- Every critical behavior maps to at least one case.
- Every case has measurable pass criteria.
- Critical cases cannot be hidden by aggregate averaging.

## Failure handling
If expected behavior is ambiguous, mark the case `needs-human-definition` and block regression approval until clarified.

## Stop conditions
Stop when acceptance behavior cannot be made testable, test data is unsafe to use, or required human definition is missing.
