# Workflow: Measure, Diagnose, Recover, Verify

## Trigger
A Windows-supervised agent/MCP stdio child becomes unresponsive, shows sustained abnormal CPU, or crosses a system-resume boundary.

## Goal
Detect alive-but-wedged processes promptly, recover within bounded attempts, and prove restored protocol liveness.

## Inputs
Watchdog configuration, timestamped CPU samples, protocol progress timestamp, optional resume timestamp, restart count, runtime versions.

## Baseline
Before optimization, record healthy idle CPU, healthy active CPU, normal progress interval, normal restart/handshake time, and current manual detection/recovery delay.

## Context
Use `evidence/research.md`, `rules/liveness-performance-rules.md`, and host-specific process/protocol semantics.

## Stages
1. **Observe** — collect anomaly, power event, timeout, process state, and progress evidence.
2. **Measure baseline/anomaly** — gather the configured sample window; never decide from one CPU point.
3. **Diagnose** — classify exit, stale idle hang, hot+stale wedge, or healthy active work.
4. **Form hypothesis** — state likely layer and falsifiable evidence; do not present speculation as fact.
5. **Implement improvement/recovery** — integrate liveness gate or restart the owned child only when deterministic policy recommends it.
6. **Measure again** — record restart latency, CPU normalization, and fresh protocol progress.
7. **Improved?** If no, retry recovery at most until `max_restart_attempts`; otherwise stop and escalate. If yes, proceed.
8. **Independent verification** — `subagents/performance-verifier.md` checks false-positive fixtures, retry bound, and handshake evidence.
9. **Complete** — record Implemented, Measured, Verified.

## Responsible agent
Runtime implementation owner for stages 1–7; independent Performance Verifier for stage 8.

## Tools
`python scripts/liveness_watchdog.py`, `python -m unittest tests/test_liveness_watchdog.py`, OS metrics, safe stack sampling, host protocol logs.

## Outputs
Incident classification, before/after metrics, recovery decision/result, remaining risks, verification verdict.

## Checkpoints
- Baseline captured.
- Multiple samples support anomaly.
- Recent-progress high-CPU behavior is not auto-restarted.
- Restart budget is finite.
- Recovery includes protocol progress, not only process creation.

## Metrics
Mean time to detect, CPU-core-minutes wasted, false-positive restart rate, recovery success rate, handshake latency, attempts per incident.

## Retry policy
Maximum attempts come from `config/watchdog.json`; default 2. No infinite loops.

## Stop conditions
Restart budget exhausted; process ownership uncertain; recovery would be destructive; no protocol signal can verify recovery; or repeated restart fails to improve liveness.

## Failure path
Preserve evidence, stop automated retries, isolate/disable the failing integration when safe, and escalate to runtime/platform owner. Do not weaken security or correctness checks.

## Verification
Independent verifier reruns deterministic tests and reviews real incident/recovery measurements.

## Definition of Done
Evidence documented; baseline measured; deterministic liveness decision integrated; bounded recovery exercised; post-restart progress verified; metrics compared; risks documented; independent verification complete; no blocking issue remains.
