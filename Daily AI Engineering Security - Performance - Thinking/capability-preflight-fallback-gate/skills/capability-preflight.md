# Skill: Capability Preflight

## Purpose
Verify that every hard capability dependency in a plan is actually discoverable, callable, healthy, and semantically suitable before the dependent stage begins.

## Trigger
Use before a task depends on a browser session, MCP server, connected app, code-execution runtime, privileged write path, visual inspection tool, or another plugin/runtime-dependent capability.

## Inputs
Task requirements, capability names, required semantics, ambient/declaration signals, discovered tools, health-probe evidence, permission/auth/session requirements, fallback candidates.

## Preconditions
The task can state observable capability requirements. A bounded discovery/health probe is possible or lack of probe support can be recorded explicitly.

## Required context
Which capabilities are hard dependencies versus optional accelerators; what semantic properties must be preserved, such as authenticated session continuity, DOM access, screenshots, write permission, or locality.

## Allowed tools
Tool discovery, read-only health/status calls, harmless probe operations, deterministic `scripts/capability_check.py`, product/runtime metadata.

## Constraints
- UI presence, ambient state, installed plugin, or skill name alone MUST NOT be treated as proof of callability.
- A fallback MUST NOT be accepted merely because it has a similar name; it must preserve required semantics.
- Probes MUST be non-destructive unless explicit approval exists.
- A deterministic initialization failure SHOULD NOT be retried more than once without changed evidence.
- Hidden chain-of-thought is never requested; record only observable facts, assumptions, evidence, decisions, risks, and verification status.

## Procedure
1. Decompose the plan into stages and list each hard capability dependency.
2. For each capability, record declaration/ambient evidence separately from discovery evidence.
3. Run tool discovery before committing to the dependent stage.
4. If discoverable, run the smallest harmless health probe that proves required semantics.
5. Classify the capability: `ready`, `missing`, `unhealthy`, `insufficient_semantics`, or `unknown`.
6. Evaluate fallback candidates against every required semantic property.
7. If a semantically equivalent fallback is ready, revise the plan and record the substitution.
8. Otherwise stop the dependent stage and produce an actionable handoff/recovery path rather than retrying indefinitely.
9. Re-run preflight only after evidence changes (runtime restart, plugin version change, permission change, tool exposure change, etc.).
10. Compare late-failure/rework metrics before and after adoption.

## Decision points
- Declared but not discoverable: block dependent stage.
- Discoverable but health probe fails: classify unhealthy; one bounded retry only if failure could be transient.
- Callable fallback lacks required auth/session/permission semantics: reject fallback.
- Optional capability unavailable: degrade plan without blocking unrelated stages.

## Expected output
Capability ledger containing requirement, evidence levels, decision, fallback equivalence, risk, retry count, and stop condition.

## Metrics
Preflight coverage, late capability failures, repeated initialization attempts, unsupported claims, fallback-equivalence violations, rework/model turns, manual handoff rate.

## Verification
Use deterministic fixtures plus one runtime-specific smoke test per hard capability. The final plan must not reference an unavailable hard capability as if it were ready.

## Failure handling
Preserve evidence, stop only the dependent stage, use a verified equivalent fallback when available, or hand off with the exact missing capability/evidence. Never silently replace a capability with a weaker one.

## Stop conditions
Capability is ready; verified equivalent fallback is ready; required evidence is unavailable; or the bounded retry limit is reached.