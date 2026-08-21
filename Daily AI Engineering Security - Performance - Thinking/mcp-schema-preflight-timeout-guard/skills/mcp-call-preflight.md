# Skill: MCP Call Preflight

## Purpose
Prevent deterministic MCP argument failures from consuming remote/subprocess timeout budgets.

## Trigger
Before every MCP tool dispatch, including generic bridge or deferred-tool dispatch.

## Inputs
Tool name, concrete input schema, candidate arguments, timeout policy, prior invalid fingerprints.

## Preconditions
The concrete tool identity is known. Use the most recent trusted tool schema available for that identity.

## Required context
Current tool schema, user-requested operation, prior failures for this exact call shape, and whether the operation is expected to be long-running.

## Allowed tools
Schema validators, local scripts, MCP metadata reads, metrics/log queries.

## Constraints
- MUST NOT dispatch a call known to violate the available schema.
- MUST NOT increase timeout as a substitute for repairing deterministic invalid input.
- MUST preserve approval, scope, guardrail, and middleware checks after preflight.
- MUST NOT silently coerce values when coercion can change semantic meaning.

## Procedure
1. Resolve the real tool name behind any generic bridge.
2. Obtain the concrete schema used for dispatch.
3. Parse arguments and reject non-object payloads when the tool expects an object.
4. Apply only explicitly permitted safe coercions.
5. Validate required fields, types, enum/const, nested schemas, array items, additional properties, and numeric/string bounds supported by the validator.
6. On violation, return precise argument paths and constraints to the agent without dispatching.
7. Fingerprint the invalid call shape.
8. If the same invalid fingerprint has already consumed the configured repair budget, stop retrying and escalate/re-plan.
9. For a valid call, calculate a bounded timeout appropriate to the operation.
10. Dispatch through the normal permission/approval/middleware chain.
11. Record validation latency, dispatch latency, timeout, result class, and repair outcome.

## Decision points
- Schema missing/unsupported: follow explicit policy; do not pretend validation occurred.
- Deterministic schema error: repair before dispatch.
- Identical repaired call still invalid: stop after configured retries.
- Valid but legitimately long-running call: use a larger bounded timeout or asynchronous progress mechanism.

## Expected output
A structured `allow`, `repair_required`, `schema_unavailable`, or `block_retry` decision with validation evidence.

## Metrics
Invalid dispatches prevented, preflight latency, repair success rate, p95 failure latency, timeout rate, false rejection rate.

## Verification
Replay invalid fixtures and confirm zero downstream tool invocations. Replay valid fixtures and confirm unchanged dispatch behavior.

## Failure handling
If the validator cannot evaluate the schema, explicitly mark validation unavailable and follow policy. Never convert validator failure into a false pass.

## Stop conditions
Stop retrying after the identical-invalid retry budget is exhausted, after user cancellation, or when required schema/permission context cannot be resolved safely.
