# Skill: Latency Attribution Analysis

## Purpose
Determine whether a tool-performance conclusion is supported by lifecycle-specific timing evidence.

## Trigger
A tool is called slow, stuck, regressed, or unsuitable; or an optimization is proposed from agent-runtime timing.

## Inputs
Lifecycle trace, tool identifier, proposed conclusion, baseline if available.

## Preconditions
Timestamps use one monotonic or consistently synchronized clock. Approval policy is not changed for measurement.

## Required context
Tool identity, approval requirement, execution environment, and comparison baseline.

## Allowed tools
Read-only trace inspection, `scripts/attribution_guard.py`, test runner, statistics tooling.

## Constraints
Do not infer execution time from wall time. Do not disable approvals to simplify measurement. Do not use model narrative as timing evidence.

## Procedure
1. Capture the baseline trace unchanged.
2. Identify lifecycle boundaries for approval request/decision, execution start/finish, and result consumption.
3. Run the validator and record separated durations.
4. Classify each tool as `attributable` or `unsafe_attribution`.
5. State Facts, Assumptions, Evidence, Hypotheses, Decision, Risks, Verification status.
6. If boundaries are missing, add instrumentation rather than optimizing the tool.
7. Re-measure after instrumentation or implementation change.
8. Require independent verification of any performance-driven design change.

## Decision points
- Missing execution start/finish → execution latency is unknown.
- Approval wait > 0 with known execution → report both separately.
- Event order violation → invalidate the trace.
- Regression conclusion → require comparable execution-only baselines.

## Expected output
Lifecycle metrics, explicit evidence status, supported/unsupported conclusion, next action.

## Metrics
Execution latency, approval wait, postprocess latency, attributable-tool ratio, rejected unsupported conclusions.

## Verification
Validator exits 0 and reviewer confirms conclusion cites execution-only evidence.

## Failure handling
Retry instrumentation/measurement at most twice. If still incomplete, stop and report unknown execution latency.

## Stop conditions
Stop when attribution is valid and independently verified, or when two instrumentation attempts fail.