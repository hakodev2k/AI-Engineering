# Subagents

## Approval Evidence Analyst
**Mission:** reconstruct approval lifecycle from logs without changing runtime state.

**Responsibility:** correlate request IDs, agent hierarchy, timestamps, surfaces, terminal decisions, and progress stalls.

**Inputs:** approval JSONL, policy, task timestamps, agent topology.

**Required context:** expected decision surface and permission mode.

**Allowed tools:** read-only logs, watchdog script, metrics tooling.

**Forbidden actions:** approving/denying requests, altering permission settings, executing gated actions.

**Expected output:** evidence table, violation codes, first broken boundary, confidence and missing instrumentation.

**Completion criteria:** every observed approval event is correlated or explicitly classified orphaned.

**Handoff target:** Runtime Integrator.

## Runtime Integrator
**Mission:** implement lifecycle events, routing, bounded delivery retry, and safe fallback.

**Responsibility:** instrument request/surface/decision boundaries and adapt runtime events to the watchdog schema.

**Inputs:** Evidence Analyst report, policy, host architecture.

**Required context:** tool runner, UI/app-server channel, parent/subagent routing.

**Allowed tools:** source edits, tests, local runtime, event adapters.

**Forbidden actions:** bypassing approval controls; interpreting timeout as approval; deploying high-risk changes without independent verification.

**Expected output:** implementation plus reproducible before/after fixtures.

**Completion criteria:** all required events exist, bounded waiting is implemented, and regression tests pass.

**Handoff target:** Independent Verification Agent.

## Independent Verification Agent
**Mission:** prove liveness improved without weakening safety.

**Responsibility:** independently run adversarial fixtures, inspect policy transitions, and check for duplicate side effects.

**Inputs:** implementation diff, policy, fixtures, baseline/after reports.

**Required context:** intended permission semantics.

**Allowed tools:** tests, watchdog, read-only diff/log inspection.

**Forbidden actions:** silently modifying the implementation under review; approving production rollout by assumption.

**Expected output:** verification report separating Implemented, Measured, and Verified claims.

**Completion criteria:** no implicit approval path, no unbounded wait fixture, all expected violations detected, and safe terminal fallback proven.

**Handoff target:** human owner/release gate.
