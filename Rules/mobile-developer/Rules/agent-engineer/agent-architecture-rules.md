# Agent Architecture Rules
## Purpose
Keep agent systems understandable, bounded, and evolvable.
## Scope
Agent loops, planners, executors, tools, memory, and orchestration.
## MUST
- Define explicit responsibilities, termination conditions, authority boundaries, and failure behavior for every agent.
- Separate reasoning/orchestration concerns from irreversible side effects.
- Make state transitions and tool dependencies inspectable.
## MUST NOT
- Build unbounded autonomous loops.
- Hide critical business invariants inside prompts alone.
## SHOULD
- Prefer the simplest deterministic workflow that satisfies the requirement before adding autonomy.
## Exceptions
Exceptions require documented need, bounded risk, observability, and rollback strategy.
## Verification
Review architecture diagrams, state transitions, tool permissions, termination tests, and failure-path tests.