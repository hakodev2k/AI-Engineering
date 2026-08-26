# Research — Bounded Agent Retry and Progress Guard

**Category:** Thinking  
**Research date:** 2026-08-26 (UTC+7)

## Topic
Long-running AI agents can enter unbounded retry, compaction, or repeated-action loops even after the system has enough evidence that no progress is being made.

## Problem
Retry/backoff logic and model-driven recovery loops often lack a hard attempt budget, explicit progress predicate, or terminal escalation state. The result can be hours of repeated actions, indefinite “thinking,” wasted tokens, and no reliable handoff to a human.

## Why it matters now
Multiple public reports in 2026 show this is still an active engineering failure rather than a theoretical concern. An OpenCode issue opened August 11, 2026 documents stream errors retrying indefinitely because no maximum attempt count exists. A separate OpenCode issue documents an infinite overflow → compact → overflow loop when compaction fails to reduce context. An OpenAI Codex issue opened August 12 reports a task running about three hours while repeating the same activity.

## Affected users
Coding-agent users, agent-runtime maintainers, orchestration teams, platform operators, and teams running unattended or expensive long-lived tasks.

## Current public evidence

### Observed evidence
1. OpenCode issue #41848, opened 2026-08-11, reports no maximum LLM retry attempts; retryable stream errors can continue indefinitely and leave the UI stuck on “Thinking”.  
   https://github.com/anomalyco/opencode/issues/41848
2. OpenCode issue #27924 documents an infinite compaction loop when compression fails to reduce context below the limit: overflow → compact → overflow repeatedly consumes API credits without progress.  
   https://github.com/anomalyco/opencode/issues/27924
3. OpenAI Codex issue #38124, opened 2026-08-12, reports reliability failures including a Codex task that ran for roughly three hours while repeating the same activity.  
   https://github.com/openai/codex/issues/38124
4. OWASP's current AI Agent Security Cheat Sheet recommends enforcing token, cost, retry, recursion and tool-chain limits and explicitly warns against unlimited retries/recursion.  
   https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html

### Interpretation
Backoff is not termination. Loop detection is not recovery unless detection is tied to an observable progress contract, a bounded retry budget, and a terminal state that halts or escalates. Model self-assessment alone is insufficient because the same model can rationalize repeating the same ineffective action.

## Existing approaches
- Exponential backoff and retryable-error classification.
- Context compaction on overflow.
- Model prompts asking the agent to reconsider.
- Duplicate-action/loop heuristics.
- Timeouts at individual tool/API-call level.

## Remaining limitations
- Backoff can slow an infinite loop without bounding it.
- Per-call timeouts do not bound the entire recovery sequence.
- Compaction can itself become the repeated failing action.
- Duplicate-action detection may block one tool call while leaving the agent run alive.
- Generic retry counts do not distinguish real progress from repeated attempts with cosmetic variation.

## Root-cause analysis
1. No run-level retry budget exists across related failures.
2. Progress is not represented as an explicit observable event.
3. Action equivalence is not normalized into stable signatures.
4. Retry, compaction and tool loops are governed by separate subsystems with no shared stop condition.
5. Failure states fall back into the model loop rather than a deterministic terminal/escalation state.

## Improvement opportunity
Add a deterministic run-level guard that tracks consecutive retries, normalized repeated actions and steps without declared progress. When any configured budget is exhausted, transition to `halt_and_escalate`, persist compact evidence, and prevent the model from autonomously restarting the same loop. Require explicit human/operator action or a materially different recovery plan to resume.

## Relevant sources
- OpenCode #41848: https://github.com/anomalyco/opencode/issues/41848
- OpenCode #27924: https://github.com/anomalyco/opencode/issues/27924
- OpenAI Codex #38124: https://github.com/openai/codex/issues/38124
- OWASP AI Agent Security Cheat Sheet: https://cheatsheetseries.owasp.org/cheatsheets/AI_Agent_Security_Cheat_Sheet.html
