# Workflow: Secure Evaluation Run

## Trigger
High-capability agent run or containment-sensitive coding/cyber task.

## Goal
Execute only while effective isolation is provable and stop quickly on boundary violation.

## Inputs
Policy, attestation, runtime event stream, approved task/tool set.

## Baseline
Capture effective sandbox/network/monitor/kill-path state and policy hash before execution.

## Stages
1. Observe deployment state.
2. Run preflight attestation.
3. Diagnose any failed attestation.
4. Correct non-security configuration defects with at most two retries.
5. Start agent only after preflight passes.
6. Monitor every security-relevant event.
7. On tripwire: block action, preserve evidence, invoke external emergency stop, escalate.
8. On clean completion: independent reviewer checks evidence completeness and final state.

## Responsible agent
Containment Monitor; human security reviewer owns recovery approval.

## Tools
`scripts/containment_guard.py`, append-only audit sink, external kill path.

## Outputs
Preflight result, decisions, incident evidence if any, final verification record.

## Checkpoints
Preflight pass; monitor heartbeat; first privileged event; final tool event; completion review.

## Metrics
Attestation coverage, violation block rate, stop latency, false positives, evidence completeness.

## Retry policy
Maximum two retries for preflight defects. Zero automatic retries after a confirmed containment violation.

## Stop conditions
Confirmed tripwire, monitor loss, malformed security event, unprovable policy state, or task completion.

## Failure path
Fail closed, preserve evidence, notify security reviewer. Do not broaden privileges to continue.

## Definition of Done
Preflight passed, monitor remained independent and active, all events decided, no unapproved violation occurred, tests passed, and independent reviewer records Verified status.
