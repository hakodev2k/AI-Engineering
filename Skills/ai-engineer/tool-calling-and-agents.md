# Tool Calling and Agent Execution

## Purpose
Design reliable AI workflows that call external tools, APIs, code, or services while keeping permissions, state, retries, and failure handling explicit.

## When to use
Use for assistants or agents that must search, mutate systems, run code, query data, or coordinate multi-step tasks.

## Inputs
Available tools, schemas, permissions, task goals, side-effect rules, state model, timeout/retry limits, audit requirements.

## Preconditions
Classify every tool as read-only or mutating and define which actions require deterministic checks or approval.

## Context to inspect
Tool schemas, authentication model, idempotency guarantees, network behavior, current agent loop, memory/state, retry logic, logs, known incidents.

## Core knowledge
A model should choose actions, but the application must enforce permissions, validation, execution limits, idempotency, and irreversible-action controls. Agent loops need bounded steps and explicit completion criteria.

## Procedure
1. Define the agent responsibility and actions it must never take.
2. Keep tool schemas narrow, typed, and unambiguous.
3. Validate model-generated arguments before execution.
4. Enforce authorization independently of the model.
5. Add idempotency keys or duplicate protection for writes.
6. Bound steps, runtime, retries, and token usage.
7. Feed tool errors back in structured form only when retry is useful.
8. Separate planning from irreversible execution when risk warrants it.
9. Persist enough state for audit and recovery without storing unnecessary sensitive data.
10. Test loops, duplicate calls, partial failure, unavailable tools, and malicious tool output.

## Decision points
Use a deterministic workflow when the sequence is known. Use an agent loop when runtime reasoning about the next action provides real value. Require approval for high-impact or non-reversible writes.

## Common failure patterns
Unlimited loops, broad tools, trusting model authorization, duplicate mutations, hidden side effects, retry storms, tool output prompt injection, and treating exceptions as natural-language success.

## Verification
Run success, timeout, malformed-argument, duplicate-write, permission-denied, and adversarial-output tests; inspect traces for bounded behavior.

## Expected output
A bounded, auditable tool-execution design with explicit safety and recovery behavior.

## Stop conditions
Stop when tool permissions are unclear, irreversible actions cannot be protected, or idempotency/recovery is insufficient for the task risk.