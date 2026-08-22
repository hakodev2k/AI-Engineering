# Workflow: Capability Preflight and Fallback

## Trigger
A task plan depends on a runtime/plugin/tool capability whose availability or semantics can vary by environment, version, permissions, authentication, or tool exposure.

## Goal
Prove capability readiness before committing to the dependent stage, or select a verified equivalent fallback without late failure or semantic loss.

## Inputs
Task stages, hard/optional capabilities, required semantic properties, ambient signals, discovered tools, probe results, fallback candidates.

## Baseline
Capture late capability failures, initialization retries, model/tool turns spent after the first deterministic failure, manual handoffs, and cases where a fallback lost required semantics.

## Context
Use `skills/capability-preflight.md`, `rules/capability-evidence.md`, `scripts/capability_check.py`, and the independent verifier.

## Stages
1. **Observe** — extract hard and optional capabilities from the task plan.
2. **Measure baseline** — record existing late-failure/rework behavior when historical traces exist.
3. **Diagnose evidence** — separate ambient/declared, discovered, callable, healthy, and semantically suitable evidence.
4. **Form hypothesis** — identify the minimum harmless probe that proves each hard requirement.
5. **Preflight** — run discovery and health probes before the dependent stage.
6. **Evaluate** — classify each capability as ready, missing, unhealthy, insufficient semantics, or unknown.
7. **Fallback** — compare fallback properties against the full required semantic set.
8. **Revise plan** — use only verified-ready dependencies; isolate blocked stages.
9. **Independent verify** — capability verifier checks the ledger and fallback equivalence.
10. **Measure again** — compare late failures and wasted retries after adoption.

## Responsible agent
Planning owner for stages 1–2 and 8; capability verifier for stages 3–7 and 9; implementation owner only after preflight passes.

## Tools
Tool discovery, non-destructive status/health probes, runtime/plugin metadata, deterministic checker, structured logs.

## Outputs
Capability ledger, probe evidence, fallback equivalence decision, revised plan, blocked-stage handoff, before/after metrics.

## Checkpoints
- C1: every hard capability declared.
- C2: required semantic properties explicit.
- C3: discovery completed.
- C4: harmless health probe completed or inability documented.
- C5: fallback equivalence proven when used.
- C6: independent verifier approves final dependency set.

## Metrics
Preflight coverage (target 100% hard capabilities), late capability failures, deterministic retry count (target <=1 without changed evidence), fallback violations (target 0), rework/model turns, manual handoff rate.

## Retry policy
One retry after a potentially transient probe failure. A second attempt is allowed only after evidence changes, such as runtime restart, version change, permission/auth change, or tool exposure change.

## Stop conditions
Stop the dependent stage when a hard capability is missing/unhealthy, semantics cannot be proven, or retry limit is reached. Unrelated stages may continue.

## Failure path
Record exact failed evidence level and probe result; evaluate verified fallbacks; otherwise provide an actionable handoff. Do not silently downgrade semantics.

## Verification
Run `python scripts/capability_check.py verify tests/fixtures.json` and runtime-specific harmless smoke probes for each hard capability.

## Definition of Done
Implemented: capability ledger/preflight gate is used before dependent stages. Measured: late-failure/rework baseline and post-change metrics exist. Verified: all hard capabilities or equivalent fallbacks meet required semantics; deterministic failures are bounded; no plan claims unverified availability.