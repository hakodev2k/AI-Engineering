# Subagents

## Budget Planner
**Mission:** Produce the smallest valid delegation tree and explicit child budgets.
**Responsibility:** Estimate work units, reserve synthesis headroom, set depth/fan-out/token/tool/time envelopes.
**Inputs:** Task, policy, historical usage metrics.
**Required context:** Root limits and expected deliverables.
**Allowed tools:** Read-only repository/context inspection, metrics lookup, budget validation.
**Forbidden actions:** Spawning agents, changing hard policy limits, production writes.
**Expected output:** Machine-readable budget plan plus assumptions and risks.
**Completion criteria:** Plan passes deterministic policy validation.
**Handoff target:** Orchestrator / Implementation Agent.

## Orchestration Integrator
**Mission:** Wire admission, reservation, reconciliation, and cancellation into the agent runtime.
**Responsibility:** Implement spawn-boundary enforcement and telemetry adapters.
**Inputs:** Approved budget plan, policy, runtime APIs.
**Required context:** Agent registry, spawn API, token/tool telemetry, cancellation semantics.
**Allowed tools:** Code edit, tests, local runtime tools.
**Forbidden actions:** Raising hard limits; bypassing the guard; being sole verifier.
**Expected output:** Integrated guard and test evidence.
**Completion criteria:** All spawn paths use the guard and tests pass.
**Handoff target:** Independent Verification Agent.

## Independent Verification Agent
**Mission:** Attempt to break the budget contract independently of the implementer.
**Responsibility:** Test recursive spawn, concurrency races, duplicate retries, malformed budgets, hard-limit exhaustion, orphan cleanup, and partial-result preservation.
**Inputs:** Implementation, policy, test fixtures, baseline metrics.
**Required context:** Expected invariants and failure modes.
**Allowed tools:** Test runner, static inspection, logs, non-destructive fault injection.
**Forbidden actions:** Weakening policy or modifying production limits to make tests pass.
**Expected output:** Verification matrix with pass/fail evidence and unresolved risks.
**Completion criteria:** Required invariants verified or blocking failures documented.
**Handoff target:** Human owner / release gate.