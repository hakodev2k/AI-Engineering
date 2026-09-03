# Structured Output and Tool Capability Routing

## Purpose
Route requests only to models that can satisfy required structured-output, function/tool-calling, schema, and execution semantics.

## When to use
Use for agents, API generation, workflow automation, extraction, or any task where free-form text is not an acceptable substitute.

## Inputs
Required schemas, tool definitions, model capability registry, validation results, provider-specific constraints, execution risk.

## Context to inspect
JSON/schema validators, tool executor contracts, parallel-tool semantics, argument coercion, retries, idempotency, and downstream parser assumptions.

## Core knowledge
“Supports tools” is not a binary capability. Models differ in schema fidelity, tool selection, parallel calls, argument validity, and recovery after tool errors. Routing must be based on verified task behavior.

## Procedure
1. Define required output and tool semantics precisely.
2. Filter models lacking mandatory capabilities.
3. Evaluate schema adherence and tool selection on representative tasks.
4. Separate recoverable syntax errors from semantic tool errors.
5. Define validation and repair limits.
6. Preserve idempotency for repeated tool-call attempts.
7. Route high-risk tools only to models meeting stricter evaluation thresholds.
8. Test unsupported and malformed-schema cases.

## Decision points
Use deterministic validation/repair for minor formatting failures; escalate to a stronger model when semantic tool selection is unreliable; reject rather than downgrade to free text when structured output is contractually required.

## Common failure patterns
Trusting capability labels, silent JSON coercion, repeated side effects during repair, incompatible parallel-tool behavior, and routing without schema-size awareness.

## Verification
Verify contract tests, schema validity rate, tool-choice accuracy, side-effect safety, and failure behavior by model/version.

## Expected output
A capability-aware routing policy backed by structured-output and tool-use evaluation evidence.

## Stop conditions
Stop when required execution semantics cannot be guaranteed by any eligible model.