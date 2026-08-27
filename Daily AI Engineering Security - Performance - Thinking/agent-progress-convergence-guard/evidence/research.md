# Research — Agent Progress Convergence Guard

**Topic:** Long-running agent workflows expand process without converging  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Long-running AI coding workflows can continue spawning subagents, review cycles, planning artifacts, and governance scaffolding while making little measurable progress toward the requested production deliverable.

## Why it matters now
Two current Codex reports describe closely related failure modes in long-running agent work. On August 8, 2026, issue #37600 reported hours spent expanding process/governance scaffolding without proportional implementation progress. On July 29, 2026, issue #35892 reported a finite task expanding into additional tasks, subagent lanes, review cycles, and verification gates for roughly three days instead of converging.

## Affected users
Developers using long-running coding agents, engineering teams delegating implementation to subagents, and platform builders implementing autonomous orchestration.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #37600, opened **August 8, 2026**, reports a Goal/subagent workflow spending several hours expanding process and governance scaffolding without proportional production implementation. https://github.com/openai/codex/issues/37600
2. OpenAI Codex issue #35892, opened **July 29, 2026**, reports a long-running task repeatedly expanding a finite implementation into new tasks, subagent lanes, review cycles, and verification gates over about three days. https://github.com/openai/codex/issues/35892
3. Claude Code issue #72080, opened **June 28, 2026**, reports subagents entering repeated loops that waste substantial tokens, with manual stop instructions improving recovery. https://github.com/anthropics/claude-code/issues/72080

### Interpretation
These are observable orchestration failures, not evidence about hidden reasoning. The shared engineering weakness is lack of an enforceable convergence contract: orchestration can measure activity but not whether a cycle delivered an accepted artifact, reduced a blocker, or legitimately changed scope.

## Existing approaches
- Task decomposition and subagent delegation.
- Review and verification agents.
- Status polling and task lists.
- Model-directed stop decisions.
- Manual user intervention when the workflow drifts.

## Remaining limitations
- Activity counters do not distinguish production delta from process scaffolding.
- A reviewer can create another review task without proving that implementation changed.
- Scope can expand incrementally without an explicit approved scope-change event.
- Stop decisions may be subjective and unbounded.
- A failed cycle can trigger more delegation rather than a bounded recovery path.

## Root-cause analysis
1. No canonical acceptance ledger maps the user goal to verifiable deliverables.
2. Progress is inferred from messages/tool calls instead of accepted artifact deltas.
3. Scope changes are not always separated from implementation work.
4. Retry and review loops lack hard budgets.
5. Implementers may self-verify, reducing independence.
6. Failure recovery can add process rather than reduce uncertainty.

## Improvement opportunity
Use a deterministic convergence gate after every cycle. Require observable fields: target criterion, accepted deliverable delta, evidence references, blocker delta, scope-growth count, and retry number. Block another autonomous cycle after repeated zero-delta outcomes or excessive scope growth. Require independent verification before marking completion.

## Goal
Increase verified progress per cycle and prevent unbounded process expansion.

## Metrics
Accepted deliverables/cycle; consecutive zero-delta cycles; scope-growth events; retries/blocker; cycles to verified completion; unsupported completion claims.

## Trigger
Long-running task, subagent fan-out, repeated review, or any second cycle without an accepted deliverable delta.

## Inputs
Goal/acceptance criteria, cycle log, artifact/evidence references, scope changes, blockers, reviewer decision.

## Outputs
`continue`, `stop-and-escalate`, or `complete` with observable reason codes.

## Relevant sources
- https://github.com/openai/codex/issues/37600
- https://github.com/openai/codex/issues/35892
- https://github.com/anthropics/claude-code/issues/72080
