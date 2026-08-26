# Research — Bounded Agent Loop Budget Guard

**Topic:** Detecting and stopping no-progress agent loops  
**Category:** Thinking  
**Research date:** 2026-08-26 (UTC+7)

## Problem
Autonomous agent loops can keep invoking the model or tools after useful progress stops. Repetition may occur in skill loading, tool approval, retries, evaluator/judge loops, background-task polling, or nested orchestration. Without observable progress and hard bounds, the failure can consume extreme token budgets while producing no usable result.

## Why it matters now
A Microsoft Agent Framework issue opened August 1, 2026 reports a repeated MCP skill-loading/auto-approval loop that consumed more than 100 million tokens over three days before an Azure budget alert exposed it. Microsoft subsequently documents that autonomous loops must always be bounded because completion conditions can fail and models can stall. OpenAI Agents SDK documentation similarly exposes a `max_turns` boundary and raises `MaxTurnsExceeded` when the limit is crossed.

## Affected users
Developers building agents, platform teams operating multi-step workflows, users enabling auto-approved tools, engineering teams paying model costs, and vendors providing long-running agents.

## Current public evidence

### Observed evidence
1. Microsoft Agent Framework issue #7472, opened August 1, 2026, describes a logical loop in an MCP-skills sample: model requests `load_skill` → auto-approved → inner agent re-invoked → model requests `load_skill` again. The reporter states their version consumed 100+ million tokens over three days:  
   https://github.com/microsoft/agent-framework/issues/7472
2. Microsoft Learn, "Agent looping," updated August 10, 2026, states that autonomous loops should always be bounded and documents finite `MaxIterations`/`max_iterations` defaults and completion conditions:  
   https://learn.microsoft.com/en-us/agent-framework/agents/looping
3. Microsoft Learn, "Using function tools with human in the loop approvals," updated in August 2026, shows approvals may themselves be processed in a loop until all required function calls are handled, emphasizing that approval orchestration is a nested control-flow surface:  
   https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval
4. OpenAI Agents SDK Runner documentation states the agent runs in a loop until final output and raises `MaxTurnsExceeded` when `max_turns` is exceeded:  
   https://openai.github.io/openai-agents-python/ref/run/
5. OpenAI Agents JS issue #1435, opened July 1, 2026, reports failures when a streamed run using `previousResponseId` encounters consecutive tool-approval interruptions, showing that multi-approval resumption is non-trivial runtime state:  
   https://github.com/openai/openai-agents-js/issues/1435

### Interpretation
The core reliability problem is not simply "forgot to set max iterations." A useful production control must distinguish real iterative progress from repeated action signatures. Hard caps are necessary but often detect the failure late; external cost alerts detect it later still. Nested loops also make it difficult to reason about which layer owns the termination contract.

### Proposed solution
Track every autonomous step in a normalized trace, enforce finite global budgets, and calculate a repeated-action/no-progress signal. Stop immediately when a signature repeats beyond policy without positive `progress_delta`, while preserving a hard token/tool/iteration ceiling as the final backstop.

## Existing approaches
- Framework `max_iterations` / `max_turns` settings.
- Completion predicates and explicit completion markers.
- Approval escape hatches.
- Timeouts and retry limits.
- Cloud provider budget alerts.
- Manual log inspection and tracing.

## Remaining limitations
- A high hard cap still allows large waste before termination.
- A low hard cap can terminate valid long-running tasks.
- Nested subagents/tools may create loops that are invisible to a single framework-level counter.
- Completion predicates can be probabilistic or incorrectly specified.
- Cost alerts are external and reactive rather than task-local.
- Repeated calls may differ superficially while representing identical no-progress behavior.

## Root-cause analysis
1. Termination is delegated to model output or a probabilistic evaluator.
2. Progress is rarely defined as an observable metric.
3. Retry/approval/tool loops have separate counters rather than a shared budget ledger.
4. Tool-call signatures are not normalized for repetition detection.
5. Budget ownership is unclear across nested agents.
6. Operators learn about runaway behavior from billing rather than task-local guards.

## Improvement opportunity
Use a reusable deterministic guard independent of orchestration framework. It consumes normalized step events, enforces task-level budgets, detects repeated no-progress signatures, and produces explicit stop reasons. Framework-native bounds remain enabled as defense in depth.

## Relevant sources
- Microsoft Agent Framework #7472: https://github.com/microsoft/agent-framework/issues/7472
- Microsoft Learn agent looping: https://learn.microsoft.com/en-us/agent-framework/agents/looping
- Microsoft Learn tool approval: https://learn.microsoft.com/en-us/agent-framework/agents/tools/tool-approval
- OpenAI Agents SDK Runner: https://openai.github.io/openai-agents-python/ref/run/
- OpenAI Agents JS #1435: https://github.com/openai/openai-agents-js/issues/1435
