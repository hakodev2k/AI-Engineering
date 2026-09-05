# Skill: Tool Outcome Investigation

## Purpose
Determine whether an agent's observable tool-result state matches protocol evidence and actual side effects.

## Trigger
Unexpected completion report, retry storm, permission denial shown as success, `isError` mismatch, or adapter/SDK upgrade.

## Inputs
Raw MCP response, runtime event, tool metadata, action criticality, optional side-effect evidence.

## Preconditions
Preserve raw events before normalization. Avoid repeating non-idempotent actions during investigation.

## Required context
Expected semantics at each layer: tool -> middleware -> MCP -> adapter -> runtime -> UI.

## Allowed tools
Trace/log readers, conformance fixtures, safe read-only verification calls, `verify_tool_outcome.py`.

## Constraints
Do not infer success from HTTP/JSON-RPC transport success alone. Do not retry unknown non-idempotent writes automatically.

## Procedure
1. Capture raw result and runtime state.
2. Classify action as read-only, idempotent write, or consequential/non-idempotent write.
3. Record protocol `isError`, runtime status, thrown error, and textual denial/error indicators.
4. Normalize to success/failure/unknown.
5. Detect contradictions between layers.
6. For consequential apparent success, obtain independent state evidence when available.
7. Identify the first layer where semantics diverge.
8. Implement smallest mapping/middleware fix.
9. Replay denied, validation-error, thrown-error, success, and unknown fixtures.
10. Hand off to independent verifier.

## Decision points
Contradiction = block conclusion. Unknown non-idempotent outcome = stop/reconcile, not retry. Consequential success without required evidence = incomplete.

## Expected output
Facts, assumptions, layer map, root cause, decision, risks, verification status.

## Metrics
Semantic mismatch rate; unsupported success count; duplicate side effects; verified consequential success coverage.

## Verification
Conformance fixtures and real trace replay agree.

## Failure handling
One retry for trace collection; then classify unknown and escalate.

## Stop conditions
Stop automatic execution when a consequential action has unknown outcome or permission failure is represented as success.