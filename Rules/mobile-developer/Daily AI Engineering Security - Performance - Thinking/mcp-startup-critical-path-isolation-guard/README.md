# MCP Startup Critical-Path Isolation Guard

## Topic
Prevent optional MCP server startup, authentication, connector hydration, and tool discovery from blocking an AI agent's core startup or first usable turn.

## Category
Performance.

## Problem
Modern AI coding and agent clients can initialize many MCP servers during startup. When readiness is modeled as “all configured integrations must be ready,” a single slow, unauthenticated, unreachable, or expensive optional server can delay the entire session. The problem worsens when several integrations share a failing dependency such as VPN, proxy, DNS, OAuth, browser runtime, or package-manager cache.

## Evidence
Current public signals are documented in `evidence/research.md`. Relevant 2026 reports include multiple OpenAI Codex issues describing startup/first-turn delays around MCP initialization and tool discovery, plus a Claude Code issue showing reconnect/startup availability and concurrent `npx` startup problems. The MCP lifecycle specification requires correct initialization for each server connection but does not require unrelated servers to block application readiness.

## Existing approach
Common approaches today include increasing MCP startup timeouts, disabling integrations manually, launching all servers concurrently, retrying failed servers, and removing expensive integrations from default configuration.

## Existing limitations
- A larger timeout can make unreachable-server latency worse.
- Parallel startup still blocks on the slowest server if the readiness barrier waits for all of them.
- Manual enable/disable does not adapt to task demand.
- Uncoordinated retries can amplify process/network load.
- Shared VPN/DNS/proxy/auth failures can trigger many redundant timeouts.
- Binary readiness hides the difference between core readiness and optional capability readiness.
- Without phase metrics, teams can optimize the wrong component or claim gains from noisy single runs.

## Proposed improvement
Use dependency-aware incremental readiness:

1. Classify every server as `required`, `background`, `on_demand`, or `disabled`.
2. Put only required servers in the core readiness barrier.
3. Start background servers after core readiness under bounded concurrency.
4. Start on-demand servers only when capability routing actually needs them.
5. Use single-flight initialization per server so concurrent demand does not spawn duplicates.
6. Enforce per-server deadlines, bounded retries, backoff, and cooldown.
7. Register tools atomically only after MCP initialization/discovery succeeds.
8. Represent optional failure as degraded capability instead of global startup failure.
9. Measure cold/warm startup and fail regressions automatically.

## Architecture

```text
                     +----------------------+
process start ------>| Core Initialization  |
                     +----------+-----------+
                                |
              +-----------------+-----------------+
              |                                   |
      required MCP barrier                 optional scheduler
              |                                   |
     all required ready?                  bounded concurrency
        | yes       | no                  /               \
        v           v              background          on-demand
   core_ready   failed_required           |                |
        |                               ready/fail      capability demand
        |                                   |                |
        +-----------------> degraded_ready <+                v
        |                                                   ready/fail
        +-------------------- when all enabled optional ready -----+
                                                                   v
                                                              fully_ready
```

Per-server state:

```text
not_started -> starting -> ready
                  |
                  +-> failed -> cooldown -> not_started
```

The runtime maintains a single initializer future/task per server and a global semaphore limiting simultaneous starts.

## Package structure

```text
mcp-startup-critical-path-isolation-guard/
├── README.md
├── guide-intergration.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── examples/
│   └── startup_event_emitter.py
├── hooks/
│   └── hooks.md
├── rules/
│   └── engineering-rules.md
├── scripts/
│   ├── benchmark_startup.py
│   └── readiness_gate.py
├── skills/
│   └── core-skills.md
├── subagents/
│   └── subagents.md
├── tests/
│   └── test_readiness_gate.py
├── verification/
│   └── report.md
└── workflows/
    └── workflows.md
```

## Installation
No third-party Python dependency is required for the included scripts.

Requirements:
- Python 3.10+ recommended.
- An MCP-capable host application that can emit startup events or equivalent metric artifacts.

Clone/copy this package into the target engineering repository, then adapt `config/policy.json` to the real MCP inventory.

## Configuration
Key values in `config/policy.json`:

- `core_ready_slo_ms`: absolute core-readiness SLO.
- `core_ready_regression_percent`: maximum allowed p95 regression versus approved baseline.
- `max_parallel_initializers`: global concurrency limit.
- `default_*_timeout_ms`: class-specific startup deadlines.
- `max_retries_per_server`: bounded retry count.
- `retry_backoff_ms`: retry delay.
- `failure_cooldown_ms`: failed optional-server cooldown.
- `optional_servers_may_block_core_ready`: intentionally fixed to `false` by the gate.
- `servers`: explicit server classification and capability mapping.

The example server entries are templates and should be replaced with real integrations.

## Usage

### Validate policy

```bash
python scripts/readiness_gate.py validate-policy --policy config/policy.json
```

### Verify the event contract with the included example

```bash
python examples/startup_event_emitter.py
```

### Benchmark an instrumented command

```bash
python scripts/benchmark_startup.py \
  --command 'python examples/startup_event_emitter.py' \
  --runs 7 \
  --mode cold \
  --scenario normal \
  --out baseline.json
```

