# Core Skills

## Skill 1 — Startup Critical-Path Audit

### Purpose
Determine which MCP operations actually delay session readiness and separate mandatory dependencies from optional integrations.

### Trigger
Use when startup, first prompt, or first useful turn is slow; when MCP timeouts appear; or before adding multiple MCP servers to a production agent.

### Inputs
- MCP server inventory and configuration.
- Startup logs/traces.
- Cold and warm startup measurements.
- Required product capabilities for the first user turn.
- Network/auth/package-manager dependencies.

### Preconditions
- At least five cold runs and five warm runs can be measured.
- Server names may be recorded, but credentials and tokens must not be logged.

### Required context
Know which capabilities are mandatory before the first user interaction and which can appear later.

### Tools
`time`, application logs, tracing/metrics, process inspection, `scripts/benchmark_startup.py`, `scripts/readiness_gate.py`.

### Procedure
1. Define timestamps for process start, core UI/CLI ready, prompt accepted, each MCP initialize start/end, discovery end, and first useful turn.
2. Collect a baseline across repeated cold and warm launches.
3. Attribute latency to phases rather than using only total startup time.
4. Build a dependency table: server, class candidate, startup command/URL, shared dependency, measured p50/p95, failure rate, and whether the first turn truly needs it.
5. Mark a server `required` only when the first valid turn cannot proceed safely/correctly without it.
6. Mark optional but commonly useful servers `background`.
7. Mark rare/expensive servers `on_demand`.
8. Mark intentionally unavailable servers `disabled`.
9. Re-run the baseline using the proposed classification.
10. Reject the optimization if optional-server failure still delays core readiness or if the change hides a genuinely required dependency.

### Decisions
- If a capability is required for correctness of every session, keep it in the required barrier.
- If absence only reduces optional functionality, it must not block core readiness.
- If startup latency is dominated by package installation or auth, fix/warm that dependency rather than merely increasing timeouts.

### Constraints
Never classify a required security/auth control as optional merely to improve latency. Never infer improvement from one run.

### Expected output
A baseline report, server classification, latency attribution, and approved readiness barrier.

### Metrics
`core_ready_ms`, `first_prompt_accepted_ms`, `first_useful_turn_ms`, per-server initialize/discover latency, timeout/retry count.

### Verification
At least five cold and five warm post-change runs; optional servers deliberately delayed or failed; core readiness remains within SLO.

### Failure handling
If instrumentation is incomplete, stop optimization and add timestamps first. Maximum two classification revisions before human review.

### Stop conditions
Stop when required/optional semantics are ambiguous, a security control would be weakened, or no reproducible bottleneck exists.

---

## Skill 2 — Incremental MCP Readiness Design

### Purpose
Design startup so the application becomes usable when its required capabilities are ready while optional tools continue initializing independently.

### Trigger
Use after the audit proves optional MCP work is on the critical path.

### Inputs
Approved server classification and policy.

### Preconditions
Each server has an explicit startup class, timeout, and capability set.

### Required context
MCP lifecycle requires each individual connection to finish initialization before normal operations on that connection; it does not require waiting for unrelated servers.

### Tools
Agent/client orchestration code, async runtime, metrics, readiness state machine.

### Procedure
1. Create per-server states: `not_started`, `starting`, `ready`, `cooldown`, `failed`, `disabled`.
2. Create global states: `starting`, `core_ready`, `degraded_ready`, `fully_ready`, `failed_required`.
3. Start required servers immediately under bounded concurrency.
4. Satisfy the core barrier only from required servers plus core application initialization.
5. After core readiness, initialize background servers without blocking prompt acceptance.
6. Do not start on-demand servers until capability routing requests them.
7. Register tools atomically only after the corresponding server has completed MCP initialization and discovery.
8. On optional failure, record failure and cooldown; keep the session usable.
9. On required failure, fail clearly if policy says the capability is mandatory. Do not silently downgrade correctness.
10. Emit state-transition metrics.

### Decisions
Use `degraded_ready` when the core is usable but one or more optional integrations are unavailable. Use `fully_ready` only when all enabled background integrations are healthy.

### Constraints
Bound parallel initialization. One failed dependency must not create unbounded retries or a process storm.

### Expected output
A deterministic readiness state machine and implementation plan.

### Metrics
Critical-path duration, concurrency peak, optional-block count, recovery rate.

### Verification
Fault-inject slow and failed optional servers and confirm prompt acceptance is unaffected within configured tolerance.

### Failure handling
Retry a server at most `max_retries_per_server`; then enter cooldown. Required failures escalate; optional failures degrade.

### Stop conditions
Stop if tool registration can occur before capability negotiation or if the client cannot represent partial readiness safely.

---

## Skill 3 — Startup Regression Verification

### Purpose
Prevent future integrations from silently re-entering the startup critical path.

### Trigger
Run in CI/nightly benchmark or whenever MCP/config/orchestration startup logic changes.

### Inputs
Approved baseline JSON and candidate measurements JSON.

### Preconditions
Same benchmark scenario and machine class, or normalized environment metadata.

### Procedure
1. Run cold/warm benchmark samples.
2. Calculate median and p95 for `core_ready_ms`.
3. Deliberately inject a slow optional server exceeding its timeout.
4. Deliberately inject a failed optional server.
5. Confirm both scenarios preserve core-ready SLO.
6. Compare p95 against approved baseline using `scripts/readiness_gate.py`.
7. Confirm required-server failure still blocks/fails according to policy.
8. Record Implemented, Measured, and Verified separately.

### Expected output
Machine-readable gate result plus human-readable comparison.

### Metrics
p50/p95/p99, regression percent, optional-block count, retries, process count.

### Verification
Gate exit code 0 and fault-injection assertions pass.

### Failure handling
One rerun is allowed for noisy infrastructure. A second failure blocks release and requires diagnosis.

### Stop conditions
Do not waive the gate by increasing timeout alone unless evidence shows the server is healthy and the SLO remains valid.
