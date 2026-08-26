# Workflow: Research and Diagnose Verification Freshness

## Trigger
Repeated verification requests, stale-verification warnings, or completion blocked despite recent passing tests.

## Goal
Determine whether verification is actually stale and identify the exact state field causing invalidation.

## Inputs
Verification records, workspace snapshot, dirty state, verification command, runtime freshness metadata.

## Baseline
Record number and duration of verification runs, latest passing snapshot, latest epoch, current snapshot, and redundant rerun count.

## Context
Use current repository state and durable evidence, not historical changed-path summaries alone.

## Stages
1. Observe the stale event and preserve its referenced epoch/snapshot.
2. Measure baseline rerun count and verification duration.
3. Diagnose snapshot, epoch, TTL, exit-code, and dirty-state mismatches.
4. Form one explicit hypothesis for the stale state.
5. Run the deterministic guard.
6. If hypothesis is wrong, update evidence and retry at most twice.

## Responsible agent
Primary investigator; Verification Reviewer performs independent final review.

## Tools
Git status/tree hashing, verification logs, guard script.

## Outputs
Root cause, evidence record, guard decision, remediation target.

## Checkpoints
After baseline, after first guard decision, and before any rerun.

## Metrics
Redundant reruns, stale-state false positives, time spent re-verifying, epoch advancement rate.

## Retry policy
Maximum two diagnostic revisions.

## Stop conditions
Fresh evidence established, inconsistent state requires escalation, or two retries exhausted.

## Failure path
Do not keep rerunning tests. Preserve records and escalate the runtime-state inconsistency.

## Verification
Independent reviewer recomputes snapshot and guard decision.

## Definition of Done
Root cause evidenced; no unbounded rerun; current freshness state deterministically classified.
