# Research — Agent Subagent Service-Tier Inheritance Guard

## Problem

Multi-agent runtimes can create child agent threads whose effective service tier, model mode, or pricing multiplier differs from the parent thread's user-selected policy. When that transition is implicit, a user can believe a parent is running in a standard/default tier while descendants execute in a premium/priority/Fast tier. The resulting token cost can be difficult to attribute because child threads have separate rollout histories and may not expose tier metadata consistently.

## Category

**Token**

## Why it matters now

The risk is especially material in long-running multi-agent workflows because descendants can account for a large share of model activity, cached-input replay, and quota consumption. A small policy drift at spawn time can multiply across many children before a user notices.

## Current public signals

### Signal 1 — Codex issue #39894: parent remained default while 11 child threads recorded priority

OpenAI Codex issue #39894, filed on 2026-08-21, reports a parent thread that recorded `service_tier: "default"` after Fast mode was disabled, while at least 11 subsequently created subagent threads recorded `service_tier: "priority"`. The reporter states no later `/fast` command was issued by the user and estimates a substantial premium if those child requests were billed with the documented Fast multiplier. The report explicitly asks for a setting that guarantees children cannot use Fast when the parent is Standard.

Source: https://github.com/openai/codex/issues/39894

### Signal 2 — Codex issue #38989: subagents can dominate token consumption

Codex issue #38989 documents a long-running MultiAgentV2 task with 74 subagents and 5.389B recorded tokens, of which about 4.978B came from subagents. The issue also reports history-carrying forks, repeated review loops, recursive descendants, and high reasoning effort across many children. This does not prove service-tier drift, but it demonstrates why an unnoticed per-child pricing-policy escalation can be operationally large.

Source: https://github.com/openai/codex/issues/38989

### Signal 3 — Codex issue #35816: users lack per-subagent quota attribution and ceilings

Codex issue #35816 reports a large weekly usage decrease during repeated reviewer-subagent workflows and requests per-thread/per-subagent attribution, token or credit ceilings, and warnings before one workflow consumes a material share of weekly capacity. This reinforces the observability gap around descendant usage.

Source: https://github.com/openai/codex/issues/35816

### Signal 4 — Official Fast-mode documentation defines a higher credit multiplier

OpenAI's ChatGPT Learn documentation for Codex speed/Fast mode describes Fast mode as consuming credits at a higher multiplier than Standard. The exact product rate is provider/model specific and can change, so the package treats multipliers as configuration rather than hard-coding a permanent rate.

Sources:
- https://learn.chatgpt.com/docs/agent-configuration/speed
- https://learn.chatgpt.com/docs/pricing

## Observed evidence, interpretation, proposed solution

### Observed evidence

- A recent issue reports child `priority` tier markers after the parent recorded `default` and the user had disabled Fast mode.
- Multi-agent workflows can generate most of a task's token volume in descendants.
- Existing telemetry can be fragmented across parent and child rollout files, with incomplete tier markers.
- Users have requested per-subagent usage attribution and explicit usage ceilings.

### Interpretation

A multi-agent runtime needs a deterministic **execution-policy inheritance contract**. Service tier should be inherited or explicitly overridden at the spawn boundary, and the effective child tier should be attested in observable telemetry. Missing tier metadata must not silently be interpreted as safe when policy enforcement depends on it.

### Proposed engineering solution

This package adds a host-side policy and audit layer:

1. Capture the parent's expected tier at a trusted checkpoint.
2. Record every child spawn edge and any explicit child-tier override.
3. Parse child telemetry for effective tier and token usage.
4. Compare parent policy, declared override, and observed child tier.
5. Fail closed or require explicit approval when a child is more expensive than allowed.
6. Produce lineage-level token and estimated-cost attribution without double-counting cumulative token counters.
7. Re-check the invariant when a child resumes, is forked, or changes tier mid-session.

## Existing approaches

### Parent-level mode toggles

Users can select Standard/Fast or related execution settings on the current thread.

**Limitation:** a parent UI state does not prove descendant runtime state. Issue #39894 reports a parent/child divergence visible in local telemetry.

### Global configuration

A config value such as `service_tier = "default"` can express intended defaults.

**Limitation:** defaults are not equivalent to attested effective runtime state after child creation. A child path may select another tier internally or inherit stale state.

### Usage dashboards

Account dashboards show aggregate usage and sometimes surface/client attribution.

**Limitation:** aggregate quota changes are too coarse to prove which descendant, tier, or spawn decision caused the consumption. The cited reports explicitly request finer attribution.

### Local rollout logs

Local JSONL telemetry can contain service-tier and token counters.

**Strength:** useful for post-hoc reconstruction.

**Limitation:** records are distributed across threads, tier markers may be absent on some requests, and cumulative counters or copied fork history can be double-counted if naively summed.

## Root-cause hypotheses

1. Child creation resolves service tier independently from the parent's current effective state.
2. Parent and child settings are serialized from different configuration snapshots.
3. Multi-agent spawn APIs do not expose or require an explicit cost-policy field.
4. Resumed/forked children can carry stale service-tier metadata.
5. Observability is insufficient to distinguish inherited tier, explicit override, runtime-selected tier, and actual billed tier.
6. Usage analysis naively sums cumulative or replayed token events across child histories.

## Improvement target

A successful integration should achieve all of the following:

- 100% of child spawns have an expected service-tier policy recorded before execution.
- 100% of child threads expose an observed effective tier before premium work is allowed, or are quarantined as `unknown`.
- Zero unapproved child tier escalations above the parent/policy ceiling in regression tests.
- Token attribution uses monotonic deltas per thread and does not count copied/replayed cumulative snapshots as fresh usage.
- Every approved escalation records who/what authorized it, its scope, and its expiry or completion boundary.
- Estimated credit reports clearly distinguish `observed tier`, `configured multiplier`, and `authoritative billing unknown`.

## Verification states

- **Implemented:** policy, parser, hooks, and workflow are integrated.
- **Measured:** lineage/tier/token telemetry has been collected from representative runs.
- **Verified:** deliberate child-tier drift fixtures are blocked or escalated exactly as policy requires, valid inherited-tier children pass, and token-delta accounting matches independent fixture totals.

## Evidence limitations

- Public issues are user reports, not authoritative server billing ledgers.
- `service_tier: "priority"` is treated as an observed client/runtime marker; the package does not claim it always maps to a specific billing multiplier unless the operator configures that mapping from current official documentation.
- Local token counters do not necessarily equal subscription quota units.
- The package prevents and detects policy drift; it cannot retroactively determine OpenAI's authoritative charged credits without provider billing data.

## Sources

1. OpenAI Codex issue #39894 — Unintended Fast-Mode Billing on Codex Subagents — https://github.com/openai/codex/issues/39894 — 2026-08-21.
2. OpenAI Codex issue #38989 — MultiAgentV2 runaway delegation — https://github.com/openai/codex/issues/38989 — August 2026.
3. OpenAI Codex issue #35816 — Unexpected 50% Weekly Usage Drop During Subagent Review/Wait Workflow — https://github.com/openai/codex/issues/35816 — 2026.
4. ChatGPT Learn — Speed / Fast mode — https://learn.chatgpt.com/docs/agent-configuration/speed
5. ChatGPT Learn — Codex pricing — https://learn.chatgpt.com/docs/pricing
