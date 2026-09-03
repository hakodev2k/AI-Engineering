# Skill: Post-Resume Liveness Investigation

## Purpose
Diagnose and recover Windows agent child processes that remain alive but stop making protocol progress or consume abnormal CPU after suspend/resume or pipe/runtime anomalies.

## Trigger
System resume, persistent local-agent unresponsiveness, repeated request timeout, or sustained child CPU anomaly.

## Inputs
CPU samples, process/thread identity, last protocol-progress timestamp, optional resume timestamp, restart history, runtime/SDK versions.

## Preconditions
A normal idle/working baseline exists or can be captured. Recovery authority and child-process ownership are known.

## Required context
How the host observes MCP/agent protocol progress, how it starts/stops the child, and whether the child may legitimately run CPU-heavy work.

## Allowed tools
OS process metrics, read-only stack samplers, application logs, deterministic watchdog analyzer, local protocol handshake/tests.

## Constraints
Do not infer root cause from CPU alone. Do not terminate unrelated processes. Do not exceed configured restart budget.

## Procedure
1. **Measure baseline:** sample normal idle and active child CPU plus protocol-progress cadence.
2. **Observe anomaly:** record resume/timeouts and at least the configured number of CPU samples.
3. **Diagnose:** distinguish process exit, pipe EOF, high-CPU+stale-progress wedge, stale-progress-only hang, and healthy high-CPU work.
4. **Form hypothesis:** identify likely layer (application/tool, stdio pipe, event loop/runtime, host supervision) and list evidence/assumptions separately.
5. Run `scripts/liveness_watchdog.py` against captured state.
6. If restart is recommended and budget remains, request/perform the host's safe child restart mechanism.
7. **Measure again:** require process stabilization and a fresh initialize/health/protocol-progress event.
8. Compare detection delay and CPU waste with baseline/previous incidents.
9. Handoff for independent verification.

## Decision points
- Recent progress + high CPU: investigate workload; do not auto-restart.
- Stale progress without high CPU: mark suspect; use request/health probe before restart.
- High CPU + stale progress after grace: restart may proceed within budget.
- Budget exhausted: stop automation and escalate.

## Expected output
Facts, Evidence, Assumptions, Hypothesis, Decision, Metrics, Recovery result, Risks, Verification status.

## Metrics
Detection latency, CPU-core-minutes wasted, false-positive restarts, restart success rate, handshake recovery latency.

## Verification
Independent verifier confirms identical thresholds, bounded retries, and a successful post-restart protocol signal.

## Failure handling
Maximum two automatic restart attempts by default. If recovery fails, preserve process/log/stack evidence when safe, disable the failing child integration if possible, and escalate to runtime/platform owner.

## Stop conditions
Stop on restart-budget exhaustion, uncertain process ownership, destructive recovery requirement, or inability to verify protocol recovery.
