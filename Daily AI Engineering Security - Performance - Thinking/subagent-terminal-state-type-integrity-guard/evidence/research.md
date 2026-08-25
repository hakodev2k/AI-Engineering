# Research

## Topic
Subagent terminal-state type integrity

## Category
Thinking

## Problem
Agent orchestrators can collapse distinct child lifecycle outcomes into `success`/`completed`, hiding incomplete work from the parent. The failure is not merely weak wording: machine-readable terminal reason, missing tool results, missing deliverables, active descendants, or resource-limit termination can contradict the success label.

## Why it matters now
Multi-agent coding workflows increasingly run long, expensive background investigations and trust lifecycle notifications to decide whether to merge findings, retry, or finish. False completion creates silent correctness failures and costly rework.

## Affected users
Coding-agent users, multi-agent platform builders, CI/review automation, engineering teams using background agents, and systems that automatically act on child results.

## Current public evidence

### Observed evidence
1. **2026-08-14 — Claude Code #86696.** A reproducible subagent failure ended with `stop_reason` and `terminal_reason`=`tool_deferred`, empty result and an unexecuted Bash tool, while `subtype` remained `success`, `is_error=false`, and the task notification said completed. The reporter measured 26/26 unanswered Bash calls on the failure day. https://github.com/anthropics/claude-code/issues/86696
2. **2026-08-13 — Claude Code #86471.** Background subagents repeatedly reported `status: completed` despite empty output, mid-reasoning fragments, or only a file header; failures appeared around 100–150k subagent tokens and forced expensive re-runs. https://github.com/anthropics/claude-code/issues/86471
3. **2026-07-31 — Claude Code #82829.** A usage-limit-terminated foreground subagent was recorded as `status: completed` and rendered as Done, despite termination by a usage limit. https://github.com/anthropics/claude-code/issues/82829
4. **2026-08-04 — Claude Code #83848.** Fresh background subagents could stall without final text while the harness still emitted `status: completed`; raw transcripts sometimes ended at an unmatched `tool_use` or before final assistant output. https://github.com/anthropics/claude-code/issues/83848
5. **2026-03-13 — Gemini CLI #22323.** `codebase_investigator` reported `status: success` and termination reason `GOAL` even though its embedded result said MAX_TURNS interrupted the investigation before analysis and returned no relevant locations. https://github.com/google-gemini/gemini-cli/issues/22323

### Interpretation
These reports have different suspected causes—deferred tools, context/size pressure, usage limits, event loss, and max-turn recovery—but converge on an observable contract defect: a coarse success classification can contradict terminal evidence. The package does not assume one vendor bug or hidden root cause.

## Existing approaches
- Parent trusts `success`/`completed` notification.
- Retry explicit error states.
- Prompt subagents to return a complete final message or write incrementally.
- Inspect filesystem/output after completion.
- Runtime-specific status enums and termination reasons.
- Smaller subagent scopes to reduce context exhaustion risk.

## Remaining limitations
- Prompt instructions cannot correct host-side status classification.
- A single boolean/status loses the distinction between completed, deferred, limited, cancelled, stalled and incomplete.
- Parent-side heuristics such as output length are fragile and vendor-specific.
- `completed` can arrive while required tool results or live descendants remain.
- Retrying after false completion can repeat expensive reads/model calls and may duplicate side effects.

## Root-cause analysis
1. Orchestrators conflate process/turn termination with successful task completion.
2. Terminal reason and high-level status are produced by different layers without a consistency invariant.
3. Deliverable evidence is optional or not bound to the success transition.
4. Unresolved tool calls and live descendants are not always part of completion classification.
5. Limit/deferred recovery paths map to generic success instead of typed incomplete states.
6. Parent agents receive summarized lifecycle metadata and may not inspect raw evidence.

## Improvement opportunity
Create a vendor-neutral terminal-state predicate evaluated before parent-visible success: exact completed terminal state, no adverse terminal reason, deliverable present, zero unresolved tool calls, zero live descendants, and dispatch identity freshness. Preserve contradictory evidence and downgrade unsupported success to incomplete rather than retrying blindly.

## Proposed solution
This package defines a normalized schema, deterministic validator, enforceable success-classification rule, pre-parent-completion hook, evidence-driven audit procedure, bounded recovery workflow, and independent verifier.

## Metrics
Unsupported success rate, missing deliverable rate, unresolved-tool-at-success rate, live-descendant-at-success rate, unnecessary re-dispatches, and verification coverage.

## Trigger
On every child terminal notification, before a parent marks delegated work complete, after runtime upgrades, and during incidents involving missing/partial subagent output.

## Inputs
Normalized child terminal events with task/dispatch identity, declared status, terminal state/reason, deliverable evidence, unresolved tool count, and live descendant count.

## Outputs
Verified/inconsistent verdict, violation codes, affected child IDs, and safe parent classification.

## Relevant sources
- https://github.com/anthropics/claude-code/issues/86696
- https://github.com/anthropics/claude-code/issues/86471
- https://github.com/anthropics/claude-code/issues/82829
- https://github.com/anthropics/claude-code/issues/83848
- https://github.com/google-gemini/gemini-cli/issues/22323
- Gemini CLI subagent documentation (turn/time limits): https://github.com/google-gemini/gemini-cli/blob/main/docs/core/subagents.md
