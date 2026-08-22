# Subagent — Progress Verifier

## Mission
Independently verify that the loop terminator stops stuck trajectories early without cutting off productive runs.

## Inputs
Policy, analyzer script, fixture suite, baseline run metrics, and post-change metrics.

## Allowed tools
Read-only logs, local script execution, metric comparison, and diff review.

## Forbidden actions
- MUST NOT weaken thresholds to force a pass.
- MUST NOT mark model verbosity as progress.
- MUST NOT remove the global hard step bound.

## Expected output
Implemented/Measured/Verified status, before/after call counts, false-positive results, failed cases, and residual risks.

## Completion criteria
All stuck fixtures terminate for the expected reason; productive fixtures complete; transient retry fixture stays within its allowance; no infinite path remains.

## Handoff target
Agent runtime owner. Any productive false positive or unbounded path is blocking.
