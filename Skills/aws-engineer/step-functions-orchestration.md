# Step Functions Orchestration

## Purpose
Design reliable stateful workflows with AWS Step Functions, explicit retries, compensation, timeouts, and observability.

## When to use
Use for multi-step business workflows, long-running orchestration, human/external waits, batch coordination, or replacing fragile chained Lambdas.

## Inputs
Workflow steps, state transitions, failure modes, timeouts, retryability, compensation actions, payload sizes, execution volume.

## Context to inspect
State-machine definitions, service integrations, IAM role, execution history, retry/catch blocks, task tokens, logging/tracing, quotas.

## Core knowledge
Retries must be safe for the underlying action. Workflow state is not a database transaction. Compensation should address completed side effects. Standard and Express workflows have different durability, pricing, and execution characteristics.

## Procedure
1. Model states and business outcomes before implementation.
2. Separate retryable technical failures from business failures.
3. Add timeouts to every external operation.
4. Use exponential backoff with bounded attempts.
5. Design compensation for partially completed side effects.
6. Minimize payload growth; store large state externally.
7. Use native service integrations instead of glue code where suitable.
8. Add execution correlation and audit fields.
9. Test each failure branch and recovery path.

## Decision points
Choose Standard for durable/auditable long workflows; Express for high-volume short workloads where semantics fit. Use choreography instead when central orchestration would create unnecessary coupling.

## Common failure patterns
Retrying non-idempotent steps, no compensation, oversized state, nested complexity, silent catches, and workflows that never time out.

## Verification
Run success, timeout, partial failure, retry-exhaustion, and compensation scenarios.

## Expected output
State machine, retry/compensation policy, and failure-test evidence.

## Stop conditions
Escalate when compensation cannot restore acceptable business state or required exactly-once semantics are assumed but unsupported.