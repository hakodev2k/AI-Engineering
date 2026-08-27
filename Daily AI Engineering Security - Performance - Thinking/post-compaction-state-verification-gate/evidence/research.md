# Research — Post-Compaction State Verification Gate

**Topic:** Prevent stale-state trust and execution instability after context compaction  
**Category:** Thinking  
**Research date:** 2026-08-27 (UTC+7)

## Problem
Long-running agents compress conversation history to stay within context limits. The resulting summary can become a single point of failure: omitted constraints, weakened recent interactions, or stale claims can alter subsequent decisions even when the summary looks coherent.

## Why it matters now
August 2026 public evidence shows both measured execution instability from compression and real coding-agent reports of loops, drift, stale-state trust, and compaction failures.

## Affected users
Developers running long coding sessions, agent-orchestration teams, platform builders implementing compaction, and users relying on resume/continuation.

## Current public evidence

### Observed evidence
1. Min et al., “Toward Reliable Context Compression for Long-Horizon Agents” (arXiv:2608.06503, submitted 2026-08-06) reports that recurrent compression can weaken the influence of recent interactions and increase blocked actions, repeated exploration, and run-to-run instability. The paper introduces verifier-guided boundary-local evaluation (TRACE) and reports initial AppWorld improvements over compression baselines: https://arxiv.org/abs/2608.06503
2. MoonshotAI Kimi CLI issue #2586, opened 2026-08-05, reports repetitive verify/diagnose loops, no escalation, instruction drift, and stale-state trust in long-running sessions. The reporter specifically notes that after automatic compaction the agent re-derived state from its own summary instead of re-checking files/task state: https://github.com/MoonshotAI/kimi-cli/issues/2586
3. OpenAI Codex issue #38434, opened 2026-08-13, reports compaction and long-running-task failures across Desktop/Work, VS Code, and WSL CLI, indicating that long-horizon continuation remains operationally fragile across multiple surfaces: https://github.com/openai/codex/issues/38434
4. OpenAI Codex issue #21468 requests visible and prompt-guided compact summaries because users cannot inspect which decisions, constraints, rejected approaches, and edge cases survived compaction: https://github.com/openai/codex/issues/21468

### Interpretation
The practical failure is not simply “summary quality.” It is continuing execution without re-establishing which summary claims remain supported by current external state.

### Proposed solution
Use a post-compaction checkpoint with explicit Facts, Assumptions, Claims, Evidence, Risks, loop state, and Verification status. Critical claims about files, tests, task completion, permissions, branch state, deployments, or user constraints must be re-verified before consequential action.

## Existing approaches
- Automatic/manual context compaction.
- Larger context windows.
- Session restart and handoff notes.
- Generic summarization prompts.
- Verifier-guided compression research such as TRACE.

## Remaining limitations
- Compaction output may be opaque.
- Summaries can be internally coherent but externally stale.
- Larger windows postpone rather than remove context-management needs.
- Generic retry loops can repeat the same failed action after state loss.
- Research frameworks are not automatically wired into everyday coding-agent hooks.

## Root-cause analysis
1. Summary claims are accepted without provenance.
2. External state changes independently of remembered narrative.
3. Critical and noncritical claims are not separated.
4. Loop counters and stop conditions may be lost at compaction boundaries.
5. Verification often happens only at final completion, too late to prevent drift.

## Improvement opportunity
Treat compaction as a checkpoint boundary requiring state re-grounding, bounded retry budgets, and independent verification for critical claims. This converts implicit memory into observable evidence contracts.

## Relevant sources
- https://arxiv.org/abs/2608.06503
- https://github.com/MoonshotAI/kimi-cli/issues/2586
- https://github.com/openai/codex/issues/38434
- https://github.com/openai/codex/issues/21468
