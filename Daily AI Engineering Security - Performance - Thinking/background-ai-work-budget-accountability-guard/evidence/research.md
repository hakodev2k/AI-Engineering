# Research — Background AI Work Budget Accountability Guard

## Topic
Budgeting and attribution for invisible/background AI work

## Category
Token

## Problem
Agent runtimes increasingly launch background memory, review, sync, summarization, and auxiliary-agent work that can continue without active user input. Recent reports show these workers can repeatedly consume model requests or quota while the visible parent session is idle, and some implementations do not expose that usage in normal telemetry. This makes token/cost control and incident detection unreliable.

## Why it matters now
The problem is observable across multiple current agent systems, not just one product. Background work is becoming a first-class runtime feature while accounting, progress semantics, and kill conditions remain inconsistent.

## Affected users
Developers using long-running coding agents; platform teams operating multi-agent runtimes; teams with subscription/API budgets; observability and FinOps engineers; users relying on background memory/review features.

## Current public evidence
### Observed evidence
1. OpenAI Codex issue #40110 (2026-08-22 incident, filed 2026-08-22/23) reports a background memory worker resubmitting the same completed turn 1,911 times over 5h13m while the parent was idle, consuming about 242.9M reported input tokens. The reporter's logs showed no pending input and no model-requested follow-up. https://github.com/openai/codex/issues/40110
2. NousResearch/hermes-agent issue #87250 (2026-08-15) reports background-review forks whose token use is absent from queryable telemetry; each fork may loop up to 16 iterations. https://github.com/NousResearch/hermes-agent/issues/87250
3. NousResearch/hermes-agent issue #82406 (2026-08-09) reports 574 background-review runs touching 98 skill files while only four were later loaded, indicating substantial auxiliary work with little observed downstream utility. https://github.com/NousResearch/hermes-agent/issues/82406
4. Anthropic Claude Code issue #85328 (2026-08-09) reports account usage increasing while Desktop was idle, attributed by the reporter to background connector synchronization/reprocessing. https://github.com/anthropics/claude-code/issues/85328
5. Anthropic Claude Code issue #83857 (2026-08-04) reports server-side usage increasing during a measured idle window with zero controlled client activity. https://github.com/anthropics/claude-code/issues/83857

### Interpretation
These reports do not prove one shared implementation defect. They do support a shared engineering gap: background AI work can be weakly attributable, insufficiently budgeted, and insufficiently coupled to observable progress or user activity.

## Existing approaches
Provider usage counters, request logs, parent-session token totals, per-agent tracing, background-job lifecycle state, manual process termination, and product-specific memory/review settings.

## Remaining limitations
- Parent totals may omit or obscure auxiliary workers.
- Successful HTTP/model responses do not prove useful progress.
- Background jobs may keep re-entering the model with unchanged state.
- Runtime usage meters often lack a stable parent/child/job attribution key.
- Limits are frequently account-level rather than job-level.
- Manual cancellation reacts after spend has already occurred.

## Root-cause analysis
1. Background work is scheduled independently from foreground intent but often shares the same quota pool.
2. Job identity is not consistently propagated into request telemetry.
3. Progress is inferred from activity rather than durable output/state change.
4. Retry/follow-up loops lack no-input/no-progress invariants.
5. Budgets are applied globally or after-the-fact instead of at dispatch time.
6. Cached-input-heavy requests can look cheap computationally while still consuming quota/accounting capacity.

## Improvement opportunity
Introduce a reusable control plane that requires every auxiliary model request to carry a job identity and parent identity; meters requests/tokens/cached tokens; detects repeated state fingerprints; enforces per-job request/token/wall-time budgets; and blocks further model re-entry when there is neither new input nor measurable progress.

## Proposed solution
A dependency-free JSONL analyzer plus rules, workflow, hook contract, and independent verifier. The package is runtime-agnostic: hosts emit normalized events and use the checker before dispatching another background model turn.

## Goal
Make background AI spend attributable, bounded, and progress-coupled without disabling useful memory/review work.

## Metrics
- background input/output/cached tokens per job and parent task
- background requests per completed useful artifact
- idle model requests per hour
- repeated-state request count
- unattributed request percentage
- budget-block count
- useful-output ratio
- foreground quality/regression rate after controls

## Trigger
Before and after every background model request; periodically for long-running auxiliary jobs; at parent-session completion.

## Inputs
Normalized JSONL events containing timestamp, job_id, parent_id, event, input_tokens, output_tokens, cached_input_tokens, state_fingerprint, progress_fingerprint, and optional status.

## Outputs
Per-job accounting summary, violations, exit status, and evidence for investigation.

## Relevant sources
- https://github.com/openai/codex/issues/40110
- https://github.com/NousResearch/hermes-agent/issues/87250
- https://github.com/NousResearch/hermes-agent/issues/82406
- https://github.com/anthropics/claude-code/issues/85328
- https://github.com/anthropics/claude-code/issues/83857
