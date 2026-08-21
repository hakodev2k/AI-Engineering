# Hooks

## `pre_tool_call`

**Trigger:** Before every tool invocation.

**Action:** Run canonicalization and guard decision using current policy/history.

**Command/script:** `python scripts/tool_loop_guard.py decide --policy config/policy.json --state runtime/guard-state.json --call candidate.json`

**Expected result:** JSON decision: `allow`, `warn`, `require-strategy-change`, `block`, or `verify-before-retry`.

**Failure behavior:** For side-effecting/unknown tools, fail closed. For explicitly read-only tools, policy may allow-with-warning while emitting `guard_error`.

---

## `post_tool_call`

**Trigger:** After a tool returns or fails.

**Action:** Record normalized call fingerprint, status, output SHA-256 digest, elapsed time, error signature, and phase.

**Command/script:** `python scripts/tool_loop_guard.py record --policy config/policy.json --state runtime/guard-state.json --call candidate.json --result result.json`

**Expected result:** Updated state written atomically.

**Failure behavior:** Do not erase previous state. Emit error; side-effecting ambiguous outcomes must be marked for verification.

---

## `on_warning_threshold`

**Trigger:** Guard returns `warn`.

**Action:** Inject a structured runtime notice containing repeat counts, prior output novelty, missing evidence targets, and remaining budget. Do not add generic “try harder” text.

**Expected result:** Agent either synthesizes existing evidence or chooses a materially different call.

**Failure behavior:** Repeated family proceeds to the stricter threshold on the next attempt.

---

## `on_strategy_change_required`

**Trigger:** Guard returns `require-strategy-change`.

**Action:** Build recovery packet and prevent execution of the current candidate. Require a strategy marker and a different strategy fingerprint before another call in that family.

**Expected result:** New tool/source/scope/phase or synthesis without a tool call.

**Failure behavior:** Same-family retry advances to `block`.

---

## `on_hard_block`

**Trigger:** Guard returns `block` or phase/global budget is exhausted.

**Action:** Preserve recovery packet and stop the current loop family. Do not reset global budget.

**Expected result:** Explicit stop/escalation with collected evidence retained.

**Failure behavior:** If recovery-packet creation fails, preserve raw guard state and stop.

---

## `on_ambiguous_side_effect_failure`

**Trigger:** Timeout/connection failure after a side-effecting tool may have been dispatched.

**Action:** Mark call `ambiguous`, block automatic replay, require postcondition verification or human approval.

**Expected result:** `verify-before-retry` state.

**Failure behavior:** Stop rather than risk duplicate action.

---

## `post_task_verification`

**Trigger:** Task completion or benchmark completion.

**Action:** Run trace analysis and calculate calls avoided, repeated-call ratio, task duration, block count, false-positive overrides, and completion outcome.

**Command/script:** `python scripts/analyze_trace.py trace.jsonl --policy config/policy.json`

**Expected result:** Deterministic metrics report.

**Failure behavior:** Mark performance verification incomplete; do not claim improvement.