# Workflows

## Workflow A — Measure → Diagnose → Isolate → Verify

### Trigger
Startup/first-turn latency is high or MCP timeout warnings are observed.

### Goal
Remove optional MCP work from the core critical path without hiding required failures.

### Inputs
MCP inventory, policy, startup traces, benchmark command.

### Baseline
Collect at least five cold and five warm runs. Record core-ready, first-prompt, first-useful-turn, per-server phase timings, retries, process count, CPU and memory where available.

### Context
Required means the session cannot produce a safe/correct first valid turn without that capability. Convenience does not make a server required.

### Stages
1. **Observe** — Startup Evidence Analyst captures phase timings.
2. **Classify** — Startup Planner labels each server required/background/on-demand/disabled.
3. **Hypothesize** — Identify the server or shared dependency causing the critical-path delay.
4. **Design** — Build separate core and integration readiness barriers.
5. **Implement** — Implementation Agent adds state machine, bounded scheduler, deadlines, cooldowns and metrics.
6. **Measure again** — Repeat identical benchmark scenarios.
7. **Fault inject** — Delay and fail optional servers; then fail one required server.
8. **Gate** — Independent Performance Verifier compares candidate to baseline and policy.

### Responsible agents
Evidence Analyst → Planner → Implementation Agent → Independent Performance Verifier.

### Tools
`benchmark_startup.py`, `readiness_gate.py`, application logs/traces, process metrics.

### Outputs
Baseline JSON, candidate JSON, classification, implementation change, gate result.

### Checkpoints
- C1: baseline reproducible.
- C2: classification approved.
- C3: no mandatory control moved out of required barrier.
- C4: optional failures do not block core readiness.
- C5: required failures remain visible.

### Metrics
Core-ready p50/p95/p99, first-prompt latency, first-useful-turn latency, initialize/discover latency, timeout/retry count, peak initializers, process count.

### Retry policy
One measurement rerun for environmental noise. At most two implementation iterations before re-diagnosis.

### Stop conditions
Stop if baseline is not reproducible, classifications are ambiguous, a safety/correctness dependency would be weakened, or second candidate still fails the gate.

### Failure path
Return to diagnosis using phase traces. Do not increase all timeouts as a blanket fallback.

### Verification
Slow/unavailable optional MCP scenarios preserve core SLO; required failure produces required failure state; candidate p95 does not regress beyond threshold.

### Definition of Done
Evidence exists, baseline and post-change metrics exist, policy invariants pass, fault injection passes, and independent verifier records `Verified`.

---

## Workflow B — On-Demand MCP Activation

### Trigger
A routed task requests a capability hosted by an `on_demand` server.

### Goal
Start only the server needed for the current capability while bounding user-visible delay.

### Inputs
Capability name, server map, current state, timeout/retry policy.

### Baseline
Before demand, on-demand server process count must be zero unless explicitly prewarmed.

### Stages
1. Router resolves capability → server.
2. If server is `ready`, call it immediately.
3. If server is `starting`, join the existing initialization future; do not spawn a duplicate.
4. If server is `cooldown`, fail fast with degraded-capability status and next retry time.
5. If `not_started`, acquire initializer semaphore and begin startup.
6. Enforce server deadline.
7. On success, atomically register discovered tools and transition to ready.
8. On failure, retry at most policy maximum, then enter cooldown.
9. Return an explicit capability-unavailable result if startup cannot complete.

### Responsible agent
Runtime orchestrator; verifier checks implementation.

### Tools
Async semaphore, per-server state/lock, timer/metrics.

### Outputs
Ready tool call or explicit degraded result.

### Checkpoints
Single-flight initialization, deadline present, no duplicate process launch.

### Metrics
Demand-to-ready latency, duplicate-start count, timeout count, recovery rate.

### Retry policy
Maximum from policy, with backoff. Never unlimited.

### Stop conditions
Stop initialization at deadline or when session is cancelled.

### Failure path
Cooldown and explicit unavailable result; no global session restart.

### Verification
Concurrent demand for the same cold server creates one initializer only.

### Definition of Done
Capability is available or fails explicitly within bounded time and no unrelated server starts.

---

## Workflow C — Startup Regression Gate

### Trigger
MCP client, connector, config merge, auth startup, package launch, or orchestration code changes.

### Goal
Detect re-coupling of optional work to core startup.

### Inputs
Approved baseline JSON, candidate benchmark JSON, policy.

### Stages
1. Validate compatible benchmark scenario identifiers.
2. Calculate candidate p95 core-ready.
3. Compare to SLO and allowed regression percentage.
4. Check `optional_block_count` equals zero.
5. Check peak initializers against concurrency bound.
6. Check retries per server against retry bound.
7. Require fault-injection scenario evidence.
8. Emit pass/fail JSON and exit code.

### Retry policy
One rerun for benchmark noise.

### Stop conditions
Any invariant violation blocks release until diagnosed.

### Definition of Done
Gate passes without threshold weakening and evidence is archived.
