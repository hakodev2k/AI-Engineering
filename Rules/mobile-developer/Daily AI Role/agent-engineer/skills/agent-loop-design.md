# Skill: Agent Task and Loop Design

**Purpose:** Convert an ambiguous automation goal into a bounded agent execution loop.

**Trigger:** New agent capability, unstable agent behavior, or a workflow being automated.

**Inputs:** user goal, expected output, constraints, available tools, approval rules, latency/cost limits, failure tolerance.

**Preconditions:** authority and side-effect boundary are known.

## Procedure
1. Define the task contract: goal, output, acceptance tests, stop conditions, forbidden outcomes.
2. Split deterministic steps from model-driven judgment.
3. Choose loop stages such as understand → plan → execute → inspect → verify → finish.
4. Define state written after each stage and the checkpoint boundary.
5. Identify tool calls and whether they are read-only, reversible, idempotent, or approval-gated.
6. Define retry classes: transient retry, corrected-input retry, re-plan, or escalate.
7. Set iteration, delegation-depth, time, and cost limits.
8. Define verifier evidence independent from the executor where risk warrants it.

**Decisions:** single-shot vs iterative; synchronous vs long-running; one agent vs delegated agents; automated vs human-gated transition.

**Constraints:** no infinite loops, implicit permission expansion, or completion without evidence.

**Output:** executable loop design with states, transitions, limits, approval points, and DoD.

**Quality check:** every transition has a trigger and output; every loop has a bound; every side effect has an authority rule.

**Failure handling:** after two materially similar failed iterations, stop repeating the strategy and escalate or redesign.

**Stop condition:** verifier evidence satisfies acceptance criteria or an explicit blocker/approval dependency is recorded.