For real adoption, replace the example command with the actual agent/client startup command.

### Compare candidate to baseline

```bash
python scripts/readiness_gate.py compare \
  --policy config/policy.json \
  --baseline baseline.json \
  --candidate candidate.json
```

Exit codes:
- `0`: pass.
- `2`: invalid policy/input.
- `3`: performance/invariant failure.

### Run unit tests

```bash
python -m unittest tests/test_readiness_gate.py -v
```

## Startup event contract
The benchmark script recognizes lines prefixed with:

```text
MCP_STARTUP_EVENT 
```

followed by JSON. Important events include:
- `process_start`;
- `core_ready`;
- `first_prompt_accepted`;
- `first_useful_turn`;
- `fully_ready`;
- `initializer_count` with numeric `count`;
- `optional_block` with numeric `count`;
- optional per-server events such as `mcp_ready`.

Use monotonic timing in the host. Never put credentials or tokens in event payloads.

## Workflow
The primary workflow in `workflows/workflows.md` is:

```text
Observe
  -> Baseline
  -> Classify dependencies
  -> Diagnose critical path
  -> Hypothesis
  -> Isolate optional startup
  -> Measure again
  -> Fault inject
  -> Regression gate
  -> Independent verification
```

Retries are bounded, and after two failed implementation iterations the workflow returns to diagnosis instead of repeatedly tuning timeouts.

## Metrics
Always establish a baseline before optimization.

Required metrics:
- `core_ready_ms` p50/p95/p99;
- `first_prompt_accepted_ms`;
- `first_useful_turn_ms`;
- per-server process-start / initialize / auth / discovery latency;
- timeout count;
- retry count;
- optional-block count;
- peak concurrent initializers;
- degraded-ready rate;
- later optional-server recovery rate;
- on-demand cold-start rate;
- CPU/memory/process count when parallelism changes materially.

A lower `fully_ready` time is useful but secondary. The central invariant is that an optional dependency cannot control `core_ready`.

## Verification
`verification/report.md` distinguishes package implementation from a real external deployment benchmark.

A concrete integration is verified only when:
1. policy validation passes;
2. unit tests pass;
3. repeated cold and warm baseline/candidate samples exist;
4. slow and failed optional servers preserve core readiness;
5. required-server failure remains explicit;
6. single-flight on-demand initialization is demonstrated;
7. core-ready p95 passes both absolute SLO and baseline-relative threshold;
8. optional-block count is zero;
9. concurrency/retry bounds hold.

Never claim performance improvement without measurements.

## Safety
Performance isolation must not weaken security or correctness.

- Authentication, authorization, policy, or mandatory integrity dependencies remain required when the first valid turn depends on them.
- A required failure must never be converted silently into degraded-ready for latency.
- Tools must not be exposed before their server is initialized and discovered.
- Startup traces must not contain secrets.
- Retries and process spawning must be bounded.
- Human approval is required before changing a dependency classification that affects security, authorization, destructive-action protection, or data integrity.

## Failure handling

### Optional server timeout
Detection: startup deadline exceeded.

Evidence: sanitized server phase/timing and dependency fingerprint.

Retry policy: at most `max_retries_per_server`.

Fallback: cooldown + degraded capability.

Escalation: alert when failure rate/recovery rate crosses operational threshold.

Stop condition: retry budget exhausted.

### Required server timeout
Detection: required server cannot reach ready state within deadline.

Fallback: none that changes correctness semantics automatically.

Escalation: explicit `failed_required`; human/product decision if the dependency definition should change.

### Benchmark noise
Retry policy: one rerun.

Stop condition: second inconsistent/failing run set triggers diagnosis; do not weaken gate thresholds.

### Shared dependency failure
Correlate multiple affected servers by VPN/DNS/proxy/OAuth/package-cache dependency, suppress retry storms, and retain degraded-ready when only optional integrations are affected.

## Definition of Done
A production integration is done only when all of these are true:
- real public/problem evidence documented;
- baseline captured;
- server classification reviewed;
- current limitation documented;
- optional startup removed from the core barrier;
- bounded concurrency/retries implemented;
- observability added;
- cold/warm candidate metrics collected;
- slow/failed optional fault tests pass;
- required failure test passes;
- regression comparison passes;
- risks documented;
- required approval obtained for any security/correctness classification change;
- independent verification complete;
- no blocking issue remains.

## Customization
Adapt the policy and hooks to the host framework without changing the core invariants.

Useful extensions include:
- different SLOs by machine/environment class;
- adaptive prewarming based on recent tool demand;
- dependency-aware circuit breakers for shared gateways/VPNs;
- cached non-secret discovery metadata with version/config invalidation;
- OpenTelemetry spans for startup phases;
- dashboards for degraded-ready and recovery rates;
- separate local-process and remote-HTTP concurrency pools.

Do not optimize by simply raising timeouts, eagerly prewarming every integration, or disabling verification.

## Sources
See `evidence/research.md` for dated GitHub issue evidence and the MCP lifecycle specification links used for this package.
