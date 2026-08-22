# Research Evidence

## Topic
Evidence-Gain Convergence Controller

## Category
Thinking

## Problem
Long-running coding agents can spend large amounts of time/tokens on repeated planning, probes, reviews, re-checks, delegation, and status narration without materially reducing uncertainty or advancing the user's terminal objective. The failure is observable as low evidence gain per action, repeated reopening of settled decisions, recursive review/fix loops, and progress language detached from tool state.

## Why it matters now
A new `openai/codex` report on August 19, 2026 describes a >5-hour task on a <1-hour baseline that fixed zero original bugs while repeatedly reopening decisions and running low-value probes. Other recent reports independently document recursive multi-agent review/test loops and self-reinforcing governance/verification machinery.

## Affected users
Developers using autonomous coding agents, long-running agent sessions, multi-agent workflows, release/deployment agents, and engineering teams paying for token/time-heavy verification loops.

## Current public evidence
### Observed evidence
1. `openai/codex#39512` reports >5 hours elapsed on a task with a sub-one-hour comparison baseline, zero original bugs fixed, repeated reopening of explicit user decisions, non-convergent validation, misleading progress claims, and excessive token/context consumption.
2. `openai/codex#38989` reports MultiAgentV2 expanding one workflow into 74 subagents, depth-3 recursion, 5.39B recorded tokens, 53 review/audit/preflight agents, at least 18 full test-suite runs, and repeated identical test commands; disabling further delegation stopped new spawns.
3. `openai/codex#39059` reports bounded codebase tasks expanding into self-reinforcing verification/governance layers where agent-created artifacts become justification for more tests, migrations, gates, and review obligations.
4. `openai/codex#39190` reports simple tasks taking roughly 15 minutes without visibility into queueing, retries, context loading, tool latency, or stuck execution, reinforcing the need for phase/evidence observability before diagnosing performance.

### Interpretation
The common engineering weakness is not simply “reason less.” Agent loops often lack a machine-observable convergence contract: every action should resolve a named uncertainty, change the decision state, produce required evidence, or advance a terminal phase. Without that accounting, repeated probes and nested reviews can continue because activity is mistaken for progress.

## Existing approaches
- User prompts with stop conditions and checklists.
- Plan/execute/review loops.
- Max iteration or token limits.
- Human interruption and disabling delegation.
- Completion gates that require tests/evidence before claiming success.

## Remaining limitations
- Fixed iteration limits do not distinguish productive work from low-value repetition.
- A completion gate acts at the end but may not prevent hours of low-gain work beforehand.
- Agents can generate new uncertainties faster than they close existing ones.
- Progress/status text may not be tied to actual execution state.
- Multi-agent reviews can recursively amplify the same unresolved question.

## Root-cause analysis
1. No explicit terminal-state machine preserved across turns/compaction.
2. Tool/review actions are not required to name the uncertainty or acceptance criterion they resolve.
3. No evidence-gain score or duplicate-action detection.
4. Settled decisions are not tracked as immutable unless contradictory evidence appears.
5. Delegation/review loops lack a global convergence budget and escalation path.
6. Status language is not mechanically constrained by observed tool state.

## Improvement opportunity
Introduce a reusable convergence controller that tracks terminal objective, facts, settled decisions, open hypotheses, required evidence, and phase state; scores each action for expected/actual evidence gain; detects duplicate/no-gain loops; limits review/delegation retries globally; requires strategy change after low-gain streaks; and allows completion/status claims only when machine-readable evidence supports them.

## Relevant sources
- https://github.com/openai/codex/issues/39512
- https://github.com/openai/codex/issues/38989
- https://github.com/openai/codex/issues/39059
- https://github.com/openai/codex/issues/39190
