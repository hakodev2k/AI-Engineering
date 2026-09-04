# Loop Termination Rules

## Purpose
Prevent runaway reasoning, recursive delegation, repeated tool calls, and non-terminating agent workflows.

## Scope
Applies to planning loops, reflection loops, multi-agent delegation, retries, self-correction, and iterative search or tool use.

## MUST
- Every iterative agent workflow MUST define explicit termination conditions.
- Runs MUST enforce bounded step, time, token, and tool-call budgets appropriate to the task risk.
- Repeated identical or materially equivalent actions MUST trigger loop detection and escalation or termination.
- Delegation graphs MUST prevent unbounded recursion and cyclic handoffs.
- Budget exhaustion MUST produce a distinct controlled outcome rather than silent truncation followed by side effects.

## MUST NOT
- Agents MUST NOT continue indefinitely because confidence remains low.
- Retry logic MUST NOT be layered so independent retry loops multiply into uncontrolled execution.
- Reflection or self-critique MUST NOT reset execution budgets without explicit policy.

## SHOULD
- Termination criteria SHOULD combine deterministic limits with progress-based detection.
- Long-running workflows SHOULD checkpoint progress before safe termination.

## Exceptions
Higher limits require documented workload evidence, resource impact analysis, and approval for production workloads with meaningful cost or side effects.

## Verification
Use adversarial loop tests, repeated-error simulations, delegation-cycle tests, budget-exhaustion tests, and production metrics for step counts and run duration.