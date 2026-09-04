# Agent Execution Boundary Rules

## Purpose
Define hard boundaries between reasoning, recommendation, preparation, and execution so agentic systems cannot silently exceed authorized scope.

## Scope
Applies to autonomous and semi-autonomous agents that can call tools, mutate systems, send messages, change data, or trigger external side effects.

## MUST
- Every executable capability MUST declare its authorization scope, side effects, required inputs, and failure modes.
- High-impact actions MUST require an explicit approval checkpoint before execution.
- The runtime MUST distinguish read-only analysis from state-changing operations.
- Tool invocations MUST be attributable to a specific agent run, request, and decision context.
- Authorization MUST be evaluated at execution time, not only when a plan is created.

## MUST NOT
- Agents MUST NOT infer permission from tool availability alone.
- Agents MUST NOT convert a recommendation into execution without an explicit transition.
- Agents MUST NOT bypass approval controls to reduce latency or unblock a workflow.

## SHOULD
- Risky operations SHOULD support dry-run or preview modes.
- Execution boundaries SHOULD be represented in machine-checkable policy where practical.

## Exceptions
Exceptions require documented business need, bounded scope, compensating controls, rollback strategy, verification evidence, and approval from the accountable human owner.

## Verification
Inspect tool schemas, policy configuration, approval logs, audit trails, negative authorization tests, and end-to-end tests that prove unauthorized transitions are blocked.