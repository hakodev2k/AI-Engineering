# Research

## Topic
Subagent context scope, freshness and budget enforcement

## Category
Token

## Problem
Multi-agent hosts can inject inherited memory/instructions into child agents without explicit scope while also freezing those sources too early. The result is both token waste and stale-context risk.

## Why it matters now
Subagent fan-out multiplies every unnecessary input token. As agent memory and large project instruction files grow, implicit inheritance becomes material to cost and latency, while long-lived parent sessions make stale snapshots more likely.

## Affected users
Multi-agent coding users, agent platform builders, teams with large project instruction/memory files, high-fan-out workflows, and cost-sensitive deployments.

## Current public evidence — Observed
1. Anthropic Claude Code issue #87613, opened 2026-08-18, reports raw request capture showing `MEMORY.md` delivered to subagents even though no agent declared a `memory:` field; for one small Haiku subagent it accounted for 7,133 of 20,993 first-turn tokens (34.0%). https://github.com/anthropics/claude-code/issues/87613
2. Claude Code issue #88886, opened 2026-08-22, reports that subagents receive CLAUDE.md/memory content snapshotted when the parent session starts rather than when the subagent is spawned, with no refresh mechanism, so later file changes are invisible to children. https://github.com/anthropics/claude-code/issues/88886
3. Claude Code issue #83355, opened 2026-08-02, reports mixed-model subagents using the main session's context-window assumptions for auto-compaction, demonstrating that parent-derived context accounting can be wrong for child model constraints. https://github.com/anthropics/claude-code/issues/83355
4. Claude Code issue #84738, opened 2026-08-07, reports advisor usage rollups inflating apparent child context and triggering compaction hundreds of thousands of tokens early, further showing that child context governance needs child-local accounting. https://github.com/anthropics/claude-code/issues/84738

## Interpretation
These signals are related manifestations of an implicit-parent-context design: scope, freshness, and accounting are derived from parent/session state instead of a dispatch-time child contract.

## Existing approaches
Static inheritance of project instructions; optional memory declarations; automatic compaction; global context-window accounting; prompt caching; manual child-prompt minimization.

## Remaining limitations
Documentation-level scope is not enforcement; cached snapshots can be stale; parent and child model windows can differ; token counts alone cannot determine whether a source is required; refreshing everything on every spawn increases latency and cache churn.

## Root-cause analysis
- No explicit dispatch-time manifest of child context sources.
- Optional versus required inheritance is ambiguous.
- Capture time/content provenance is missing from the child payload contract.
- Token budgets are not source-aware.
- Parent accounting leaks into child decisions.

## Improvement opportunity — Proposed solution
Build a child-local context manifest at dispatch. For each source record provenance, required/optional status, opt-in state, capture time/current metadata, and token count. Exclude undeclared optional memory, refresh changed required sources once, enforce the child's model budget, and retain all correctness/security-critical constraints.

## Metrics
Tokens/subagent; optional-context share; stale-source rate; refresh rate; context utilization; dispatch latency; task quality; missing-critical-context regression rate.

## Trigger / Inputs / Outputs
Trigger: immediately before child-agent dispatch and after a relevant source mutation. Inputs: source manifest, child model/window, token budget, current metadata. Outputs: allow/block decision, violations, token totals, refresh set, and final manifest.
