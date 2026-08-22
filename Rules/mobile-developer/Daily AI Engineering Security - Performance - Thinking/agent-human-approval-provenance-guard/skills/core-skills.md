# Core Skills

## Skill 1 — Capture a provenance baseline
**Purpose:** establish how the host currently represents permission and interrupt events.

**Trigger:** before changing approval, cancellation, background-agent, or streaming-input behavior.

**Inputs:** representative event logs, permission-hook payloads, host interaction logs, policy file.

**Preconditions:** sanitize secrets; use test accounts/sandboxes for destructive-capable tools.

**Required context:** session identity, request identity, tool-call identity if available, event source, timestamps.

**Tools:** host event export, `scripts/provenance_guard.py`, JSON inspection.

**Procedure:**
1. Capture at least one normal approve, one normal deny, one non-human cancellation, and one concurrent/background scenario.
2. Normalize events to the package schema.
3. Run the guard and record baseline violations.
4. Separate Facts, Assumptions, and Unknowns. Do not infer user intent from text alone.
5. Identify fields that are provider-authored versus reconstructed by the host.

**Decisions:** if exact request identity is unavailable, classify the path as `ambiguous`; do not invent a deterministic mapping.

**Constraints:** no production destructive action solely for testing.

**Expected output:** baseline report with event counts, verified-human coverage, orphan/cross-session/conflict violations, and unsupported attribution count.

**Metrics:** verified decision coverage; false attribution count; unresolved event count.

**Verification:** a second reviewer reproduces the guard result from the same fixture.

**Failure handling:** malformed logs fail closed; missing identity is reported rather than guessed.

**Stop conditions:** baseline is reproducible, or required identity is unavailable and documented as a blocker.

## Skill 2 — Reconcile a permission outcome
**Purpose:** determine whether a permission outcome represents verified human intent.

**Trigger:** any approve/deny/stop/cancel before the model receives a human-intent statement.

**Inputs:** live permission request, candidate decision, session ledger, policy.

**Procedure:**
1. Match `session_id` and `request_id`.
2. Match provider `tool_use_id` when present.
3. Confirm `source` is explicitly `human` for human attribution.
4. Check decision freshness and conflicting prior decisions.
5. If all checks pass, emit a structured verified decision.
6. If the source is non-human, emit a non-human cancellation/result without user-attribution wording.
7. If ambiguous, reconcile once from authoritative host state; if still ambiguous, stop and escalate.

**Expected output:** one of `verified_human_approve`, `verified_human_deny`, `non_human_cancel`, `ambiguous`, `expired`.

**Metrics:** reconciliation success rate; false attribution rate; reconciliation latency.

**Verification:** deterministic guard accepts known-good fixtures and rejects adversarial fixtures.

**Failure handling:** never downgrade identity requirements to make progress.

**Stop conditions:** terminal classification reached or one reconciliation retry exhausted.

## Skill 3 — Verify a reasoning handoff
**Purpose:** prevent the model from reasoning from a fabricated user decision.

**Trigger:** immediately before inserting permission outcome into agent context.

**Inputs:** structured decision record and intended natural-language message.

**Procedure:**
1. Check classification.
2. Permit “user approved/denied/stopped” wording only for verified-human classifications.
3. For non-human events, name the true source when known.
4. For ambiguity, use the neutral correction message from policy.
5. Record verification status separately from implementation status.

**Expected output:** provenance-safe context event.

**Metrics:** unsupported conclusion count; agent restarts/rework caused by phantom decisions.

**Verification:** test messages never assert human intent without verified evidence.

**Failure handling:** block the handoff.

**Stop conditions:** context event passes provenance validation.
