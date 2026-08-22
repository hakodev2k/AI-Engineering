# Hooks

## Hook 1 — Pre-gated-action registration
**Trigger:** immediately before a tool/transition enters approval-required state.

**Action:** allocate stable `request_id`, record agent/parent IDs and approval route, emit `requested`.

**Command/script:** host adapter emits JSONL; optionally validate accumulated stream with `python scripts/approval_watchdog.py events.jsonl --policy config/policy.json`.

**Expected result:** request exists before the runtime starts waiting.

**Failure behavior:** do not execute or wait on the gated action; return instrumentation error.

## Hook 2 — Approval-surface delivery
**Trigger:** decision-capable UI/client actually receives the request.

**Action:** emit `surfaced` with same request ID. A mere notification that cannot decide does not count as surfaced.

**Expected result:** surface latency becomes measurable.

**Failure behavior:** retry delivery at most `max_surface_retries`; if still unsurfaced, fail closed and escalate.

## Hook 3 — Decision transition
**Trigger:** approve, deny, timeout, cancellation, or session termination.

**Action:** emit exactly one terminal state; reject unknown/terminal request IDs.

**Expected result:** every request becomes terminal.

**Failure behavior:** freeze affected gated workflow and classify as correlation defect.

## Hook 4 — Progress checkpoint
**Trigger:** periodic controller checkpoint, subagent heartbeat, or before task completion.

**Action:** run watchdog against active event stream using a timezone-aware `--now`; inspect blocking violations.

**Expected result:** no `SURFACE_TIMEOUT`, `DECISION_TIMEOUT`, `MISSING_PARENT_ROUTE`, `ORPHAN_EVENT`, or post-terminal event.

**Failure behavior:** stop dispatch of new gated work, resolve/cancel existing ambiguous requests, then retry the checkpoint once.

## Hook 5 — Final verification
**Trigger:** task claims completion or agent/session shuts down.

**Action:** validate that all approval requests are terminal and no safety rule was bypassed.

**Expected result:** watchdog returns exit code 0.

**Failure behavior:** completion is not verified; persist only redacted diagnostic evidence and escalate unresolved request IDs.
