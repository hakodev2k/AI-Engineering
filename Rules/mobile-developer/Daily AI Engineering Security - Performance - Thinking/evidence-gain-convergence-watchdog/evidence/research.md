# Research Evidence

## Topic
Evidence Gain Convergence Watchdog

## Category
Thinking

## Problem
Long-running coding agents can consume hours, tokens, and repeated tool calls without converging on the user's terminal objective. The failure is not simply slow inference: the agent repeatedly opens new uncertainties, reruns low-value probes, restates plans, loses terminal-goal state through compaction, and reports progress not supported by actual tool state.

## Why it matters now
Current Codex issue reports show concrete sessions with severe time/token inflation and zero original bugs fixed, while earlier session traces show compaction-driven re-reading and repeated tests. These failures are observable and measurable enough to support deterministic convergence controls rather than vague prompting.

## Affected users
Developers running long coding/release tasks, autonomous agents, CI agents, multi-agent workflows, and teams paying for long-context/tool-heavy sessions.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #39512, reported 2026-08-19, documents a >5-hour task versus a <1-hour baseline, >5× slowdown, excessive token use, repeated reopening of settled decisions, misleading progress language, non-convergent validation, and zero originally reported bugs fixed.
2. Codex issue #36664 documents a 5.9-hour session with 74 compactions, 9.47M total tokens plus 183.9M cached-input tokens, where 95% of compactions were followed within two minutes by re-reading an already-read file or rerunning an already-run test.
3. The #39512 report explicitly requests safeguards that detect repeated tool calls with no evidence gain, repeated reopening of user decisions, and elapsed/token cost disproportionate to task scale.

### Interpretation
The shared failure mode is missing observable convergence state. Agents have rich narration but weak machine-checkable accounting of terminal goals, unresolved blockers, evidence gained per action, repeated probes, and phase completion. Without that structure, a safe agent can still waste resources indefinitely while sounding cautious.

## Existing approaches
- Natural-language plans and task lists.
- Context compaction and summaries.
- Generic maximum-turn/token limits.
- Human intervention when a session appears stuck.
- Test-fix-retest loops without explicit evidence-delta requirements.

## Remaining limitations
- Hard turn/token limits stop work but do not diagnose whether progress is converging.
- Plans can drift or be rewritten without preserving settled user decisions.
- A successful tool call is not proof that a blocker changed.
- Repeated probes may differ syntactically while resolving the same already-settled question.
- Status language is often not bound to tool-state evidence.

## Root-cause analysis
1. No persistent terminal-goal contract with explicit phases and completion evidence.
2. No evidence ledger mapping each tool call to the uncertainty it is expected to resolve.
3. No novelty/evidence-gain score before repeating validation.
4. No overrun budget comparing elapsed time/tokens/tool calls to task baseline.
5. No stop/replan threshold when multiple actions fail to change the evidence state.
6. Progress reporting is generated independently from actual phase/tool state.

## Improvement opportunity
Introduce a reusable convergence watchdog that tracks terminal goal, settled decisions, blockers, phase state, tool-call evidence deltas, and resource budgets. Before a repeated investigation or validation, require a named unresolved uncertainty and expected new evidence. Trigger bounded re-planning when evidence gain falls below threshold, and block completion claims not supported by phase evidence.

## Relevant sources
- https://github.com/openai/codex/issues/39512
- https://github.com/openai/codex/issues/36664
