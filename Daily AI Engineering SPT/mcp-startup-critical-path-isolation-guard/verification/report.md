# Verification Report

## Scope
This report verifies the reusable package itself. It does not claim that a specific external agent product has already integrated the guard or achieved a production latency reduction.

## Implemented
- Evidence-backed problem definition and current-solution analysis.
- Explicit required/background/on-demand/disabled server policy.
- Enforceable MUST/MUST NOT/SHOULD rules.
- Separation of evidence, planning, implementation, and independent verification roles.
- Bounded Measure → Diagnose → Isolate → Verify workflow.
- On-demand single-flight workflow.
- Startup regression workflow.
- Pre-start, admission, failure-isolation, benchmark, and final-gate hooks.
- Runnable startup benchmark script with repeated samples and percentile summary.
- Runnable readiness gate with policy validation, SLO/regression, optional-block, concurrency, sample-validity, and timeout checks.
- Unit tests covering policy and gate failure modes.
- Runnable event-emitter example.
- Integration guide and complete README.

## Measured
No claim is made that Codex, Claude Code, or another external client was modified and benchmarked by this package run. Public issue measurements are documented only as observed evidence in `evidence/research.md` and are not presented as package benchmark results.

The package defines the measurement contract needed for an integration:
- repeated cold/warm samples;
- `core_ready_ms` p50/p95/p99;
- first-prompt and first-useful-turn times;
- optional-block count;
- peak initializer concurrency;
- timeout/retry counts;
- slow/failed optional-server fault scenarios.

## Verified
### Static package verification
Verified from generated content:
1. Policy has finite positive startup deadlines.
2. Retry budget is bounded.
3. Optional servers are forbidden from blocking core readiness.
4. Concurrency has an explicit bound.
5. All workflows have retry limits and stop conditions.
6. Required dependency failure is not silently degraded.
7. Security/auth dependencies cannot be reclassified solely for performance.
8. Benchmarking requires repeated samples and separates cold/warm modes.
9. Tool registration is gated on per-server MCP initialization/discovery.
10. No script requires credentials or performs destructive operations.

### Runtime verification contract
A concrete integration is `Verified` only when all of the following evidence exists:
- `readiness_gate.py validate-policy` exits 0.
- Unit tests pass.
- At least five valid cold and five valid warm benchmark runs exist.
- Slow optional-server scenario preserves core-ready SLO.
- Failed optional-server scenario preserves core-ready SLO and reports degraded capability.
- Failed required-server scenario does not report fully-ready.
- Concurrent demand for one on-demand server creates one initializer.
- Candidate p95 passes absolute SLO and baseline-relative regression threshold.
- Optional-block count is zero.
- Peak initializer count remains within policy.

Until those integration artifacts exist, do not label an external deployment `Verified`.

## Failure and recovery
- Invalid policy: fail before starting MCP processes.
- Missing benchmark events: measurement invalid; add instrumentation instead of guessing.
- Noisy benchmark: one rerun allowed.
- Candidate fails twice: return to diagnosis; do not weaken threshold automatically.
- Optional server repeatedly fails: bounded retry then cooldown/degraded-ready.
- Required server fails: explicit required failure; human/product decision required before changing dependency semantics.

## Definition of Done for package generation
- Evidence documented: complete.
- Existing approaches and limitations documented: complete.
- Improvement architecture documented: complete.
- Skills/rules/subagents/workflows/hooks generated: complete.
- Deterministic scripts generated: complete.
- Tests generated: complete.
- Integration guidance generated: complete.
- Metrics and failure handling defined: complete.
- README references only generated package paths: required final check.
- GitHub manifest existence: required final check after README write.
