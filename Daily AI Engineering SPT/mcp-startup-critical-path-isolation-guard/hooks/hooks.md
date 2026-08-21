# Hooks

## Hook 1 — Pre-start Policy Validation

**Trigger:** application process begins or MCP configuration changes.

**Action:** validate that every enabled server has a startup class, timeout, retry bound, and capability mapping.

**Command/script:**
`python scripts/readiness_gate.py validate-policy --policy config/policy.json`

**Expected result:** exit 0 and structured `policy_valid=true`.

**Failure behavior:** fail configuration load before spawning MCP processes. Do not infer defaults for unknown classes.

---

## Hook 2 — Core Readiness Stopwatch

**Trigger:** process start.

**Action:** emit monotonic timestamps for `process_start`, `core_ready`, `first_prompt_accepted`, and `first_useful_turn`.

**Command/script:** runtime instrumentation; export benchmark JSON consumed by `scripts/benchmark_startup.py`.

**Expected result:** all mandatory timestamps exist and are monotonic.

**Failure behavior:** mark measurement invalid; do not claim performance improvement.

---

## Hook 3 — MCP Initializer Admission

**Trigger:** before any MCP server initializer starts.

**Action:** resolve server class and current state, enforce bounded initializer concurrency, prevent duplicate start for an already-starting server, and attach deadline/retry metadata.

**Command/script:** runtime wrapper around MCP client initialization.

**Expected result:** initializer count is at or below `max_parallel_initializers`; `on_demand` server is admitted only after capability demand.

**Failure behavior:** reject the initializer and emit a policy violation. Never bypass the semaphore to avoid waiting.

---

## Hook 4 — Optional Failure Isolation

**Trigger:** background or on-demand server timeout/startup failure.

**Action:** transition server to `cooldown` or `failed`, emit degraded-capability event, and verify global state remains `core_ready`/`degraded_ready` rather than reverting to `starting`.

**Expected result:** session remains usable and the failed server does not extend core readiness.

**Failure behavior:** if global readiness regresses because of optional failure, record `optional_block_count += 1` and fail the regression gate.

---

## Hook 5 — Required Failure Boundary

**Trigger:** required server cannot initialize within its deadline.

**Action:** emit `failed_required` with server name and sanitized reason.

**Expected result:** no `fully_ready` state is emitted.

**Failure behavior:** fail closed according to product correctness/safety requirements. Do not silently reclassify the server.

---

## Hook 6 — Post-change Benchmark

**Trigger:** startup/MCP orchestration changes pass unit tests.

**Action:** run repeated cold/warm launch benchmark and fault-injection scenarios.

**Command/script:**
`python scripts/benchmark_startup.py --command '<application-start-command>' --runs 7 --mode cold --out candidate-cold.json`

**Expected result:** valid run distribution and environment metadata.

**Failure behavior:** one benchmark rerun allowed for environmental noise; persistent failure blocks verification.

---

## Hook 7 — Final Regression Verification

**Trigger:** candidate benchmark artifacts exist.

**Action:** compare candidate metrics and invariants to baseline/policy.

**Command/script:**
`python scripts/readiness_gate.py compare --policy config/policy.json --baseline baseline.json --candidate candidate.json`

**Expected result:** exit 0 with no SLO, optional-block, retry, or concurrency violation.

**Failure behavior:** block release; no automatic threshold relaxation.
