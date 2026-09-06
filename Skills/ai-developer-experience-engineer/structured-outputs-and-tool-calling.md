# Structured Outputs and Tool Calling

## Purpose
Design developer-facing patterns for schemas, structured model output, and tool/function calling that are reliable, debuggable, and safe to integrate into applications.

## When to use
Use when developers need JSON/schema-constrained output, function selection, external actions, agent tools, or typed extraction.

## Inputs
Schema system, model capabilities, tool definitions, authorization boundaries, validation rules, retry policy, SDK types, and application side effects.

## Context to inspect
Inspect tool schemas, generated types, parsing code, validation failures, model retries, authorization, idempotency, examples, and logs of malformed or unexpected calls.

## Core knowledge
Structured generation reduces parsing ambiguity but does not eliminate semantic validation. Tool calls are proposals from a probabilistic system; application code must validate arguments, enforce authorization, control side effects, and handle retries safely.

## Procedure
1. Define the business action or data contract independently of the model.
2. Keep schemas explicit, bounded, and semantically meaningful.
3. Distinguish required fields, optional fields, enums, and nullability.
4. Validate generated arguments before execution.
5. Enforce authorization outside the model.
6. Add idempotency for retryable side-effecting tools.
7. Define tool timeout and error propagation.
8. Preserve tool-call identifiers for tracing.
9. Specify how tool results return to the model.
10. Test invalid arguments, unavailable tools, conflicting calls, partial failures, and model refusal.
11. Provide typed SDK examples and raw-protocol examples.

## Decision points
Use strict schemas when downstream code requires machine guarantees. Use free-form text when semantic richness matters more than structural certainty. Require human confirmation for high-impact or irreversible tool actions.

## Common failure patterns
Executing model-generated arguments without validation, trusting model authorization, schemas with ambiguous strings, retrying non-idempotent tools, hiding tool failures from traces, and treating schema compliance as factual correctness.

## Verification
Run adversarial and malformed test cases, validate schema conformance and business rules separately, confirm authorization boundaries, and test duplicate execution scenarios.

## Expected output
Stable schemas, tool contracts, validation rules, execution safeguards, examples, and tests.

## Stop conditions
Stop when tool authorization is unresolved, side effects cannot be made safely retryable, or schema constraints cannot represent required business invariants.