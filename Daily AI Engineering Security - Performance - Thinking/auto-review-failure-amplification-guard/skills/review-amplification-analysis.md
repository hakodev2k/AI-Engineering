# Skill: Review Amplification Analysis

## Purpose
Detect when repeated approval-model calls are being caused by one persistent sandbox/tool failure rather than independent risky actions.

## Trigger
Run before an automatic escalation review and during incident analysis when review volume or token usage spikes.

## Inputs
Operation type, normalized targets, sandbox policy, failure code/message, requested escalation, prior review decisions, review timestamps, input-token estimates.

## Preconditions
The intended sandbox boundary is known and the operation can be classified as in-bound or boundary-crossing.

## Allowed tools
Read-only logs, telemetry, permission-policy inspection, deterministic scripts, sandbox-health probes.

## Constraints
Never auto-approve a boundary crossing. Never suppress a materially different request because it resembles an earlier one. Do not include secrets or raw prompts in fingerprints.

## Procedure
1. Classify the operation as expected-in-sandbox, intended-boundary-crossing, or unknown.
2. Normalize failure class from stable error code and coarse message signature.
3. Normalize operation class and target scope without retaining sensitive values.
4. Build a failure fingerprint.
5. Count matching escalations and allowed reviews in a bounded time window.
6. Measure reviewer input-token growth and repeated-review ratio.
7. If an expected-in-sandbox fingerprint reaches the configured threshold, block another automatic review and run sandbox-health validation.
8. If health remains bad, require human remediation rather than repeated escalation.
9. If the request is genuinely new or crosses a different boundary, allow normal review.
10. Compare post-change review volume and task quality against baseline.

## Decision points
- Unknown scope: require human review.
- New permission boundary: normal review.
- Same expected-in-sandbox failure above threshold: block repeat.
- Sandbox health recovered: reset fingerprint after successful in-sandbox execution.

## Expected output
Decision, fingerprint, counters, reason code, remediation hint, and metrics snapshot.

## Metrics
Repeated-review ratio, calls/fingerprint, reviewer tokens/fingerprint, time-to-break, false blocks, legitimate reviews preserved.

## Verification
Replay historical traces and confirm repeated equivalent failures are bounded while distinct boundary crossings still reach review.

## Failure handling
Fail closed to human review if classification is uncertain. Maximum one automated sandbox-health retry per blocked fingerprint.

## Stop conditions
Resolved sandbox health, human intervention, or threshold reached and automatic escalation blocked.