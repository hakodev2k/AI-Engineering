# Tool-Calling Prompt Design

## Purpose
Design model instructions and tool descriptions that lead to correct tool selection, valid arguments, safe sequencing, and evidence-based final responses.

## When to use
Use for agents and assistants that invoke APIs, search, code execution, databases, or business actions.

## Inputs
Tool schemas, permissions, side effects, task policy, failure modes, and representative workflows.

## Context to inspect
Inspect actual tool contracts, required fields, error responses, authorization, idempotency, and orchestration behavior.

## Core knowledge
Tool descriptions are part of the model's decision interface. The runtime—not prose—must enforce permissions and argument validity. Read and write tools have different risk profiles.

## Procedure
1. Define each tool's unique purpose and non-purpose.
2. Remove overlapping tools or clarify selection boundaries.
3. Make parameter semantics explicit, including units and defaults.
4. Describe side effects and irreversible actions.
5. Define when information must be fetched rather than guessed.
6. Require validation before consequential writes.
7. Define retry behavior by error class.
8. Prevent infinite tool loops with bounded termination rules.
9. Test ambiguous selection, missing parameters, partial failures, and stale data.
10. Verify final answers cite or reflect actual tool results rather than assumptions.

## Decision points
Prefer deterministic orchestration for fixed workflows; model-directed tools for genuinely variable planning. Separate read and write capabilities when possible.

## Common failure patterns
Vague overlapping tool names; undocumented defaults; tool calls used for facts already supplied; retries on permanent errors; model-generated authorization; claiming success after a failed write.

## Verification
Run workflow tests with success, validation error, timeout, permission failure, partial success, and unavailable dependency cases. Confirm tool traces match intended policy.

## Expected output
Clear tool instructions, selection rules, error handling, and workflow tests.

## Stop conditions
Stop when tool schemas are unavailable, side effects are undocumented, or authorization depends on model judgment alone.