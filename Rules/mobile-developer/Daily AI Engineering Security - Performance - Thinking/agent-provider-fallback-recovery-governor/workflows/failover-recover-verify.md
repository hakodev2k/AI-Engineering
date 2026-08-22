# Workflow: Failover → Recover → Verify

## Trigger
Primary provider fails and the runtime activates or considers fallback.

## Goal
Maintain availability while returning to the intended primary when appropriate, without thrashing, hidden route drift, or budget starvation.

## Inputs
Primary/fallback routes, error classification, route history, monotonic cooldown timestamps, budgets, adapter identity, persistent user selection, per-call telemetry.

## Baseline
Measure provider calls, failures, retries, fallback dwell time, provider switches, latency/task, cost/task, and provenance mismatch before changes.

## Stages
1. **Observe** — record actual provider/model and classified failure.
2. **Fail over** — apply bounded retries, then move through configured fallback chain.
3. **Arm cooldown** — select cooldown based on transient rate limit, hard quota/reset, auth/billing, transport, or unknown error.
4. **Continue work** — execute on fallback while recording actual route per call.
5. **Re-evaluate in loop** — when eligibility time passes, run a bounded primary probe before a normal model iteration.
6. **Recover** — successful probe restores primary for subsequent calls; failed probe updates cooldown without repeated immediate probing.
7. **Guard thrash** — stop probes after `max_primary_probe_failures` or `max_provider_switches_per_turn`.
8. **Verify persistence** — ensure runtime fallback never overwrote persistent user selection.
9. **Verify adapter parity** — test gateway, CLI/oneshot, ACP, subagent, scheduled/batch, and resume paths that the host supports.

## Responsible agent
Routing/runtime implementation owner; `subagents/routing-verifier.md` performs independent verification.

## Tools
`config/policy.json`, `scripts/routing_governor.py`, provider logs/metrics, deterministic failure injection.

## Outputs
Route-state transitions, fallback/recovery decisions, per-call provenance, before/after benchmark.

## Checkpoints
After failover; at cooldown expiry; before primary probe; after probe; before persisting route state; before task completion.

## Metrics
Post-cooldown fallback calls, recovery latency, switch rate, failed probes, cost/task, latency/task, adapter fallback coverage, provenance mismatch.

## Retry policy
Provider call retries and primary probes are separate bounded budgets. Maximum primary probe failures: 2. Maximum provider switches per turn: 4. Do not retry indefinitely.

## Stop conditions
Stop probing on hard quota until reset/long cooldown, auth/billing failure, probe budget exhaustion, or switch budget exhaustion.

## Failure path
If all routes fail, emit durable route-exhaustion state with last successful checkpoint and do not claim task completion. Recovery requires a later eligible route or operator action.

## Verification
Use a deterministic trace where primary returns one transient 429 then recovers; assert later calls return to primary. Use persistent-outage and hard-quota traces; assert stable fallback and no thrash.

## Definition of Done
Baseline captured; recovery state machine implemented; all supported adapters honor routing contract; costs/latency/provenance measured; bounded tests pass; independent verification complete.
