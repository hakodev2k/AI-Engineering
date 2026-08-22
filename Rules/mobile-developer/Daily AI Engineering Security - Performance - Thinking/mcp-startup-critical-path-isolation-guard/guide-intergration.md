# Integration Guide

## Goal
Integrate the package into an MCP-capable agent/client so optional MCP startup cannot delay the core session while required dependencies remain fail-closed.

## 1. Add the policy
Copy `config/policy.json` into the host project and replace the example servers with the real inventory.

For each server choose exactly one class:
- `required`: first valid turn is unsafe/incorrect without it.
- `background`: useful frequently, but the session can start without it.
- `on_demand`: start only when capability routing requires it.
- `disabled`: never initialize.

Do not use `required` as a synonym for “nice to have,” and do not move authorization/security dependencies out of the required barrier to improve latency.

## 2. Instrument startup
Emit monotonic events equivalent to the contract consumed by `scripts/benchmark_startup.py`:

```text
MCP_STARTUP_EVENT {"event":"process_start","elapsed_ms":0}
MCP_STARTUP_EVENT {"event":"initializer_count","count":2,"elapsed_ms":120}
MCP_STARTUP_EVENT {"event":"core_ready","elapsed_ms":430}
MCP_STARTUP_EVENT {"event":"first_prompt_accepted","elapsed_ms":455}
MCP_STARTUP_EVENT {"event":"mcp_ready","server":"github","elapsed_ms":820}
MCP_STARTUP_EVENT {"event":"fully_ready","elapsed_ms":1100}
```

Never emit tokens or secrets. Use server identifiers and sanitized error classes only.

## 3. Implement the readiness state machine
Maintain per-server state:

```text
not_started -> starting -> ready
                   |          |
                   v          v
                failed     disconnected
                   |
                   v
                cooldown -> not_started
```

Maintain global state:

```text
starting
  | all required ready
  v
core_ready / degraded_ready
  | all enabled background ready
  v
fully_ready

required failure -> failed_required
```

`core_ready` must never wait for background or on-demand servers.

## 4. Use bounded single-flight initialization
Use one async task/future per server and a global semaphore capped at `max_parallel_initializers`.

Pseudocode:

```text
ensure_server(name):
  state = states[name]
  if state == ready: return existing client
  if state == starting: return await existing future
  if state == cooldown and now < retry_after: fail fast
  acquire initializer semaphore
  atomically transition not_started/cooldown -> starting
  launch exactly one initializer with deadline
  on success: register tools atomically, mark ready
  on failure: bounded retry, then cooldown/failed
```

Concurrent capability requests for the same cold server must join the same initializer rather than spawn duplicates.

## 5. Separate core and integration barriers
Start required servers together with core initialization. Await only those required dependencies before marking the session ready.

Immediately after core readiness, schedule background servers. Do not await that batch from the prompt-accepting path.

On-demand servers remain stopped until the capability router selects one of their tools/resources.

## 6. Handle shared dependency failures
Group servers by shared dependencies such as:
- VPN/network route;
- DNS/proxy;
- OAuth provider;
- browser runtime;
- npm/pnpm cache;
- local gateway.

If several servers fail with the same dependency fingerprint, suppress independent aggressive retries. Record one correlated incident and place affected optional servers into cooldown.

## 7. Baseline before optimization
Run at least five cold and five warm measurements using the same scenario.

Example:

```bash
python scripts/benchmark_startup.py \
  --command 'python examples/startup_event_emitter.py' \
  --runs 7 \
  --mode cold \
  --scenario normal \
  --out baseline.json
```

Production integrations should benchmark the real agent command instead of the example emitter.

## 8. Fault injection
Create three scenarios:

1. `slow-optional`: background server takes longer than its configured deadline.
2. `failed-optional`: background server is unreachable/auth-invalid.
3. `failed-required`: required server cannot initialize.

Expected behavior:
- scenarios 1 and 2: core readiness stays within SLO; session becomes degraded-ready.
- scenario 3: required failure is explicit and no fully-ready state is emitted.

Also test concurrent demand for one on-demand server and confirm a single process/connection is created.

## 9. Run the regression gate
Validate policy:

```bash
python scripts/readiness_gate.py validate-policy --policy config/policy.json
```

Compare candidate with approved baseline:

```bash
python scripts/readiness_gate.py compare \
  --policy config/policy.json \
  --baseline baseline.json \
  --candidate candidate.json
```

Exit code `0` means gate pass; `2` means invalid input/policy; `3` means a performance/invariant failure.

## 10. Operational metrics
Expose at minimum:
- core-ready histogram;
- first-prompt and first-useful-turn histogram;
- initialize/auth/discovery histogram per server;
- state transitions;
- timeout/retry counts;
- peak concurrent initializers;
- degraded-ready sessions;
- optional-block count;
- on-demand cold-start rate.

Alert if `optional_block_count > 0`, required-server failure rate rises, or core-ready p95 exceeds approved threshold.

## 11. Rollout
1. Instrument only and collect baseline.
2. Classify servers without changing behavior.
3. Isolate one optional server first.
4. Run fault-injection and compare metrics.
5. Expand to remaining optional servers.
6. Add on-demand activation for rare integrations.
7. Keep rollback as configuration/state-machine switch, not a removal of observability.

## Safety boundaries
- Required security/auth/integrity dependencies remain required.
- Never suppress a real required failure to obtain a faster startup metric.
- Never expose a tool before its server has completed initialization and discovery.
- Never log secrets in performance traces.
- Never retry indefinitely.

## Definition of integration done
The integration is complete only when cold/warm baselines exist, optional fault injection preserves core readiness, required failure remains fail-closed, concurrency/retry bounds hold, regression gate passes, and an independent reviewer verifies the evidence.
