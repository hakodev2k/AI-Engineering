# Skill: Response Failure Classification
## Purpose
Classify agent-model failures using observable response metadata before choosing a retry.
## Trigger
Any empty, truncated, reasoning-only, or unusable model response.
## Inputs
Finish reason; visible-content length; tool-call count; reasoning-token count; output-token count; latency; attempt counters.
## Preconditions
Telemetry is available without storing hidden reasoning content.
## Required context
Provider/model identifier and configured retry policy.
## Allowed tools
Metrics/log inspection and `scripts/retry_budget_guard.py`.
## Constraints
MUST NOT inspect or expose hidden chain-of-thought. MUST NOT retry solely because visible content is empty.
## Procedure
1. Capture baseline model-call count and latency.
2. Classify the response using deterministic telemetry.
3. Distinguish reasoning-only budget exhaustion from zero-usage empties and partial truncation.
4. Form one remediation hypothesis.
5. Apply the policy action.
6. Measure the next attempt only when a retry is permitted.
7. Stop at global and per-class retry caps.
## Decision points
Reasoning-only `length` with nonzero reasoning tokens and no visible/tool output stops immediately. Zero-usage empty may retry within cap. Partial visible truncation may continue within cap.
## Expected output
Failure class, action, retry allowance, and remaining retry budget.
## Metrics
Calls/failed turn, wasted retries, latency, output-token utilization, recovery rate.
## Verification
Replay synthetic fixtures and compare before/after call counts.
## Failure handling
Unknown or malformed telemetry fails closed to human/platform escalation.
## Stop conditions
Any retry budget exhausted; deterministic no-progress class identified; cost ceiling reached.
