# Integration Guide

## Goal
Integrate the provenance guard between your permission/runtime event stream and the model context so that automated events can never be misrepresented as human approval, denial, or interruption.

## 1. Normalize lifecycle events
Emit JSON records with these minimum fields:
- `type`: `permission_request`, `decision`, `tool_start`, `tool_result`, or `system_event`
- `session_id`
- `request_id`
- `timestamp`
- `tool_use_id` when the provider exposes one

Decision events also require:
- `source`: `human`, `system`, `runtime`, `watchdog`, `background_task`, or `unknown`
- `action`: `approve`, `deny`, `stop`, or `cancel`

Do not infer `source=human` from message text. The source must come from the UI/API/control channel that actually collected the operator action.

## 2. Place the gate at the correct boundary
The strongest integration point is immediately before a permission outcome enters model context. Preserve raw provider/runtime events for diagnostics, but transform them into a structured verified state first.

Recommended flow:

`provider/runtime event -> normalize -> ledger -> provenance guard -> verified state -> model context`

Do not use:

`provider free-text sentinel -> model context -> model guesses source`

## 3. Host-owned request IDs
If your host creates the permission prompt, generate a cryptographically random request ID and carry it through the UI callback. Bind it to the session and provider tool call.

If the provider creates the prompt but does not expose stable identity, do not claim exact correlation. Mark the mapping ambiguous and retain that limitation in metrics.

## 4. Human-decision collection
For every operator button/API action, record:
- authenticated actor or trusted local UI source;
- session ID;
- request ID;
- provider tool-call ID if available;
- action;
- timestamp;
- policy/version metadata.

Avoid storing full tool payloads when they can contain secrets. Hash or retain only fields required for correlation.

## 5. Background/system events
Background completion, queue operations, timeout, network close, watchdog, retry cancellation, scheduler messages, and runtime aborts must be non-human sources. Their user-facing message should say what actually happened rather than reusing human-denial language.

Example safe message:
`Tool call was cancelled by a runtime/background event. No human denial was verified.`

## 6. Guard execution
From the package root:

```bash
python scripts/provenance_guard.py tests/good.jsonl --policy config/policy.json
```

Expected exit: `0`.

```bash
python scripts/provenance_guard.py tests/bad.jsonl --policy config/policy.json
```

Expected exit: `2`, including unsupported human attribution and cross-session/orphan decision violations.

Use `--report report.json` in CI to persist a machine-readable verification result.

## 7. Model handoff contract
Only these states may imply human intent:
- `verified_human_approve`
- `verified_human_deny`
- verified human stop/interrupt equivalent

For `non_human_cancel`, `ambiguous`, `expired`, or unresolved outcomes, the model must receive neutral provenance-safe wording. It may not apologize for being stopped by the user or change requirements based on a denial that was never verified.

## 8. Rollout
1. Instrument current behavior without enforcement.
2. Capture baseline false-attribution and unresolved-correlation rates.
3. Add regression fixtures for known races.
4. Enable fail-closed human attribution in development.
5. Verify concurrency/background-agent scenarios.
6. Enable in production while retaining neutral fallback.

## 9. Monitoring
Track:
- permission requests;
- verified human decisions;
- non-human cancellations;
- ambiguous decisions;
- cross-session/orphan/conflict violations;
- provenance-gate latency;
- agent turns aborted after an unverified outcome;
- rework/tokens lost to phantom denials before vs after rollout.

## 10. Safety
The guard is not permission bypass logic. When identity is missing, it must not auto-approve. Ambiguity may prevent attribution and require a fresh human decision when the action is dangerous or irreversible.
