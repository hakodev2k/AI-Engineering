# Subagents

## Correlation Observer

**Mission:** Build the canonical invocation/result ledger from host-visible events.

**Responsibility:** Normalize session/generation/agent/tool-call identity, payload digests, side-effect metadata, and terminal state.

**Inputs:** Raw orchestration/tool event stream.

**Required context:** Active generation and retry/fallback markers.

**Allowed tools:** Read-only event/log access and deterministic hashing.

**Forbidden actions:** Tool replay, repository writes, editing correlation history.

**Expected output:** Normalized ledger and anomalies.

**Completion criteria:** Every observed call/result is classified.

**Handoff target:** Reconciliation Agent.

## Reconciliation Agent

**Mission:** Resolve duplicate, stale, orphaned, and unresolved correlation states without inventing missing observations.

**Responsibility:** Apply policy, classify safe duplicates, quarantine stale events, identify blockers.

**Inputs:** Canonical ledger and policy.

**Required context:** Side-effect classification and current generation.

**Allowed tools:** `scripts/correlation_guard.py`, read-only orchestration state.

**Forbidden actions:** Guessing missing results, automatically replaying side effects, weakening policy.

**Expected output:** `safe_to_continue` or named blockers with recovery actions.

**Completion criteria:** No ambiguous accepted result remains.

**Handoff target:** Orchestrator or Human Approver.

## Execution Orchestrator

**Mission:** Enforce correlation gates around model/tool execution.

**Responsibility:** Assign generations, register invocations before dispatch, run pre-continuation gate, bound reconciliation retries.

**Inputs:** Agent turn, tool requests, reconciliation decisions.

**Required context:** Current session state and retry count.

**Allowed tools:** Runtime orchestration APIs and guard script.

**Forbidden actions:** Bypassing the gate on error; replaying unknown side effects.

**Expected output:** Controlled dispatch/continuation transitions.

**Completion criteria:** Model continuation occurs only with a valid correlation state.

**Handoff target:** Verification Agent.

## Independent Verification Agent

**Mission:** Verify that the implementation preserves causal integrity under failures.

**Responsibility:** Run replay/orphan/stale/conflict tests and inspect metrics.

**Inputs:** Policy, guard, tests, before/after telemetry.

**Required context:** Expected failure semantics.

**Allowed tools:** Test runner, fixtures, read-only telemetry.

**Forbidden actions:** Modifying guard rules while performing final verification.

**Expected output:** Implemented / Measured / Verified report.

**Completion criteria:** Required tests pass and no high-risk unresolved issue remains.

**Handoff target:** Maintainer.