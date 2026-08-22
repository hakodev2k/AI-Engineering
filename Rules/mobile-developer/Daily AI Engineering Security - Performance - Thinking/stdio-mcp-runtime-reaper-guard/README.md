# Stdio MCP Runtime Reaper Guard

**Category:** Performance  
**Run date:** 2026-08-20 (UTC+7)

## Problem
Agent hosts can repeatedly spawn local stdio MCP servers, browser/computer-use workers, or helper process trees without reliably reusing or reaping previous instances. The result is monotonic process/RSS growth, latency and UI degradation, and eventually crashes. Restarting the host clears symptoms but is not a lifecycle contract.

## Evidence
See `evidence/research.md`. Current August 2026 Codex reports document repeated local stdio MCP spawns within one task and a separate computer-use worker explosion ending in V8 OOM. A related browser-restore report shows persistent runtime state accumulating without eviction.

## Existing approach
Typical workarounds are application restart, disabling a plugin/driver, trusting parent-process exit, or ad-hoc OS cleanup.

## Existing limitations
Those approaches do not prevent leaks during long sessions, cannot safely distinguish agent-owned processes from unrelated processes, and provide no measurable regression gate. Per-turn isolation may itself create duplicates when disposal is incomplete.

## Proposed improvement
Give every spawned runtime an explicit ownership identity and lifecycle. Register owner + runtime key + PID + start time, reuse equivalent healthy runtimes when safe, enforce budgets, reconcile on terminal/restore events, gracefully stop stale owned resources, and only force-stop identity-matching survivors after a bounded grace period.

## Architecture
- `skills/runtime-lifecycle-analysis.md` defines baseline, ownership, reuse, and reconciliation procedure.
- `rules/runtime-ownership-rules.md` makes process identity and cleanup safety enforceable.
- `subagents/runtime-lifecycle-verifier.md` independently verifies the implementation.
- `workflows/runtime-reconcile-and-benchmark.md` provides the bounded measure/diagnose/optimize/re-measure loop.
- `hooks/owner-terminal-reconciliation.md` blocks completion when terminal owners retain children.
- `scripts/runtime_reaper.py` deterministically audits registry/process snapshots and emits a non-destructive cleanup plan.
- `tests/test_runtime_reaper.py` covers terminal survivors, PID reuse, shared ownership, duplicates, and invalid registry input.

## Package tree
```text
README.md
evidence/research.md
skills/runtime-lifecycle-analysis.md
rules/runtime-ownership-rules.md
subagents/runtime-lifecycle-verifier.md
workflows/runtime-reconcile-and-benchmark.md
hooks/owner-terminal-reconciliation.md
scripts/runtime_reaper.py
tests/test_runtime_reaper.py
```

## Installation
Python 3.10+; no third-party dependencies. Copy the package into the agent host repository. Wire the host spawn path to produce a registry snapshot and the process observer to produce a current process snapshot.

## Snapshot format
Registry example:
```json
[
  {
    "owner": "task-123",
    "runtime_key": "mcp:mail:config-sha256",
    "pid": 4567,
    "start_time": "2026-08-20T02:00:00Z",
    "shared": false,
    "owner_terminal": true
  }
]
```

Process snapshot example:
```json
[
  {"pid": 4567, "start_time": "2026-08-20T02:00:00Z", "rss_bytes": 67108864}
]
```

Do not include environment values or secret-bearing command arguments.

## Usage
Audit a terminal owner:
```bash
python3 scripts/runtime_reaper.py audit \
  --registry runtime-registry.json \
  --processes process-snapshot.json \
  --owner task-123 \
  --require-terminal-clean
```

Emit a non-destructive cleanup plan:
```bash
python3 scripts/runtime_reaper.py plan \
  --registry runtime-registry.json \
  --processes process-snapshot.json \
  --owner task-123
```

Run deterministic tests:
```bash
python3 -m unittest tests/test_runtime_reaper.py
```

## Configuration
Define host-specific soft/hard budgets for owned process count and RSS, a graceful shutdown deadline, runtime reuse-key construction, shareability rules, and restore-state TTL. Budgets must be based on measured workload characteristics rather than chosen only to make tests pass.

## Workflow
Follow `workflows/runtime-reconcile-and-benchmark.md`: Observe → measure repeated-turn baseline → diagnose ownership/leak path → form a measurable hypothesis → implement lifecycle ownership/reuse/cleanup → measure again → bounded retry if not improved → independent verification.

## Metrics
Track owned process count, terminal-owner orphan count, duplicate runtime keys, spawn/reuse ratio, RSS slope across repeated turns, graceful cleanup rate, forced termination count, p95 tool latency, and task success rate.

## Verification
Use the same representative N-turn scenario before and after. Verification requires zero owned non-shared survivors for terminal owners after grace, no PID-reused process in cleanup plans, bounded process/RSS growth, no unrelated-process targeting, passing unit tests, and no material task-success regression.

## Safety
The included script never kills anything. Cleanup execution belongs in the host lifecycle manager after it validates the plan against its live ownership registry. Never kill by executable name, command substring, or parent PID alone. Require explicit human approval for cleanup beyond registered agent-owned process identities.

## Failure handling
Detection comes from audit exit codes, budget breaches, and benchmark drift. Retry process observation once and graceful cleanup once. Maximum two remediation cycles are allowed. On ownership uncertainty, leave the process untouched, block new spawns if the hard budget can safely do so, preserve sanitized evidence, and escalate.

## Implemented / Measured / Verified
- **Implemented:** ownership registration, reuse/budget gate, reconciliation hook, and tests are integrated into the target host.
- **Measured:** before/after N-turn metrics have been captured.
- **Verified:** independent verifier confirms lifecycle invariants and task correctness.

Do not report Verified merely because package files exist.

## Definition of Done
Evidence documented; baseline captured; root cause identified; lifecycle guard integrated; tests pass; same-scenario before/after comparison completed; runtime growth is bounded; terminal-owner orphans are zero; PID-reuse safety passes; no unrelated processes are touched; independent verification returns PASS; residual risks are documented.

## Customization
Replace JSON snapshots with your process API or telemetry backend while preserving the identity model. Add platform-specific observation adapters for Windows/macOS/Linux. The deterministic script intentionally remains non-destructive so it can be reused in CI and pre-completion hooks.