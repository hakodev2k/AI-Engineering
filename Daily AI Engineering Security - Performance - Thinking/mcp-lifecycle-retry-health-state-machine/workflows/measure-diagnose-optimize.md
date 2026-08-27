# Workflow: Measure, Diagnose, Optimize
**Trigger:** MCP server is marked failed, disappears after discovery, or suffers transient startup outage.  
**Goal:** improve availability without masking terminal errors or creating retry storms.

## Baseline
Capture initialization success rate, p50/p95 time-to-ready, retries/session, and tool availability.

## Stages
1. Observe lifecycle event stream.
2. Measure baseline.
3. Diagnose transport/protocol/process-state failure class.
4. Form one explicit hypothesis.
5. Apply state-machine classification.
6. Retry within budget when transient.
7. Measure again.
8. If not improved, re-evaluate at most twice.
9. Independently verify.

## Checkpoints
After baseline, before retry, after retry budget exhaustion.

## Metrics
Initialization success, recovery rate, p50/p95 readiness latency, retry amplification.

## Retry policy
At most `max_attempts` per lifecycle episode and at most 2 diagnosis revisions.

## Stop conditions
Terminal error, confirmed dead process, or retry budget exhausted.

## Failure path
Surface unavailable server and preserve evidence; do not loop.

## Verification
Performance Investigator confirms before/after metrics.

## Definition of Done
Availability improvement is measured, terminal failures still fail fast, and retry amplification stays bounded.
