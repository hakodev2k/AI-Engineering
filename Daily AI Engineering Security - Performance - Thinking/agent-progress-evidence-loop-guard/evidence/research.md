# Research — Agent Progress Evidence Loop Guard

**Category:** Thinking  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Progress-aware termination for long-running tool-using agents that remain active but stop producing verifiable progress.

## Problem
Long-running agents can continue issuing valid-looking tool calls while repeatedly revisiting the same action/state, consuming tokens and wall-clock time without producing durable task progress. Simple step caps are too blunt: they can terminate productive work early, while still allowing a stuck run to burn the whole budget.

## Why it matters now
Current agent runtimes increasingly support longer tool loops and configurable stop conditions, but public issues in 2026 show that repeated tool calls and hard step limits still produce failure modes that require application-specific workarounds.

## Affected users
Developers using tool-loop agents, coding-agent operators, platform builders, benchmark teams, and engineering teams running unattended or long-lived agents.

## Current public evidence

### Observed evidence
1. Vercel AI issue #17606 (opened July 21, 2026) requests a built-in repeated-tool-call stop condition because production agents can reissue byte-identical tool calls step after step. The author notes that step caps either stop useful long runs or allow stuck runs to consume the full budget.  
   https://github.com/vercel/ai/issues/17606
2. Vercel AI issue #13075 (March 4, 2026) documents a `ToolLoopAgent` case where a hard `stepCountIs` stop reaches the limit and causes `AI_NoOutputGeneratedError` instead of a useful final output, illustrating that blunt stopping can degrade completion behavior.  
   https://github.com/vercel/ai/issues/13075
3. A production-oriented August 12, 2026 report describes an SWE-bench run that consumed 1.06M tokens while remaining operational yet never wrote the patch, emphasizing the difference between liveness and measurable progress.  
   https://plori.ai/blog/stop-ai-agent-stuck-in-loop

### Interpretation
The root reliability gap is not merely repeated calls. The runtime often lacks an external, observable definition of progress. A loop can vary prompts or calls enough to avoid exact-repeat detection while still failing to create new evidence, state changes, artifacts, or verified milestones.

## Existing approaches
- Hard step limits (`stepCountIs`, `maxSteps`).
- Wall-clock and token budgets.
- Exact repeated-tool-call guards.
- Model-authored self-reflection or “try a different approach” prompts.
- Manual operator cancellation.

## Remaining limitations
- Step/time/token limits cap damage but do not identify no-progress behavior early.
- Exact call equality misses semantically equivalent retries with reordered JSON or inconsequential parameter changes.
- Model-only reflection is not an independent control and may loop with the agent.
- Polling tools legitimately repeat calls when the external state changes; naive repetition rules can false-positive.
- Many systems do not persist a durable progress checkpoint before stopping.

## Root-cause analysis
1. Liveness is mistaken for progress.
2. Tool-call identity is measured more often than state/result novelty.
3. Stop conditions are not linked to task-specific durable milestones.
4. Agent and verifier share the same reasoning path, reducing independence.
5. Recovery often lacks a bounded handoff path after a no-progress decision.

## Improvement opportunity
Use a deterministic trace-side guard that computes canonical action signatures, result fingerprints, durable-state fingerprints, and checkpoint deltas. Stop only after a bounded no-progress streak, while allowing legitimate polling when result/state fingerprints change. Emit a structured stop record so the agent can save partial work and hand off for independent review.

## Relevant sources
- Vercel AI repeated tool call stop-condition proposal: https://github.com/vercel/ai/issues/17606
- Vercel AI hard-stop output issue: https://github.com/vercel/ai/issues/13075
- Production no-progress case study: https://plori.ai/blog/stop-ai-agent-stuck-in-loop
- AI SDK stop condition source/docs context: https://github.com/vercel/ai/blob/main/packages/ai/src/generate-text/stream-text.ts
