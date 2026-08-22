# Research Evidence

## Topic
Auto-review Failure Amplification Guard

## Category
Token

## Problem
A persistent sandbox/runtime failure can convert routine workspace-local actions into repeated escalated approval reviews. Each retry may become a separate model turn, repeatedly reprocessing growing context and consuming quota even though the reviewer keeps allowing the same class of operation.

## Why it matters now
Two fresh August 2026 Codex reports independently measured the same amplification pattern on Windows and Linux. This is not ordinary approval overhead: the repeated reviews were overwhelmingly caused by internal sandbox/helper failures and were overwhelmingly approved.

## Affected users
Developers using coding agents with automatic approval/review, platform teams operating sandboxed agents, users on quota-limited plans, and maintainers of approval/sandbox orchestration.

## Current public evidence
### Observed evidence
- OpenAI Codex issue #39408 (2026-08-19) reports 201 Auto-review turns in one day; 113/198 recovered reviews were repeated `apply_patch` sandbox-failure retries and 197/198 decisions were `allow`. On another day, 299 Auto-review turns were recorded; the reporter attributes 236 review calls across two days directly to one recurring Windows sandbox/helper failure.
- OpenAI Codex issue #39626 (2026-08-20) reports the Linux equivalent: 601 Auto-review turns over nine days, 599 `allow`, approximately 66.8M aggregate reviewer input tokens, with routine workspace actions repeatedly failing bwrap/user-namespace initialization and being retried escalated.
- Both reports describe growing reviewer context and lack of a circuit breaker for repeated *allowed* escalations caused by the same persistent runtime failure.

### Interpretation
The approval system treats each escalation as an independent decision while ignoring failure-class recurrence and the fact that the operation was intended to stay inside the configured boundary. A denial-based breaker does not help when almost every review returns `allow`.

## Existing approaches
- Sandbox boundaries and automatic review preserve security by reviewing out-of-bound execution.
- Existing failure handling retries an operation via an escalated path when sandboxed execution fails.
- Some systems track consecutive denials or prompt users for approval.

## Remaining limitations
- Equivalent allowed reviews are not deduplicated by failure fingerprint.
- Persistent sandbox-health failure is not converted into a session-level blocking condition soon enough.
- Reviewer context can grow across repeated equivalent approvals.
- Users may not receive an early warning before substantial quota is consumed.
- Simply bypassing review would weaken security and is not acceptable.

## Root-cause analysis
1. Sandbox initialization/tooling failures are classified similarly to genuine permission-boundary failures.
2. Escalation identity is request-centric rather than root-cause-centric.
3. Allowed decisions reset or evade denial-oriented circuit breakers.
4. Repeated reviewer calls may include growing conversation context rather than a bounded approval envelope.
5. No deterministic per-session budget stops abnormal review amplification.

## Improvement opportunity
Add a reusable pre-review gate that fingerprints `(failure class, operation class, target scope, requested permission)`; keeps bounded counters and token estimates; blocks automatic re-review after a configurable threshold; requires sandbox-health revalidation before retry; preserves normal review for genuinely new boundary crossings; and emits measurable evidence.

## Relevant sources
- https://github.com/openai/codex/issues/39408
- https://github.com/openai/codex/issues/39626
- https://learn.chatgpt.com/docs/sandboxing/auto-review
- https://learn.chatgpt.com/docs/sandboxing?surface=app&sandbox-os=ubuntu-debian#how-you-control-it

## Goal and metrics
Goal: prevent internal sandbox failures from amplifying into unbounded model-review calls without bypassing genuine approval boundaries.
Metrics: auto-review calls/task, repeated-review ratio, reviewer input tokens/task, unique failure fingerprints, breaker activations, false-positive blocks, legitimate boundary reviews preserved, task completion/quality regression.

## Trigger / inputs / outputs
Trigger: an operation fails inside the expected sandbox and orchestration proposes an escalated retry.
Inputs: operation metadata, target scope, failure text/code, requested permission, prior decisions, token/usage counters.
Outputs: `allow_review`, `block_repeat`, or `require_human`; normalized failure fingerprint; counters; evidence record.