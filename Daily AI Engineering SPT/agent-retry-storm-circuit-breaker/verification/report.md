# Verification Report

## Verification model

This package separates **Implemented**, **Measured**, and **Verified**.

### Implemented

The package includes:

- current evidence and existing-solution analysis;
- deterministic logical-operation fingerprinting;
- bounded retry decision logic;
- attempt/run/time/token/no-progress budgets;
- fail-fast classes;
- side-effect idempotency gate;
- circuit-open behavior;
- jittered exponential backoff calculation;
- trace amplification analyzer;
- progress-aware watchdog procedure;
- integration hooks, workflows, rules, subagent separation, and regression tests.

### Measured

Package-level deterministic behavior can be measured with the included tests and trace analyzer. Production performance improvement is **not** claimed until the target agent runtime captures a baseline and a guarded canary.

Required runtime measurements:

1. physical attempts;
2. logical operations;
3. retry amplification factor;
4. no-progress duplicate attempts;
5. estimated retry tokens;
6. retry wall-clock time;
7. transient recovery rate;
8. circuit-open count;
9. false-open review count;
10. restart-from-zero count and checkpoint reuse.

### Verified

Run:

```bash
python -m unittest tests/test_retry_guard.py
```

The test suite covers stable fingerprinting, materially different arguments, transient retry, non-retryable failure, unknown failure, attempt/run/time/token/no-progress budget exhaustion, side-effect idempotency requirements, and already-open circuits.

Run the trace analyzer on a known fixture or captured baseline:

```bash
python scripts/analyze_retry_trace.py retry-trace.jsonl --output retry-report.json
```

The runtime integration is verified only when:

- the guard executes before every orchestration-layer retry;
- counters persist across model turns/subagent restarts;
- SDK retry ownership is documented;
- non-retryable errors do not loop;
- side effects are not automatically replayed without stable idempotency;
- no-progress repeated calls open the circuit at policy threshold;
- progress-aware watchdog fixtures distinguish active progress from a true stall;
- guarded canary reduces amplification/token/time waste versus baseline;
- transient recovery rate stays within the team's accepted regression tolerance.

## Suggested acceptance thresholds

These are starting gates, not universal performance claims:

- 100% of configured non-retryable fixture failures fail fast;
- 100% of side-effect retry fixtures without an idempotency key require approval;
- 100% of retry budget boundary fixtures open the circuit;
- zero retry counter resets across child/session restart tests;
- zero unbounded retry loops in fault-injection tests;
- lower retry amplification factor on at least one representative historical storm trace;
- no unexplained loss of transient recovery in canary.

## Failure handling

If a verification check fails:

1. preserve raw trace and guard decision output;
2. identify the exact policy or integration invariant violated;
3. allow at most two targeted remediation cycles;
4. rerun the same failing fixture plus the complete regression suite;
5. do not weaken idempotency, approval, or correctness controls to make a performance metric pass;
6. if still failing, mark rollout blocked.

## Definition of Done

The package integration is done only when baseline evidence exists, retry ownership is explicit, all required files are present, tests pass, guarded metrics are collected, comparison is complete, safety boundaries are preserved, and no blocking verification issue remains.