# Multi-Agent Coordination Rules
## Purpose
Prevent ambiguity, duplication, and unsafe interaction among cooperating agents.
## Scope
Delegation, handoffs, shared state, supervisors, and peer agents.
## MUST
- Define ownership, inputs, outputs, authority, and completion criteria for delegated work.
- Prevent concurrent agents from mutating shared resources without coordination controls.
- Validate delegated results before consequential downstream use.
## MUST NOT
- Assume another agent completed work without observable evidence.
- Create recursive delegation without depth and cost limits.
## SHOULD
- Prefer explicit contracts and minimal shared mutable state.
## Exceptions
Dynamic delegation requires bounded topology, monitoring, and termination guarantees.
## Verification
Use concurrency tests, delegation traces, ownership review, recursion-limit tests, and failure simulations.