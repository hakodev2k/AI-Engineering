# Subagents

## Startup Evidence Analyst

### Mission
Establish whether MCP/connectors are actually on the startup critical path and quantify the delay before anyone changes orchestration.

### Responsibility
- Collect public and local evidence.
- Separate cold/warm runs.
- Attribute latency to core, transport, auth, initialize, and discovery phases.
- Build the required/optional dependency table.

### Inputs
Startup traces, MCP inventory, benchmark outputs, product readiness requirements.

### Required context
Definition of the earliest safe/useful user interaction.

### Allowed tools
Read-only logs, tracing, process metrics, benchmark scripts, repository search.

### Forbidden actions
No production config mutation, no disabling security controls, no credential inspection beyond redacted metadata.

### Expected output
Facts, measurements, candidate classifications, uncertainty, and evidence links.

### Completion criteria
At least five cold and five warm samples, a phase attribution, and no unsupported performance conclusion.

### Handoff target
Startup Planner.

---

## Startup Planner

### Mission
Convert evidence into a dependency-aware readiness plan.

### Responsibility
- Classify servers.
- Define state transitions and readiness barrier.
- Define concurrency, timeout, retry, cooldown, and SLO values.
- Identify shared dependencies.

### Inputs
Evidence Analyst output and `config/policy.json`.

### Required context
Which capabilities are mandatory for correctness/security.

### Allowed tools
Architecture docs, config files, state diagrams, policy evaluator.

### Forbidden actions
Must not mark a mandatory safety/auth dependency optional solely for latency.

### Expected output
Implementation-ready plan with assumptions and rollback point.

### Completion criteria
Every server has a class and every loop has a bound.

### Handoff target
Implementation Agent.

---

## Implementation Agent

### Mission
Implement critical-path isolation with minimum unrelated change.

### Responsibility
- Add per-server state.
- Introduce bounded initialization scheduling.
- Isolate the required readiness barrier.
- Add instrumentation and incremental tool registration.
- Implement cooldown/retry logic.

### Inputs
Approved plan and repository source.

### Required context
Framework-specific MCP client lifecycle and startup entrypoints.

### Allowed tools
Source edit, build, unit tests, local benchmark.

### Forbidden actions
No weakening of auth/security, no unbounded retry, no unrelated architecture rewrite.

### Expected output
Patch plus test/metric artifacts.

### Completion criteria
Build/tests pass and all planned observability points exist.

### Handoff target
Independent Performance Verifier.

---

## Independent Performance Verifier

### Mission
Verify that the change improves the intended metric without hiding required failures or creating resource regressions.

### Responsibility
- Run cold/warm benchmarks.
- Inject slow/unavailable optional servers.
- Inject required-server failure.
- Compare p50/p95 and process/CPU/memory behavior.
- Check rules and stop conditions.

### Inputs
Baseline, candidate build, policy, test scenarios.

### Required context
Verifier must not be the sole implementation author.

### Allowed tools
Benchmark, fault injection, readiness gate, logs/metrics.

### Forbidden actions
No threshold relaxation to force a pass; no class changes during verification.

### Expected output
`Implemented`, `Measured`, and `Verified` status with exact evidence.

### Completion criteria
All required gates pass or blocking failure is documented.

### Handoff target
Release owner/human approver when needed.
