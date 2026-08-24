# Skill: Memory Lifecycle Investigation

## Purpose
Prove whether an AI runtime's background process tree returns toward a stable baseline after work completes.

## Trigger
Unexpected RSS/swap growth, OOM, long-lived spare workers, daemon restart, or a new background-agent release.

## Inputs
Runtime process match pattern, representative workload, cooldown window, RSS/worker budgets, host memory information.

## Preconditions
Use a disposable or recoverable workload. Know which process owns the session. Do not terminate processes during baseline collection.

## Required context
Runtime/version, OS, launch mode, worker topology, expected idle pool size, recent upgrades, and whether active jobs remain.

## Allowed tools
Read-only process inspection, runtime logs, `ps`, `/proc`, Activity Monitor exports, and `scripts/process_memory_guard.py`.

## Constraints
Do not infer a leak from one high sample. Do not kill an active worker to improve numbers. Do not merge RSS and virtual memory. Preserve timestamps and PIDs.

## Procedure
1. Capture three idle snapshots 30–60 seconds apart; record median tree RSS and worker count.
2. Execute one representative background workload; record start/end and peak RSS.
3. Wait the configured cooldown without launching new work.
4. Capture three post-job snapshots.
5. Compare median post-job RSS and worker count with baseline.
6. If growth exceeds budget, classify descendants: active, expected idle, stale/unclaimed, or unknown.
7. Form at most three hypotheses: retained heap/buffer, unreaped process, respawn/adoption loop, worker-thread leak, or identity/path duplication.
8. Change only one variable per experiment and repeat baseline/workload/cooldown.
9. Require an independent verifier before claiming remediation.

## Decision points
- High peak but baseline recovery: capacity issue, not proven leak.
- Persistently growing post-job RSS across repeated cycles: leak/retention candidate.
- Worker count grows while per-worker RSS is stable: lifecycle/reaping candidate.
- Unknown ownership: block automated containment.

## Expected output
Timestamped snapshots, baseline/post medians, deltas, classification table, hypothesis, experiment result, and verification status.

## Metrics
Tree RSS delta, worker-count delta, slope across cycles, time-to-baseline, stale-worker age.

## Verification
At least three cycles show the same failure before remediation and three cycles stay within budget after remediation.

## Failure handling
Retry collection twice for transient `ps`/proc failures. If ownership remains ambiguous, mark unverified and escalate.

## Stop conditions
Stop after three failed hypotheses, any host instability, missing ownership evidence, or when the configured budget is met and independently verified.