# Research — Agent Progress Evidence Circuit Breaker

**Topic:** Deterministic no-progress detection for long-running agent loops  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Agent runtimes can continue scheduling model turns or tool calls after useful work has stopped. Current controls often measure steps or rely on the model/runtime to declare completion, rather than requiring observable progress.

## Why it matters now
Long-running coding agents and tool-loop frameworks are increasingly used for autonomous multi-step work. Recent August 2026 reports show continuation scheduling can consume tokens after progress stops or even after a goal is persisted as paused. A July 2026 Vercel AI SDK issue independently identifies repeated identical tool calls as a production failure mode not well handled by existing stop conditions.

## Affected users
Developers building agents, coding-agent users, platform teams operating long-running goals, and engineering teams paying for repeated model/tool execution.

## Current public evidence

### Observed evidence
1. **OpenAI Codex issue #37800, opened August 10, 2026:** a long-running task repeatedly emitted continuation acknowledgements without edits or meaningful progress, consuming tokens and time until the goal became blocked.  
   https://github.com/openai/codex/issues/37800
2. **OpenAI Codex issue #37869, opened August 10, 2026:** a goal whose persisted status was confirmed as `paused` still received automatic continuation turns.  
   https://github.com/openai/codex/issues/37869
3. **Vercel AI issue #17606, opened July 21, 2026:** requests a built-in repeated-identical-tool-call stop condition because `stepCountIs(n)` is blunt while loop-finished control can permit indefinite execution; the reporter describes repeated identical tool calls in production.  
   https://github.com/vercel/ai/issues/17606

### Interpretation
These reports indicate a control-plane gap between "the agent is allowed to take another step" and "there is evidence another step is useful." The recurring engineering problem is insufficient deterministic progress accounting across continuation boundaries. This interpretation does not imply the products share one implementation defect.

## Existing approaches
- Fixed `maxSteps` / step-count termination.
- Model or framework stop conditions.
- Persisted task states such as active/paused/blocked.
- Manual user interruption.
- Application-specific duplicate-call checks.

## Remaining limitations
- A fixed step ceiling spends budget even when the run is obviously stuck early.
- A low ceiling can terminate legitimate long tasks.
- Model-generated status text is not reliable evidence of external progress.
- A scheduler may enqueue work from stale state unless status is revalidated at continuation time.
- Byte-identical tool calls are detectable, but no-progress can also appear as alternating calls, repeated reads, unchanged test results, or acknowledgement-only turns.

## Root-cause analysis
1. Progress is often implicit rather than represented as a first-class observable record.
2. Continuation authorization may be based on stale goal state.
3. Loop limits count steps instead of state-changing evidence.
4. Retry and recovery policies may lack separate budgets for no-progress execution.
5. Commentary/output text can be mistaken for task progress even when no artifact, evidence, or state changed.

## Improvement opportunity
Introduce a reusable deterministic progress ledger. Before scheduling a continuation, compute whether the recent window contains accepted progress evidence: changed artifact digest, changed test status, new evidence identifier, new unique tool result, or a valid task-state transition. Reject continuation on paused/blocked states, repeated identical calls, or a bounded number of no-progress windows. Require independent verification before declaring completion.

## Goal
Reduce wasted continuation turns while preserving productive long-running work.

## Metrics
- no-progress turns per task
- repeated-call stop latency
- tokens per accepted progress event
- false-stop rate on successful long tasks
- continuations scheduled after paused/blocked state
- successful task rate before/after guard

## Trigger
Run before every automatic continuation and after every tool-result window.

## Inputs
Task status, model-turn events, tool names/arguments/results, artifact digests, test outcomes, evidence IDs, token usage where available.

## Outputs
Machine-readable `continue`, `stop`, or `escalate` decision plus observable reason codes.

## Relevant sources
- OpenAI Codex #37800: https://github.com/openai/codex/issues/37800
- OpenAI Codex #37869: https://github.com/openai/codex/issues/37869
- Vercel AI #17606: https://github.com/vercel/ai/issues/17606
