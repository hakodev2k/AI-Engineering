# Planning and Reasoning Rules
## Purpose
Bound planning so actions remain relevant, verifiable, and recoverable.
## Scope
Task decomposition, plan revision, and execution sequencing.
## MUST
- Decompose multi-step work around observable outcomes and dependencies.
- Re-plan when evidence invalidates assumptions or a tool changes state unexpectedly.
- Verify prerequisites before high-impact steps.
## MUST NOT
- Continue executing a stale plan after a material failure.
- Treat internal confidence as evidence that an external action succeeded.
## SHOULD
- Prefer short feedback loops and reversible steps over long speculative plans.
## Exceptions
Atomic operations may skip decomposition when added ceremony provides no safety or clarity.
## Verification
Review execution traces, prerequisite checks, failure simulations, and plan-revision behavior.