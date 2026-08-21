# Agent Provider Fallback Recovery Governor

## Topic
Bounded provider failover and primary recovery for long-running agent execution.

## Category
Performance

## Problem
A transient provider failure can move a long agent turn onto fallback and leave it there after the primary is healthy again. Other execution surfaces may omit fallback entirely. This wastes cost/latency, hides provider provenance, and can terminate work unnecessarily.

## Evidence
See `evidence/research.md` for current July–August 2026 public signals covering in-turn fallback pinning, persistent fallback leakage, missing fallback wiring, and budget starvation.

## Existing approach
Most runtimes retry the current provider, activate a configured fallback, set a cooldown, and restore the primary at a later turn/session boundary.

## Existing limitations
Long-running turns may have no later boundary for many minutes. Adapter-specific wiring can diverge. Temporary route state can leak into persistence. Failed calls can consume productive iteration budgets. Configured provider metadata may not match the route that actually produced output.

## Proposed improvement
Model routing as an explicit bounded state machine: `primary → cooldown → fallback → probe → primary`, with degraded/exhausted terminal states. Re-evaluate primary eligibility inside long turns, isolate temporary routing from persistent selection, separate recovery budgets, and record actual provider/model per call.

## Architecture
- `evidence/research.md` — observed signals, limitations, root causes.
- `config/policy.json` — cooldown/probe/switch defaults.
- `skills/fallback-recovery-analysis.md` — diagnosis and baseline procedure.
- `rules/provider-routing-rules.md` — enforceable routing invariants.
- `subagents/routing-verifier.md` — independent verification contract.
- `workflows/failover-recover-verify.md` — bounded lifecycle workflow.
- `scripts/routing_governor.py` — deterministic routing-state decision helper.

## Installation
Requires Python 3.10+ only for the reference script. The workflow/rules are framework-independent. Integrate provider telemetry before adopting the governor; without actual per-call route data, verification is incomplete.

## Configuration
Tune `primary_recheck_seconds`, probe/switch limits, fallback-chain hops, and hard-quota cooldown to provider behavior. Never reduce hard-quota/auth/billing protections merely to recover faster.

## Usage
Create a routing snapshot JSON with `state`, `now_monotonic`, `primary_eligible_at`, `probe_failures`, `switches`, `error_class`, `persistent_provider`, `active_provider`, and `primary_provider`, then run:

`python scripts/routing_governor.py snapshot.json --policy config/policy.json`

Exit codes: `0 keep/restore`, `3 probe primary`, `4 hold/block/operator action`, `2 invalid input`.

## Workflow
Measure baseline → classify provider failure → fail over → arm cooldown → continue with actual-route telemetry → re-evaluate inside the turn → bounded primary probe → recover or extend cooldown → verify persistence and adapter parity.

## Metrics
Measure fallback dwell time, calls on fallback after primary eligibility, recovery success, route switches/100 calls, cost/task, latency/task, adapter fallback coverage, and configured-vs-actual provenance mismatch.

## Verification
Use deterministic traces. A one-time transient 429 followed by primary health must return later calls to primary after eligibility. Persistent outage must remain stable on fallback without repeated switches. Hard quota/auth/billing fixtures must not probe aggressively. Temporary fallback must never become persistent user selection.

## Safety
Do not probe production providers aggressively. Respect provider reset hints and hard quota. Do not silently substitute a cheaper/faster model where correctness requirements mandate a specific capability. Record actual model/provider for auditability.

## Failure handling
Detection uses route-state and per-call telemetry. Provider retries, fallback hops, primary probes, and switches are each bounded. If all routes are exhausted, persist a durable recovery state and last successful checkpoint; do not mark unfinished work complete.

## Definition of Done
**Implemented:** all supported execution adapters use the same fallback contract and emit actual-route telemetry.

**Measured:** before/after cost, latency, fallback dwell, switch rate, and recovery metrics are captured.

**Verified:** transient failures recover after eligibility, persistent failures do not thrash, persistent selection remains unchanged, fallback exhaustion is visible, provenance is accurate, and the independent verifier confirms results.

## Customization
Add provider-specific error classifiers and reset hints, but preserve separation between transient runtime route and durable user intent. Add adapters only when their fallback behavior is tested explicitly.
