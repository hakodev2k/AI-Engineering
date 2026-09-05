# Research evidence

## Topic
Successful Tool Loop Progress Guard

## Category
Thinking

## Problem
Agent workflows can repeat successful tool calls indefinitely because existing failure-based retry guards only increment on errors.

## Why it matters now
Current agent frameworks are being used for longer autonomous coding and tool workflows. A September 2026 OpenHands bug report shows a concrete loop that consumed about 2.6 million tokens while repeating successful list/search actions, exposing a gap between error handling and progress handling.

## Affected users
Coding-agent users; autonomous workflow builders; engineering teams paying for model/tool calls; maintainers of orchestration frameworks.

## Current public evidence
### Observed evidence
1. OpenHands issue #13574, opened 2026-09-02, reports infinite looping during normal operation. The agent repeatedly called `list`, `grep`, and `glob`; calls succeeded, so `consecutive_tool_failures` never increased. The report cites roughly 2.6M tokens consumed and notes that `MAX_ITERATIONS = 100000` did not provide a practical bound.
2. OpenHands issue #12974, opened 2026-07-29, reports agents getting stuck in loops and failing to make progress, with users requesting an interrupt-and-guidance mechanism. This is independent evidence that non-progress loops are operationally visible to users, not merely an exception-handling bug.
3. LangGraph documentation exposes recursion/step limits to stop graphs that exceed a maximum number of supersteps, demonstrating the standard global-bound mitigation. Such limits terminate execution but do not distinguish productive repeated work from successful non-progress.

### Interpretation
A failure counter and a global iteration cap solve different problems. Neither answers the key observable question: did the task state advance? A progress guard can detect a repeated successful cycle earlier without relying on hidden reasoning.

### Proposed solution
Maintain a compact event ledger with action, target, result fingerprint, and explicit progress marker. Detect repeated cycle signatures inside a bounded window only when progress does not advance; trigger a structured recovery path with at most two strategy changes.

## Existing approaches
Consecutive failure limits; maximum iterations/recursion limits; wall-clock timeouts; user interruption; model instructions telling the agent not to loop.

## Remaining limitations
Successful calls bypass failure counters. Huge global limits are expensive. Tight global limits can kill legitimate long tasks. Natural-language anti-loop instructions are not deterministic. User interruption requires someone to notice the loop.

## Root-cause analysis
- Progress is implicit rather than represented as observable state.
- Retry policy is coupled to tool errors instead of task advancement.
- Repeated action/result signatures are not fingerprinted.
- Stop conditions are global rather than local to a stalled subgoal.
- Recovery often repeats the same query/tool with no hypothesis change.

## Improvement opportunity
Instrument progress independently from success/failure, detect stable cycles early, and require recovery to change an observable dimension: hypothesis, query, tool, target, or subgoal.

## Relevant sources
- https://github.com/OpenHands/OpenHands/issues/13574
- https://github.com/OpenHands/OpenHands/issues/12974
- https://docs.langchain.com/oss/python/langgraph/errors/GRAPH_RECURSION_LIMIT
- https://docs.langchain.com/oss/python/langgraph/use-graph-api
