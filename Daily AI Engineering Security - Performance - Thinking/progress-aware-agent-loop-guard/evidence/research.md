# Research Evidence

## Topic
Progress-Aware Agent Loop Guard

## Category
Performance

## Problem
Agent runtimes frequently rely on total-step, recursion, or timeout ceilings even when a run has stopped making progress. This can waste model calls, tool calls, tokens, and wall-clock time, and can duplicate side effects if a runtime replays actions.

## Why it matters now
Tool-using and multi-agent systems are increasingly long-running. Recent 2026 reports show both framework-level and runtime-level loop failures, including loops that consume full context windows or continue despite attempted interruption.

## Affected users
Developers building tool-using agents, platform teams operating agent runtimes, AI-agent users paying per token/tool call, and teams running automated coding/research/customer-support workflows.

## Current public evidence
### Observed evidence
1. **LangChain #36139 — March 21, 2026.** A feature request explicitly documents that recursion/tool-call limits cap total steps but do not detect “same tool + same args + same error” or other no-progress patterns. The issue cites multiple existing repeated-failure reports and proposes progress-aware termination.  
   https://github.com/langchain-ai/langchain/issues/36139

2. **LangGraph #6731 — January 30, 2026.** A Text-to-SQL agent on LangGraph 1.0.6 repeatedly looped until the recursion limit of 20, despite prompt stop conditions; the reporter says the same configuration did not loop on a 0.6.x version.  
   https://github.com/langchain-ai/langgraph/issues/6731

3. **OpenClaw #73781 — April 28, 2026.** A runtime regression reportedly replayed the previous failed tool call, producing repeated execution, duplicate writes, and context-window exhaustion. The reporter notes that prompt anti-loop rules were ineffective because the repetition occurred in the runtime layer.  
   https://github.com/openclaw/openclaw/issues/73781

4. **Hermes Agent #66820 — July 18, 2026.** A MoA configuration reportedly entered an uninterruptible loop with 148 tool calls and no normal end reason, highlighting both wasted calls and missing cancellation checks inside reference fan-out.  
   https://github.com/NousResearch/hermes-agent/issues/66820

### Interpretation
These reports come from different runtimes and failure mechanisms, but share an operational symptom: execution continues after observable progress has stopped. The exact root cause can be model behavior, tool validation failure, runtime replay, graph transition logic, or multi-agent feedback. Therefore a reusable guard should detect the symptom without pretending to replace root-cause repair.

## Existing approaches
- recursion or maximum-iteration limits;
- per-tool call caps;
- task timeouts and cancellation;
- prompt instructions to stop or choose another tool;
- framework middleware/hook layers;
- tool-result caching or deduplication in some runtimes.

## Remaining limitations
- Count-only ceilings stop late and cannot separate productive long runs from pathological repetition.
- Prompt-only controls cannot correct runtime-level replay.
- Pure exact-call dedupe misses short cycles such as A→B→A→B or repeated semantically identical failures with new call IDs.
- Caching is unsafe as a universal fix because live-data and state-mutating tools may need real re-execution.
- Automatic retry can duplicate side effects.

## Root-cause analysis
1. **Weak stop semantics:** termination depends on model judgment instead of an observable state transition.
2. **No canonical progress signal:** call IDs change even when tool/args/outcome are materially identical.
3. **Runtime replay and message reentry:** failed actions can be reinserted below the policy layer.
4. **Graph cycles without state novelty checks:** legal edges can form non-productive cycles.
5. **Backstops conflated with diagnosis:** a recursion limit prevents infinity but does not explain or minimize waste.

## Improvement opportunity
Add a framework-agnostic post-tool guard that canonicalizes action/outcome fingerprints, tracks repeat streaks and short cycles, checks optional application state fingerprints, keeps a hard maximum-step ceiling, and emits a machine-readable stop reason. Verify it against both known-loop fixtures and successful long-task fixtures to control false positives.

## Goal
Terminate non-productive loops earlier while preserving successful long runs.

## Metrics
Primary: repeated tool calls/task, total tool calls/task, tokens/task, latency, time-to-loop-stop.  
Quality: task success rate, false-positive stop rate, result-quality regression.  
Safety: duplicated side-effecting calls introduced by recovery = 0.

## Trigger
Run after every tool result or graph transition, before scheduling another model/tool step.

## Inputs
Canonical tool call, arguments, result/error signature, optional application-state fingerprint, counters, latency/tokens, configured thresholds.

## Outputs
`continue`, `no_progress_detected`, or `hard_limit_reached`, plus evidence explaining the fingerprint/cycle that caused the decision.

## Proposed solution
See the package workflow and deterministic script. This is a proposed engineering layer, not a claim that upstream frameworks have adopted it.

## Relevant sources
- https://github.com/langchain-ai/langchain/issues/36139
- https://github.com/langchain-ai/langgraph/issues/6731
- https://github.com/openclaw/openclaw/issues/73781
- https://github.com/NousResearch/hermes-agent/issues/66820
