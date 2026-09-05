# Structured Output and Tool-Use Compatibility Routing

## Purpose
Route requests only to models that can reliably satisfy required structured-output schemas, function/tool calling semantics, and execution constraints.

## When to use
Use for JSON/schema-constrained generation, function calling, agent tools, parallel tool calls, or downstream systems that require machine-valid contracts.

## Inputs
Required schema, tool definitions, call semantics, model/provider capabilities, validation rules, retry behavior, and workload risk.

## Preconditions
Compatibility must be proven with workload-specific tests, not assumed from a generic feature flag.

## Context to inspect
Tool registry, JSON/schema validators, model aliases, provider API versions, tool-call traces, fallback candidates, and downstream parsers.

## Core knowledge
Models can advertise tool or structured-output support while differing in schema depth, enum handling, parallelism, argument coercion, streaming behavior, or refusal semantics. Invalid structured output should be treated as a contract failure, not silently accepted.

## Procedure
1. Extract required output and tool capabilities from the request class.
2. Filter candidates by declared support.
3. Apply measured compatibility results for the exact schema/tool profile.
4. Check maximum schema/tool definition size.
5. Define validation and repair policy.
6. Ensure retries are safe for side-effecting tools.
7. Define fallback candidates with equivalent semantics.
8. Record model/API versions used for compatibility evidence.
9. Run contract tests during provider/model upgrades.
10. Monitor invalid-output and tool-call failure rates by route.

## Decision points
Prefer deterministic validation over trusting model claims. Use repair retries only when they cannot duplicate side effects. Fail closed if a downstream action requires strict arguments and validation fails.

## Common failure patterns
Routing by a single supports-tools boolean, parsing malformed JSON leniently, retrying after a tool already executed, and fallback to models with different tool semantics.

## Verification
Schema and tool contract suites pass across every eligible route, including negative and edge-case tests.

## Expected output
A compatibility matrix, eligibility rules, contract tests, and safe validation/retry behavior.

## Stop conditions
Stop when tool side-effect semantics are unclear or no candidate can reliably satisfy the required contract.