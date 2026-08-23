# Hook Parent Timeout Liveness Guard

**Category:** Performance

## Problem
Blocking agent hooks can freeze an entire session when a child process hangs before user code starts, waits forever on I/O, or never returns a terminal hook response. Child-side timeout logic cannot protect a child that never reaches that logic.

## Evidence
See `evidence/research.md`. Current public reports include Claude Code #85250 (declared timeout not enforced parent-side), #50160 (unbounded SessionStart hook stall), and #46177/#44435 (additional hook hang/race mechanisms).

## Existing approach and limitation
Per-hook timeout fields and in-hook timers are useful only when the host actually owns the deadline or the child begins executing. Coarse agent watchdogs lose hook attribution and may discard multi-hour state.

## Proposed improvement
Retain timeout ownership in the parent, kill the owned process tree on deadline, synthesize one terminal lifecycle result, and preserve explicit fail-open/fail-closed security policy.

## Architecture
- `evidence/research.md` — observed signals, current approaches, root causes, metrics.
- `skills/hook-liveness-investigation.md` — evidence-driven diagnosis procedure.
- `rules/liveness-rules.md` — enforceable runtime invariants.
- `subagents/liveness-verifier.md` — independent verification role.
- `workflows/measure-guard-verify.md` — bounded measure/implement/verify loop.
- `hooks/pre-hook-liveness-gate.md` — deterministic integration contract.
- `scripts/hook_watchdog.py` — dependency-free reference supervisor.
- `tests/test_hook_watchdog.py` — success/failure/timeout tests.

## Installation
Requires Python 3.10+ only. Copy this directory into the host repository. No package install is required.

## Usage
Run tests:
`python -m unittest tests/test_hook_watchdog.py`

Guard a command:
`python scripts/hook_watchdog.py --timeout 3 --hook-id pre-bash --cwd . -- python your_hook.py`

Integrate the same semantics natively when possible: monotonic parent deadline, process-tree termination, exactly one terminal lifecycle record.

## Metrics
Track p50/p95 hook latency, timeout count, unmatched starts, orphan process count, batch critical-path duration, and recovery rate.

## Verification
**Implemented:** watchdog and integration contract exist.
**Measured:** compare baseline stall/latency with guarded fixtures.
**Verified:** all unit tests pass; timeout terminates within policy tolerance; no owned descendant survives; every start receives one terminal disposition.

## Safety
The guard never treats timeout as successful policy enforcement. Environment handling is inherited by default; production integrations SHOULD apply an explicit environment allowlist. Captured output is bounded to 64 KiB per stream.

## Failure handling
Detection: deadline or nonzero/spawn failure. Evidence: structured JSON. Retry: at most one automatic retry and only when policy permits. Fallback: host-native supervisor with equivalent invariants. Escalation: runtime owner. Stop: retry budget exhausted or security disposition cannot be preserved.

## Definition of Done
Evidence documented; baseline captured; parent deadline active; deterministic tests pass; process cleanup verified; terminal lifecycle coverage is 100%; security policy unchanged; no blocking issue remains.

## Customization
Adjust deadlines by hook class using measured p95 plus bounded headroom. Do not use one excessively large global timeout merely to avoid tuning.