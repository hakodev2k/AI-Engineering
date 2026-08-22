# Workflows

## Workflow A — Safe Catalog Refresh
**Trigger:** startup, TTL/freshness expiry, explicit refresh, or `notifications/tools/list_changed`.  
**Goal:** publish one complete replacement metadata generation without disturbing current/in-flight calls.  
**Inputs:** current generation, `tools/list` result, validator compiler.  
**Baseline:** record current generation ID/hash, live lease count, refresh latency/error rate.  
**Context:** server/session identity, protocol revision, cache scope/freshness.  
**Stages:** Observe refresh trigger → fetch candidate → canonicalize/hash → compile every output schema into temporary state → build task metadata → candidate complete? → atomically publish → retire old generation after leases reach zero → verify telemetry.  
**Responsible agent:** Implementation Agent; Verification Agent tests failure modes.  
**Tools:** MCP client, schema compiler, generation guard, metrics.  
**Outputs:** complete generation or explicit refresh failure preserving current generation.  
**Checkpoints:** candidate fully compiled; pre-publish current generation recorded; post-publish pointer/hash consistent.  
**Metrics:** refresh_ms, compile_failures, partial_publications (target 0), current_generation, retained_generations.  
**Retry policy:** retry transient fetch/compile input acquisition at most 2 times; deterministic invalid schemas are not retried unchanged.  
**Stop conditions:** successful atomic publish or bounded failure with last-good generation retained.  
**Failure path:** keep current generation, mark catalog stale, emit evidence, escalate if no valid generation exists.  
**Verification:** inject invalid first/middle/last schema and assert active generation object/hash unchanged.  
**Definition of Done:** no partial state observed and generation publication is atomic under concurrent readers.

## Workflow B — Generation-Pinned Tool Call
**Trigger:** model/application selects an MCP tool.  
**Goal:** execute and validate under one immutable contract.  
**Inputs:** tool name, arguments, active generation.  
**Baseline:** capture generation ID/schema hash before dispatch.  
**Context:** validator, taskSupport, annotations/trust state, request ID.  
**Stages:** acquire generation lease → resolve tool → validate input/routing → capture validator → dispatch → allow concurrent refresh → receive result → validate using captured validator → record outcome → release lease.  
**Responsible agent:** runtime/client.  
**Tools:** immutable generation store, schema validator, telemetry.  
**Outputs:** validated result or explicit validation/protocol error with provenance.  
**Checkpoints:** generation pinned before network await; response validator identity equals pinned validator identity.  
**Metrics:** cross_generation_validation (target 0), expected_schema_missing_validator (target 0), validation_coverage (target 100%).  
**Retry policy:** validation failures are not automatically retried; network retry follows existing idempotency/side-effect policy, maximum 2 where safe.  
**Stop conditions:** terminal validated/rejected response and lease released.  
**Failure path:** fail closed if validator provenance is missing; determine external side-effect state before any replay.  
**Verification:** delayed old-generation call + new-generation refresh accepts old-valid output and rejects old-invalid output.  
**Definition of Done:** request and validation provenance remain identical despite refresh.

## Workflow C — Regression Investigation Loop
**Trigger:** unexpected `-32602`, missing validation, or post-refresh behavior change.  
**Goal:** identify and fix the smallest verified consistency defect.  
**Inputs:** trace/events, reproducer, policy.  
**Baseline:** reproduce 3 times without mitigation and capture mismatch/bypass counts.  
**Stages:** Observe → reconstruct generations → hypothesize (TOCTOU vs failed publication vs unrelated) → run targeted fault injection → implement one change → rerun same baseline → better? If no, revise hypothesis (maximum 2 implementation attempts) → independent verification.  
**Responsible agent:** Evidence Analyst → Implementation Agent → Verification Agent.  
**Tools:** `schema_generation_guard.py`, test suite, client logs.  
**Outputs:** root-cause record, fix, before/after metrics.  
**Checkpoints:** evidence supports hypothesis before code change; verifier is independent.  
**Metrics:** reproduction rate, mismatch count, bypass count, refresh latency regression.  
**Retry policy:** maximum 2 fix iterations in one investigation; then escalate with collected evidence.  
**Stop conditions:** invariant verified or bounded attempts exhausted.  
**Failure path:** restore last known-good behavior; never disable validation to make tests green.  
**Verification:** all adversarial fixtures plus normal calls.  
**Definition of Done:** root cause supported, security invariants pass, performance regression within agreed threshold.
