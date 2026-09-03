# Workflow: Measure, Diagnose, Remediate, Verify

## Trigger
A lifecycle change, performance regression, or audit finding involving local MCP processes.

## Goal
Restore a bounded process steady state without terminating unrelated workloads.

## Inputs
Policy, baseline snapshot, live owner set, lifecycle trigger sequence, host logs, and implementation under test.

## Baseline
Capture the quiet steady state before any change. Record MCP process count, identities, generations, orphans, and optional RSS/CPU totals.

## Context
Document whether each server is global/shared or scoped to a session/worktree and all configuration sources that can launch it.

## Stages
1. **Observe** — Performance Investigator captures facts and the exact lifecycle transition.
2. **Measure baseline** — Run `scripts/mcp_process_audit.py` on the pre-trigger snapshot.
3. **Diagnose** — Compare pre/post ownership and process generations; identify spawn/reap ordering, duplicate discovery, stale owner, or transport/process mismatch.
4. **Form hypothesis** — State one falsifiable cause and expected metric change.
5. **Implement improvement** — Change only the lifecycle ownership/reaping path needed for the hypothesis.
6. **Measure again** — Repeat the same lifecycle sequence and grace period.
7. **Improved?** — If no, revise the hypothesis; maximum three implementation iterations.
8. **Verify** — Independent verifier repeats the sequence and unit tests.

## Responsible agent
Performance Investigator for stages 1–4; implementation owner for stage 5; independent verifier for stage 8.

## Tools
Process snapshot producer, application logs, source control, `scripts/mcp_process_audit.py`, `python -m unittest tests/test_mcp_process_audit.py`.

## Outputs
Baseline report, post-trigger report, root-cause evidence, change record, and final verification report.

## Checkpoints
- Baseline accepted before code changes.
- Ownership model accepted before cleanup logic changes.
- Verification snapshot collected after the same grace interval.

## Metrics
Process count delta per cycle, duplicate identity count, max generations, orphan count, oldest orphan age, optional RSS/CPU delta.

## Retry policy
Maximum three remediation iterations. Every retry MUST change the hypothesis or implementation; repeating the same experiment without new evidence is not a retry.

## Stop conditions
Stop on ambiguous process ownership, destructive cleanup requirement, three unsuccessful iterations, or regression in legitimate concurrent MCP use.

## Failure path
Preserve snapshots/logs, roll back unsafe lifecycle changes, leave uncertain processes untouched, and escalate with exact identities/PIDs and transition evidence.

## Verification
Audit status `pass`, unit tests pass, and repeated lifecycle cycles converge to the same bounded steady state.

## Definition of Done
Implemented: lifecycle change exists. Measured: before/after metrics captured. Verified: independent repetition passes policy with no legitimate process loss and no blocking finding.
