# Research — Hidden Subagent Token Attribution Gate

## Category
Token

## Problem
Agent platforms increasingly delegate approvals, memory processing, reviews, and background work to hidden or semi-hidden subagents. These child runs can consume substantial tokens and quota without a clear per-feature or per-agent accounting trail. When usage telemetry exposes only aggregate token totals, teams cannot reliably identify which subagent caused cost spikes, distinguish input/output/cache usage, or enforce budgets before quota is exhausted.

## Why it matters now
On 2026-08-03, OpenAI Codex issue #36736 reported a guardian approval reviewer that spawned a subagent for each command approval. The reporter measured roughly 14.5k input tokens per decision and about 7.0M total tokens across 78 guardian sessions over two days, with no UI indication of the feature's quota consumption. The same report also described background memory jobs retrying oversized transcripts while idle.

On 2026-08-11, Anthropic Claude Code issue #85890 reported that background Agent/Workflow completion notifications expose a combined `subagent_tokens` value but not input/output/cache splits. The reporter noted that the missing split prevents accurate cost computation because token classes are priced differently.

These are separate products and failure modes, but they share a common engineering gap: subagent token consumption is not always attributable at the granularity needed for cost control, incident diagnosis, and regression prevention.

## Current public signals

### Signal 1 — Codex hidden/background quota consumption
Source: https://github.com/openai/codex/issues/36736

Observed evidence:
- `approvals_reviewer = "guardian_subagent"` caused a child session per approval.
- Example decision: 14,482 input tokens, 4,352 cached input tokens, 81 output tokens.
- Reporter observed 78 guardian sessions and approximately 7.0M total tokens in two days.
- Background `memory_stage1` jobs retried context-window failures while idle.
- Reporter explicitly requested per-feature usage breakdown and caps.

The issue was closed quickly, but the report remains useful evidence of the architecture-level risk: hidden child work can materially affect quota and can be hard to attribute from the user-facing surface.

### Signal 2 — Claude Code insufficient subagent usage granularity
Source: https://github.com/anthropics/claude-code/issues/85890

Observed evidence:
- Background Agent/Workflow task notifications expose `subagent_tokens`, tool uses, and duration.
- They do not expose input, output, cache creation, and cache read token classes separately in that block.
- The issue remains open as of 2026-08-21.
- The reporter requests the same granularity available from underlying request telemetry so cost tooling can calculate real cost rather than a broad estimate.

### Supporting signal — extreme multi-agent amplification
Source: https://github.com/openai/codex/issues/33196

A July 2026 report described two parallel review subagents reaching hundreds of millions of cumulative token-count events with repeated compaction during a bounded review task. This is not evidence that every platform behaves this way, but it reinforces that subagent fan-out requires explicit budgets and observability rather than assuming child work is cheap.

## Existing approaches

### Session-level token totals
Platforms expose a total token count or quota percentage.

Strength: simple and useful for broad capacity monitoring.

Limitation: it cannot identify which feature, subagent role, parent task, retry loop, or background job caused a spike.

### Combined child-agent token totals
A child notification may report one total token number.

Strength: better than no accounting.

Limitation: input, output, cache-read, and cache-write classes cannot be separated. Accurate cost and regression diagnosis remain difficult.

### Manual log inspection
Developers inspect rollout JSONL, traces, session databases, or transcript files.

Strength: can reveal detailed events when the data exists.

Limitations: manual, product-specific, hard to compare across runs, and too late to prevent runaway consumption.

### Prompt instructions such as "keep subagents small"
Strength: easy to add.

Limitation: advisory language is not an enforceable budget. Hidden platform-created agents may not follow user prompts at all.

## Observed limitations
1. Attribution often stops at the parent session or aggregate child token count.
2. Hidden/platform-created child agents may not be visible before they consume quota.
3. Cost classes may be collapsed, preventing accurate cost calculation.
4. A child can repeatedly retry or compact without a deterministic per-role stop condition.
5. Teams lack regression gates that compare subagent cost per useful outcome over time.
6. Budget controls are often reactive after quota has already been consumed.

## Root-cause hypotheses
- Usage accounting is designed around requests or sessions rather than a parent-child execution graph.
- Child-agent metadata is emitted inconsistently across products and execution modes.
- Cached tokens are treated as an implementation detail instead of a first-class cost/latency metric.
- Budget enforcement is delegated to prompts instead of the orchestration layer.
- Background work lacks a task-owned quota envelope.

## Proposed engineering solution
Build a provider-neutral attribution layer that converts available JSON/JSONL usage events into a normalized execution ledger keyed by parent task, agent/subagent ID, role/feature, and token class. Apply deterministic budget gates before fan-out and after each usage checkpoint.

The package provides:
- a normalized event schema implemented by `scripts/analyze_usage.py`;
- per-agent and per-role aggregation;
- support for exact input/output/cache classes when available and an explicit `unknown_tokens` bucket when only combined totals exist;
- budget policies for child count, total tokens, unknown-token ratio, and per-role ceilings;
- exit codes suitable for CI/hooks;
- bounded workflows for baseline, diagnose, budget, verify, and regressions.

## Improvement target
A successful integration should achieve:
- 100% of observed token events assigned to a parent task and agent ID or explicitly classified as unattributed;
- no silent conversion of combined totals into guessed input/output splits;
- `unknown_tokens / total_tokens` below the configured threshold for production cost claims;
- every child role covered by a configured budget or an explicit default budget;
- budget violations detected before the next child spawn when the orchestrator exposes a pre-spawn hook;
- regression comparisons on tokens per completed outcome, not just total session tokens.

## Success metrics
- attributable token ratio = attributed tokens / total observed tokens;
- unknown-token ratio = unknown token class / total observed tokens;
- child token share = child tokens / parent-tree tokens;
- tokens per completed child outcome;
- cache-read ratio and cache-write ratio when available;
- number of child agents per parent;
- budget breach count;
- prevented child spawns after budget exhaustion;
- task completion/quality regression rate after budget introduction.

## Safety and correctness
Token optimization must not silently discard required context or bypass security reviewers simply to save quota. When a mandatory security/approval child reaches budget, the safe behavior is stop/escalate or switch to an approved bounded alternative—not auto-approve, skip verification, or weaken permissions.

## Sources
1. OpenAI Codex issue #36736, created 2026-08-03: https://github.com/openai/codex/issues/36736
2. Anthropic Claude Code issue #85890, created 2026-08-11, open as of 2026-08-21: https://github.com/anthropics/claude-code/issues/85890
3. OpenAI Codex issue #33196, created 2026-07-15: https://github.com/openai/codex/issues/33196
