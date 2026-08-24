# Workflow: Measure → Diagnose → Contain → Verify

## Trigger
Memory pressure, stale workers, daemon lifecycle change, or suspected process leak.

## Goal
Reduce retained resource growth without killing useful agent work.

## Inputs
Match pattern, baseline budget, workload, runtime version.

## Baseline
Three idle snapshots and median tree RSS/worker count.

## Stages
1. **Observe** — collect version, topology, host memory state.
2. **Measure baseline** — run the snapshot command three times.
3. **Exercise** — run one representative workload; record peak.
4. **Cooldown** — launch no new work for the configured period.
5. **Measure again** — three post-job snapshots.
6. **Diagnose** — classify retained RSS vs unreaped workers; choose one hypothesis.
7. **Implement improvement** — lifecycle/reaping/buffer fix in the host product or wrapper.
8. **Repeat** — same workload and budget.
9. **Verify** — independent verifier reviews artifacts and tests.

## Responsible agent
Performance investigator implements; Memory Verifier validates.

## Tools
`process_memory_guard.py`, runtime logs, OS process inspection, unit tests.

## Outputs
Baseline and post snapshots, comparison JSON/text, hypothesis record, verification result.

## Checkpoints
Before modification; after each experiment; before containment; final verification.

## Metrics
Tree RSS, worker count, stale count, peak RSS, time-to-baseline, cycle-to-cycle slope.

## Retry policy
At most 2 collection retries and 3 distinct remediation hypotheses.

## Stop conditions
Host instability; ambiguous process ownership; three hypotheses fail; regression budget met and independently verified.

## Failure path
Preserve evidence, disable optional background workload if operationally acceptable, escalate to runtime owner. Do not terminate ambiguous workers or relax budgets.

## Verification
Same workload/version class, tests pass, three post-fix cycles meet budget.

## Definition of Done
Implemented, Measured, and Verified are all explicit and no blocking finding remains.