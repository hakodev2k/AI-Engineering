# Research — Agent Subagent Fan-out Budget Guard

## Category
Token

## Problem
Multi-agent coding/research systems can let a parent agent spawn subagents that themselves retain delegation capability. A small intended fan-out can recursively expand into dozens or hundreds of agents, multiplying model calls, context loads, tool calls, wall-clock time, and subscription/API usage before a human notices.

## Why it matters now
Recent 2026 reports show the failure is not theoretical:

1. Anthropic Claude Code issue #68110 (2026-06-13) reports a single general-purpose research delegation recursively spawning 48+ background agents, with overlapping research work. The report attributes the explosion to child agents retaining access to the Agent tool and lacking depth/count limits.
   - https://github.com/anthropics/claude-code/issues/68110
2. Claude Code issue #69206 (2026-06-17) reports a dynamic workflow intended to create about 10 workers spawning 218 subagents and burning roughly 700k tokens before manual intervention.
   - https://github.com/anthropics/claude-code/issues/69206
3. Claude Code issue #72566 reports 5 intended agents escalating to 361+ completed agents plus additional stopped/running agents, exhausting a 5-hour usage quota without completing the original deliverable.
   - https://github.com/anthropics/claude-code/issues/72566
4. Claude Code issue #36727 (2026-03-20) describes a single subagent making 234 tool calls, consuming more than 124k tokens and about 1.5 hours, and explicitly requests max_tool_calls, max_tokens, and timeout controls.
   - https://github.com/anthropics/claude-code/issues/36727
5. LangGraph exposes a recursion limit to stop graphs that do not reach a stop condition, demonstrating that bounded execution is already treated as a runtime safety primitive; however a graph-step recursion cap is not equivalent to a cross-agent token/fan-out budget.
   - https://github.com/langchain-ai/langgraph/blob/main/libs/langgraph/langgraph/errors.py
6. Claude Code issue #81691 (2026-07-27) requests exposing live subscription and per-task token accounting to planning logic because the model cannot currently plan against the real remaining budget.
   - https://github.com/anthropics/claude-code/issues/81691
7. Claude Code issue #83412 (2026-08-02) reports subagents terminating on usage/spend limits without partial-result handoff, showing that simply hitting a provider limit is a poor operational stop mechanism.
   - https://github.com/anthropics/claude-code/issues/83412

## Existing approaches
- Framework recursion/step limits.
- Human monitoring and manual termination.
- Provider/account usage caps.
- Prompt instructions such as “use at most N agents”.
- Per-agent output token limits.
- Application-specific concurrency semaphores.

## Observed limitations
- Recursion limits count graph execution steps, not aggregate descendants, token spend, or delegated parallelism.
- Provider usage caps trigger too late and may lose partial work.
- Prompt-only limits are not deterministic and can be bypassed by nested delegation or malformed workflow inputs.
- Concurrency caps bound simultaneous work but do not bound total descendants or cumulative tokens.
- Per-agent output caps can still permit a very large number of individually bounded agents.
- Human monitoring detects the blast radius after cost has already accumulated.

## Root-cause hypotheses
1. Delegation permission is inherited without an explicit child budget.
2. Spawn operations do not reserve from a shared tree-level budget atomically.
3. Limits are local to an agent rather than attached to the root task/delegation tree.
4. The orchestrator lacks deterministic observability for active descendants, cumulative spawns, token estimates, and remaining budget.
5. Failure handling treats quota exhaustion as an external error rather than a planned stop condition with partial-result handoff.

## Improvement target
Add a runtime-enforced delegation budget contract at the spawn boundary:
- every root task gets a budget envelope;
- every child receives a strictly smaller delegated envelope;
- spawn must atomically reserve descendant count, depth, concurrency, estimated token allowance, and optional tool/time allowance;
- recursive delegation is denied when the child has no delegation budget;
- actual usage is reconciled after completion;
- anomalies trigger deterministic cancellation and partial-result collection;
- model instructions can request delegation, but cannot override the runtime contract.

## Success metrics
- `max_descendants_observed <= configured_max_descendants`.
- `max_depth_observed <= configured_max_depth`.
- `peak_concurrency <= configured_max_concurrency`.
- no spawn succeeds without an atomic reservation.
- budget denial produces an explicit machine-readable reason.
- cumulative estimated/known token use remains within configured hard budget plus explicitly configured accounting tolerance.
- cancellation collects available partial results instead of silently discarding completed work.
- regression tests include recursive spawn, malformed fan-out, concurrent reservation race, budget exhaustion, and recovery.

## Evidence classification
### Observed evidence
The linked reports document runaway fan-out, excessive tool calls, large token consumption, quota exhaustion, and missing budget visibility/controls.

### Interpretation
These incidents share a missing runtime-level aggregate delegation budget, even though their immediate triggers differ.

### Proposed engineering solution
The guard, policy, workflows, and scripts in this package are a reusable design derived from the evidence. They are not claimed to be an official vendor fix.