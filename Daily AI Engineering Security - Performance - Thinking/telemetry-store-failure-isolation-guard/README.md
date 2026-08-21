# Telemetry Store Failure Isolation Guard

## Topic
Prevent non-essential diagnostic/telemetry storage from blocking AI runtime startup when it becomes slow, oversized, WAL-heavy, or corrupt.

## Category
Performance

## Problem
Agent runtimes often initialize durable state and diagnostic stores together. When a telemetry SQLite database performs expensive startup maintenance, grows to multi-GB scale, or becomes corrupt, a generic startup timeout can make the whole application unavailable even while user/thread state is healthy. Repeated restart attempts can reproduce the same heavy work indefinitely.

## Evidence
See `evidence/research.md`. Current Codex reports document both a large/slow logs database exceeding startup deadlines and a corrupt B-tree causing deterministic handshake failure with repeated WAL amplification. In both reports, isolating only the diagnostic logs restored startup without modifying conversation state.

## Existing approach
Retention, WAL checkpointing, generic startup watchdogs, manual log rotation, and SQLite integrity checks.

## Existing limitations
Telemetry maintenance may still sit on the critical path; generic deadlines do not identify the failing store; automatic retries can repeat deterministic work; file size does not distinguish health; and manual recovery is risky when store criticality or active writers are unclear.

## Proposed improvement
Classify every local store by criticality, measure per-store startup budgets, isolate non-critical telemetry when unhealthy/over-budget, fingerprint repeated failures, preserve evidence, and perform bounded recovery only after writers are quiesced. Verify performance and critical-state integrity independently.

## Architecture
- Evidence: recurring current failure signals and measurable impact.
- Skill: investigation/isolation procedure.
- Rules: criticality, retry, recovery, and verification invariants.
- Subagent: independent recovery verifier.
- Workflow: measure -> diagnose -> isolate -> recover -> benchmark -> verify.
- Hook: deterministic startup budget gate.
- Script + tests: read-only store classification and optional bounded immutable SQLite probe for smaller stores.

## Package tree
```text
README.md
evidence/research.md
skills/store-failure-isolation.md
rules/telemetry-isolation-rules.md
subagents/recovery-verifier.md
workflows/isolate-recover-benchmark.md
hooks/startup-store-budget-check.md
scripts/store_health_guard.py
tests/test_store_health_guard.py
```

## Installation
Python 3.10+ with the standard-library `sqlite3` module. No third-party dependencies.

## Configuration
Create `store-inventory.json`:
```json
{
  "stores": [
    {
      "name": "state",
      "path": "/path/to/state.sqlite",
      "critical": true,
      "health": "probe",
      "max_init_ms": 3000
    },
    {
      "name": "logs",
      "path": "/path/to/logs.sqlite",
      "critical": false,
      "health": "probe",
      "max_bytes": 1073741824,
      "max_wal_bytes": 268435456,
      "max_init_ms": 1500,
      "init_ms": 0,
      "identical_retry_count": 0
    }
  ]
}
```

For very large files the script intentionally skips `quick_check` above the default 256 MiB probe limit rather than turning startup diagnostics into another unbounded operation. Supply an externally measured health value such as `ok`, `corrupt`, `error`, or `unknown`, or raise `--probe-limit-bytes` in an offline diagnostic environment.

## Usage
```bash
python scripts/store_health_guard.py --inventory store-inventory.json
python -m unittest tests/test_store_health_guard.py
```

Exit code 1 means at least one critical store must block normal startup. Exit code 0 can mean `pass` or `degraded`; inspect the JSON status and isolate any non-critical stores marked `isolate`. Exit code 2 means invalid configuration.

## Workflow
Use `workflows/isolate-recover-benchmark.md`. Establish a baseline first. Do not claim an improvement based only on successful restart; compare startup latency, per-store work, WAL/DB growth, retry behavior, and critical-state integrity.

## Metrics
Startup p50/p95, per-store initialization milliseconds, telemetry maintenance duration, DB/WAL bytes, WAL growth per failed startup, identical retry count, fail-open activations, critical-state integrity, successful recovery rate.

## Verification
The package is **Implemented** when the guard, rules, workflow, hook, and tests exist. A host integration is **Measured** after before/after startup and store metrics are captured. It is **Verified** only when an independent verifier confirms that critical state is unchanged and startup availability/latency materially improves while unhealthy telemetry is isolated or repaired.

## Safety
The included guard never deletes, rotates, checkpoints, vacuums, or edits a database. `immutable=1` is used for optional read-only SQLite probing. Actual rotation/rebuild must be provided by the host application and must require store criticality confirmation, evidence preservation, and writer-process quiescence.

## Failure handling
Detection: store health/size/time findings or repeated failure fingerprint. Evidence: retain failing-store metadata and, where policy permits, a recoverable copy. Retry: maximum two identical automatic attempts and maximum two recovery attempts. Fallback: keep non-critical telemetry isolated/degraded while core state remains healthy. Escalation: any critical-store issue or uncertain classification. Stop: core-state health unknown, active writers prevent safe recovery, evidence preservation fails, or retry budget is exhausted.

## Definition of Done
- current evidence documented
- store inventory and criticality defined
- baseline startup metrics captured
- failing store/phase identified
- non-critical isolation behavior implemented
- identical failure retry loop bounded
- recovery evidence preserved
- before/after measurements captured
- core-state integrity unchanged
- telemetry health passes or remains explicitly isolated
- independent verifier approves
- no blocking critical-store issue remains

## Customization
Add store-specific budgets, failure fingerprints, startup phases, and host recovery actions. Keep the core invariant: diagnostic storage can degrade observability, but it must not silently inherit the durability or availability semantics of critical user state.