# Windows Agent stdio Liveness Watchdog

**Category:** Performance  
**Status:** Implemented reference analyzer; real host integration must be Measured and independently Verified.

## Problem
A Windows agent/MCP stdio child can remain alive while no longer serving protocol traffic. Recent MCP Python evidence shows a suspend/resume failure where the main event loop spins near one full CPU core indefinitely, so ordinary exit-based supervision never recovers it.

## Evidence
See `evidence/research.md`. The primary current signal is MCP Python SDK issue #3411 from 2026-08-28 through 2026-09-01, including repeated post-resume captures. CPython and OpenHarness reports independently show Windows pipe/subprocess liveness failures can defeat high-level timeout or interactive-host expectations.

## Existing approach
Hosts typically respawn children only after exit, use request timeouts, generic CPU monitors, event-loop workarounds, or manual termination.

## Existing limitations
Alive-but-wedged children do not emit an exit signal; CPU alone creates false positives; timeouts do not necessarily repair the child; and the selector-loop experiment reported in #3411 did not eliminate the spin.

## Proposed improvement
Treat liveness as a multi-signal contract: sustained CPU anomaly + stale protocol progress + resume grace + finite restart budget. Recovery is not complete until a fresh protocol handshake/progress event appears.

## Architecture

```text
process metrics + protocol progress + resume event
                  |
                  v
       deterministic liveness analyzer
        | healthy | suspect | restart_recommended
        v         v                 v
      observe   diagnose      host-owned safe restart
                                   |
                            protocol handshake
                                   |
                          independent verification
```

## Package tree

```text
README.md
evidence/research.md
config/watchdog.json
scripts/liveness_watchdog.py
tests/test_liveness_watchdog.py
rules/liveness-performance-rules.md
skills/post-resume-liveness-investigation.md
subagents/performance-verifier.md
workflows/measure-diagnose-recover-verify.md
hooks/post-resume-liveness-check.md
```

## Installation
Python 3.10+ is sufficient for the reference analyzer/tests. No third-party dependencies are required. Production metric collection is host-specific.

## Configuration
Tune `config/watchdog.json` from measured healthy idle/active behavior. Defaults require three consecutive samples at or above 85% CPU, stale progress for 30 seconds, a 15-second post-resume grace, and at most two restart attempts.

## Usage
Run deterministic tests:

```bash
python -m unittest tests/test_liveness_watchdog.py
```

Evaluate captured state:

```bash
python scripts/liveness_watchdog.py --config config/watchdog.json --state state.json
```

Example state:

```json
{
  "samples": [
    {"timestamp": 100, "cpu_percent": 91},
    {"timestamp": 105, "cpu_percent": 94},
    {"timestamp": 110, "cpu_percent": 96}
  ],
  "last_progress_timestamp": 70,
  "resume_timestamp": 80,
  "restart_attempts": 0
}
```

Exit codes: `0` healthy, `2` suspect, `3` restart recommended, `64` invalid input/configuration. The script itself never terminates a process.

## Workflow
Follow `workflows/measure-diagnose-recover-verify.md`: Measure -> Diagnose -> Hypothesize -> Recover/Integrate -> Measure again -> bounded retry -> independent verification.

## Metrics
Mean time to detect, CPU-core-minutes wasted, false-positive restart rate, successful recovery rate, post-restart handshake latency, and attempts per incident.

## Verification
A new process/PID is not sufficient. Verification requires CPU/resource stabilization plus a fresh protocol-level progress or initialization event. The independent verifier must also confirm that high-CPU work with recent progress is not automatically restarted.

## Safety
Confirm process ownership before any termination/restart. Never use the watchdog to kill arbitrary PIDs. Do not relax security, repository protection, or correctness checks to make recovery faster. Preserve diagnostic evidence without secrets.

## Failure handling
Detection: stale progress and/or sustained CPU anomaly. Evidence: timestamps, samples, runtime versions, optional safe stack capture. Retry: finite `max_restart_attempts` (default 2). Fallback: isolate/disable the failing child integration when safe. Escalation: runtime/platform owner. Stop: budget exhausted, ownership uncertain, destructive recovery required, or recovery cannot be verified.

## Definition of Done
- **Implemented:** host records required liveness signals and uses deterministic thresholds/restart budget.
- **Measured:** healthy baseline and incident/recovery metrics are captured and compared.
- **Verified:** tests pass, false-positive scenario is preserved, recovery is protocol-confirmed, retries are bounded, and an independent verifier approves the evidence.

## Customization
Hosts may add memory, thread-state, request-timeout, heartbeat, or power-event signals. Keep decisions evidence-driven: additional signals should reduce ambiguity, not replace protocol progress with a single generic metric.
