# Hooks

## Pre-Permission-Request
**Trigger:** host is about to surface a permission request.

**Action:** allocate/preserve `session_id`, `request_id`, provider `tool_use_id` when available, tool name, timestamp, and policy version. Append request metadata to the ledger.

**Command/script:** serialize normalized event; optionally run the guard against the current fixture/ledger in diagnostic mode.

**Expected result:** one unique live request key.

**Failure behavior:** fail closed; do not issue an untrackable human-intent contract.

## On-Decision
**Trigger:** approve/deny/stop/cancel arrives from UI, API, runtime, watchdog, background queue, or other source.

**Action:** preserve the true source; correlate to the exact request; reject cross-session/orphan/conflicting/stale human decisions.

**Expected result:** structured classification, never free-text-only intent.

**Failure behavior:** mark `ambiguous`; do not tell the agent the user made the decision.

## Pre-Agent-Handoff
**Trigger:** permission outcome is about to be inserted into model context.

**Action:** require `verified_human_*` before using “user approved/denied/stopped” semantics. For non-human or ambiguous outcomes, use source-specific or neutral wording.

**Expected result:** no unsupported human-intent conclusion enters reasoning context.

**Failure behavior:** block handoff and emit policy correction.

## Post-Tool-Result
**Trigger:** approved tool completes or fails.

**Action:** bind result to request/tool-call ID, close ledger state, record verification status and latency without sensitive payloads.

**Expected result:** request lifecycle has a single terminal outcome.

**Failure behavior:** keep lifecycle unresolved and alert; do not fabricate completion.

## Final Verification
**Trigger:** before releasing approval-runtime changes.

**Action:** run `python scripts/provenance_guard.py tests/good.jsonl --policy config/policy.json` expecting 0 and the bad fixture expecting exit 2.

**Expected result:** good provenance passes; phantom/cross-session attribution fails.

**Failure behavior:** release blocked.
