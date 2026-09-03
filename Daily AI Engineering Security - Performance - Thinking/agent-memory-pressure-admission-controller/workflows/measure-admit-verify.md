# Workflow: Measure, Admit, Verify

## Trigger
A worker/process spawn path is added, changed, or implicated in memory-pressure incidents.

## Goal
Introduce hard resource admission using measured headroom, then prove that it reduces pressure failures without unacceptable performance regression.

## Inputs
Host memory baseline, worker footprint samples, policy JSON, representative tasks, platform pressure metrics.

## Baseline
Measure task latency/throughput, worker memory, host available memory, pressure/swap behavior, crash/restart count, and UI responsiveness before the change.

## Stages
1. **Observe** — capture the incident or current spawn behavior and resource signals.
2. **Measure baseline** — obtain at least three representative worker-memory samples and baseline workload metrics.
3. **Diagnose** — distinguish leak, stale-worker retention, fan-out, or unsafe admission. This package addresses the admission boundary even if another root cause also exists.
4. **Form hypothesis** — select worker estimate and reserve thresholds expected to block unsafe spawns while preserving safe throughput.
5. **Implement improvement** — call the admission guard before spawn; on BLOCK, optionally reclaim eligible workers.
6. **Remeasure before retry** — await reclamation, measure again, and retry admission at most once unless policy sets zero retries.
7. **Measure again** — run the same benchmark and compare pressure, responsiveness, blocked spawns, latency, and throughput.
8. **Improved?** If no, permit one policy/estimate revision based on evidence. Maximum two total tuning iterations.
9. **Independent verification** — Performance Verifier reviews measurements and regression evidence.

## Responsible agent
Baseline/implementation owner for stages 1-7; independent Performance Verifier for stage 9.

## Tools
`scripts/memory_admission_guard.py`, platform memory monitors, process monitors, existing benchmark/test tools.

## Outputs
Before/after metrics, admission decisions, threshold rationale, false-block observations, verification record.

## Checkpoints
Baseline accepted; policy selected; implementation complete; post-change benchmark complete; independent verification complete.

## Metrics
Available/post-spawn memory, projected utilization, memory-pressure stall time, swap/pagefile growth, blocked unsafe spawns, worker failures, task throughput, latency, false-block rate.

## Retry policy
One reclamation retry per spawn by default; at most two policy-tuning iterations in the workflow. No infinite retry loops.

## Stop conditions
Verified improvement with no blocking regression, or stop-and-escalate when safe headroom cannot be achieved on the target host.

## Failure path
Queue/reject the work with a visible reason. Recommend larger host, smaller worker, lower concurrency, or root-cause remediation. Never bypass the gate to hide failure.

## Verification
Known unsafe snapshot blocks; safe snapshot admits; unit tests pass; observed headroom is consistent with the configured reserve; pressure metrics improve or remain safe; throughput tradeoff is measured.

## Definition of Done
Baseline captured, limitation identified, gate implemented, tests pass, before/after metrics collected, unsafe spawn blocked, safe spawn admitted, risks recorded, independent verification complete, no blocking issue remains.
