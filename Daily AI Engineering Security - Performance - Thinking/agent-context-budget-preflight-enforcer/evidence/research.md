# Research

## Topic
Agent Context Budget Preflight Enforcer

## Category
Token / Performance

## Problem
Context limits are often enforced too late or incompletely. Long-running agents can accumulate history while tool schemas, skills, memory, documents, and tool outputs consume large fractions of the input window. A configured compaction feature is not sufficient if it does not execute before each model call.

## Why it matters now
Agent frameworks are adding richer context, skills, tools and long-lived sessions. Recent 2026 issues report both lifecycle gaps in pre-call compaction and practical context bloat on small models.

## Affected users
Agent framework maintainers, coding-agent users, local-model users, platform teams, and developers running long multi-turn or tool-heavy sessions.

## Current public evidence
### Observed evidence
1. Microsoft Agent Framework issue #7011 (July 2026) reports that `ContextWindowCompactionStrategy` configured through `create_harness_agent` does not apply token-budget truncation to the messages sent to the model because the `before_run` path sees empty context. The report notes long text conversations can grow until the model rejects them: https://github.com/microsoft/agent-framework/issues/7011
2. Odysseus issue #4778 (June 23, 2026) reports agent prompt bloat on 4k/8k/16k local models: tool schemas, skills and descriptions can consume most of the window, and tool retrieval does not scale to context size: https://github.com/odysseus-dev/odysseus/issues/4778
3. Hermes-agent issue #81575 (August 8, 2026) requests proactive detection around 85% context usage and checkpoint/continuation because the agent cannot detect its own context-window usage before nearing the limit: https://github.com/NousResearch/hermes-agent/issues/81575
4. OpenClaw issue #6650 (February 2026) describes session/tool-result bloat causing context fill, token-cost growth and degraded performance: https://github.com/openclaw/openclaw/issues/6650

### Interpretation
The recurring failure is not simply "context windows are small". The engineering gap is lifecycle placement and component accounting: budget enforcement must happen on the exact payload immediately before the model call and reserve room for output.

### Proposed solution
Add a provider/model-aware preflight gate over measured component token counts, then apply bounded, priority-aware reductions and re-measure before sending.

## Existing approaches
- Sliding windows and truncation.
- Tool-result compaction.
- Summarization/checkpointing.
- Larger context models.
- Framework `max_context_window_tokens` options.

## Remaining limitations
- Compaction may run after a turn rather than before the model call.
- Global message counts ignore tool-schema and injected-context cost.
- Generic truncation can remove critical instructions/evidence.
- Output reserve is frequently omitted from input budgets.
- Static thresholds do not adapt to smaller model windows.

## Root-cause analysis
1. Token accounting is spread across prompt builder, history provider, retrieval, tools and middleware.
2. The budget check is not attached to the final serialized request lifecycle point.
3. Components lack priority/eviction metadata.
4. Reduction is attempted without objective before/after measurement.
5. No explicit stop condition exists when safe reduction is exhausted.

## Improvement opportunity
Create a reusable preflight contract: measure every component, reserve output and margin, compute utilization, emit deterministic reduction candidates, run at most two reduction cycles, and block if correctness-critical context would need removal.

## Goal
Prevent model context-overflow failures and reduce unnecessary token/cost growth without increasing correctness regressions.

## Metrics
Overflow after preflight 0%; input tokens/task; context utilization; output-reserve violations; task-quality regression rate; reduction cycles/task.

## Trigger / Inputs / Outputs
- Trigger: immediately before every model request after all dynamic context is assembled.
- Inputs: component token counts, model window, output reserve, safety margin, component priority/criticality.
- Output: `allow`, `reduce`, or `block` plus budget report and safe reduction candidates.

## Relevant sources
- https://github.com/microsoft/agent-framework/issues/7011
- https://github.com/odysseus-dev/odysseus/issues/4778
- https://github.com/NousResearch/hermes-agent/issues/81575
- https://github.com/openclaw/openclaw/issues/6650
