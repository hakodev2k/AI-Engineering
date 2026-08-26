# Research — Subagent Fanout Context Cost Budgeter

**Category:** Token  
**Research date:** 2026-08-27 (UTC+7)

## Topic
Multi-agent fan-out that multiplies fixed context/tool/skill overhead and repeatedly re-meters large parent context during status polling.

## Problem
Spawning many specialized subagents can look cheaper than using one larger agent, but every child may pay a bootstrap/context cost and orchestration can add repeated full-context status turns. Tiny delegated tasks therefore become token-negative, increasing cost and sometimes disk/memory usage without proportional value.

## Why it matters now
Codex issue #39808, opened 2026-08-20, explicitly reports that subagent fan-out can increase usage because every child pays fixed instructions, tool schemas, skills, repository context and possibly parent-history overhead. Codex issue #37299, opened 2026-08-06, reports wait/status orchestration re-metering roughly 137–141k input tokens per turn while 75% of model-visible tool calls were wait/list operations in one measured workload. Codex issue #39469, opened 2026-08-19, reports 21 subagent rollout files each duplicating a roughly 9.4 GiB parent context snapshot, creating extreme storage and memory amplification.

## Affected users
Developers using coding agents, teams building multi-agent workflows, agent-platform engineers, and operators optimizing model cost/latency/throughput.

## Current public evidence

### Observed evidence
1. Codex #39808 states that fixed per-agent context cost can make small subagents more expensive than one serial agent and requests per-agent usage visibility, lightweight isolated workers, and grouping of tiny tasks.  
   https://github.com/openai/codex/issues/39808
2. Codex #37299 reports 8,744 of 11,002 model-visible tool calls were wait/wait_agent/list_agents in one workload; 83% of wait_agent calls timed out; average input per turn was approximately 137–141k tokens, mostly cached, and stale running agents prolonged polling.  
   https://github.com/openai/codex/issues/37299
3. Codex #39469 reports a measured fan-out amplification where 21 child rollout files each contained near-identical roughly 9.4 GiB inherited parent state; quarantining oversized files reportedly removed the observed resource symptoms.  
   https://github.com/openai/codex/issues/39469
4. A third-party measurement published 2026-08-11 reports substantial per-subagent startup token floors in Claude Code and much higher overhead on a configured machine, illustrating that bootstrap cost is not unique to one implementation. Figures are version-specific and should not be generalized without local measurement.  
   https://aieveryminute.com/each-parallel-subagent-costs-20398-tokens/

### Interpretation
The optimization problem is workload-dependent. Parallelism is beneficial only when unique work/latency savings exceed child bootstrap, inherited context, orchestration and result-synthesis costs. Without a pre-spawn budget and per-child telemetry, teams cannot know that break-even point.

## Existing approaches
- Use smaller models for subagents.
- Rely on prompt caching.
- Limit concurrency.
- Manually group related tasks.
- Keep child prompts short.
- Use status/wait calls to coordinate completion.

## Remaining limitations
- Smaller models still pay fixed context and tool-schema overhead.
- Cached tokens can still contribute to usage/latency/account limits depending on platform semantics.
- Concurrency caps limit peak fan-out but do not prevent total over-spawning.
- Frequent polling can dominate total turns even when children are idle.
- Inherited parent history may dwarf a child's unique task context.
- Teams often measure total session usage only after the expensive fan-out has already happened.

## Root-cause analysis
1. No pre-spawn break-even calculation using measured child bootstrap cost.
2. Parent context, skill catalogues and tool schemas are copied too broadly.
3. Child tasks are too small relative to fixed startup overhead.
4. Polling cadence is decoupled from expected task duration/state changes.
5. Per-agent usage, cache composition and inherited-context telemetry are insufficient or unavailable.
6. Fan-out decisions optimize theoretical parallel latency without a token/cost constraint.

## Improvement opportunity
Measure a local child bootstrap baseline, estimate unique work per child, include inherited-context and polling costs, then block or regroup fan-out when the predicted token budget exceeds configured thresholds or serial execution. After execution, compare predicted vs actual and update the baseline. Preserve task quality by never removing context required for correctness.

## Relevant sources
- Codex #39808: https://github.com/openai/codex/issues/39808
- Codex #37299: https://github.com/openai/codex/issues/37299
- Codex #39469: https://github.com/openai/codex/issues/39469
- Version-specific Claude Code measurement: https://aieveryminute.com/each-parallel-subagent-costs-20398-tokens/
