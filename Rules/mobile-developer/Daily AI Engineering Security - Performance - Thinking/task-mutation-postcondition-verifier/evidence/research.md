# Research — Task Mutation Postcondition Verifier

## Topic
Task/session control-plane mutations can fail after an application update while the source record remains readable, so clients need explicit postcondition verification instead of trusting an RPC return path or UI action alone.

## Category
Thinking

## Problem
Archive/delete/rename/move operations are state transitions, not merely commands. When storage layout, app-server versions, or path conventions change, a mutation can fail even though the underlying session is intact. If an agent or automation treats invocation as completion, it may report success, retry blindly, or proceed to dependent destructive steps against the wrong state.

## Why it matters now
On 2026-08-18/19 multiple independent Windows Codex reports described `thread/archive` failures after an update. Sessions remained readable and source rollout files existed, but archive returned `-32603` / `os error 2` and the tasks stayed active. One report compared older and newer app-server builds and observed successful archives before the update and repeated failures after it.

## Affected users
AI-agent users managing persistent tasks, desktop/CLI automation authors, app-server clients, developers building task lifecycle tooling, and any system where archive/delete is chained into later cleanup.

## Current public evidence
### Observed evidence
1. `openai/codex#39492` (2026-08-19) reports 100% archive failure for tested local tasks after update; source files exist, SQLite quick-check passes, archive destination exists, yet `thread/archive` returns internal `os error 2`. Source: https://github.com/openai/codex/issues/39492
2. `openai/codex#39270` (2026-08-18) independently reports the same archive error after update, with local sessions stored in dated subfolders while the archive uses a flat directory. Source: https://github.com/openai/codex/issues/39270
3. #39492 includes before/after build evidence: an older app-server build logged successful archive operations while newer builds produced repeated failures.

### Interpretation
The broader engineering gap is insufficient mutation verification. A control-plane client needs to distinguish `requested`, `acknowledged`, `committed`, `verified`, `failed`, and `indeterminate`. RPC errors and UI messages are evidence, but the authoritative postcondition is the observable resulting state.

### Proposed solution
A reusable mutation verifier that captures a pre-state snapshot, executes the mutation externally, then compares post-state evidence against declarative postconditions. It classifies results as `verified-success`, `verified-failure`, or `indeterminate`; retries only when evidence changed or the failure is transient; and blocks dependent destructive actions until verification succeeds.

## Existing approaches
- Trust RPC status/error.
- Trust UI disappearance.
- Retry the same mutation.
- Manually inspect files/database after failure.

## Remaining limitations
- Authoritative state can span DB, filesystem and UI indexes.
- Eventual consistency can require a bounded observation window.
- A generic verifier cannot know product-specific invariants without a declared postcondition.
- Verification must avoid mutating or repairing state unless explicitly approved.

## Root causes
1. Command success is conflated with state-transition success.
2. Storage/path migrations can break one phase of a mutation.
3. Clients often lack before/after snapshots.
4. Dependent operations may run before durable state is observed.
5. Blind retries repeat deterministic failures without new evidence.

## Goal
Make task/session mutations evidence-based and safe to compose.

## Metrics
Verified mutation rate, indeterminate rate, repeated identical failures, dependent actions blocked by missing postcondition, verification latency, false-success count, recovery time.

## Trigger
After any archive/delete/move/rename/close mutation and before any dependent cleanup or irreversible action.

## Inputs
Mutation ID/type, pre-state snapshot, expected postconditions, post-state observations, operation result/error, consistency deadline.

## Outputs
`verified-success`, `verified-failure`, or `indeterminate`, plus violated/satisfied postconditions and next safe action.

## Status
**Implemented:** snapshot schema, deterministic verifier, rules, workflow, hook, tests, verification agent.

**Measured:** after adoption collects mutation telemetry.

**Verified:** only after deterministic tests and integration scenarios demonstrate that no dependent destructive action proceeds from an unverified mutation.
