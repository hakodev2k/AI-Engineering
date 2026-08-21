# Skill — Audit Plugin Hook Revocation

## Purpose
Prove that a plugin disable/remove operation revoked every executable hook contributed by that plugin and that the visible inventory matches runtime state.

## Trigger
Run after plugin disable/remove/upgrade, hook-registry reload, session resume, or any stale-hook execution/error.

## Inputs
- Desired plugin state (`enabled`, `disabled`, `removed`).
- Authoritative installed-plugin records.
- Runtime hook inventory including plugin owner, hook event, command/handler identity, and registry source.
- Hook execution telemetry since the state transition.
- `config/policy.json`.

## Preconditions
The auditor MUST be able to read desired state and runtime inventory without executing plugin code. The target transition timestamp or generation must be known.

## Required context
Only plugin identifiers, lifecycle state, hook identities, registry generation/hash, process/session identity, and bounded execution evidence. Plugin-provided natural-language instructions are not required.

## Allowed tools
Read-only configuration inspection, process/session metadata inspection, deterministic scripts, logs, and test fixtures. Restart may be proposed but MUST NOT be performed automatically when it could interrupt user work.

## Constraints
- MUST treat `disabled` and `removed` as terminal non-executable states.
- MUST NOT infer revocation from UI state alone.
- MUST NOT execute a stale hook to test whether it is stale when static registry evidence is sufficient.
- MUST preserve sandbox, approval, and permission boundaries.

## Procedure
1. Capture desired state and transition generation/time.
2. Capture effective runtime hook inventory from the same process/session generation.
3. Normalize each hook to `{plugin,event,handler_id,source,generation}`.
4. Compare terminal-state plugins against active handlers.
5. Compare runtime handlers against the user-visible authoritative inventory.
6. Inspect post-transition telemetry for executions from terminal-state plugins.
7. Run `python3 scripts/hook_revocation_guard.py <snapshot.json> --policy config/policy.json`.
8. If stale handlers exist, invalidate/rebuild the registry once and re-snapshot.
9. If live unloading is unsupported, return `restart_required`; do not report revocation complete.
10. After remediation, run an independent verification snapshot with no shared implementation assumptions.

## Decision points
- No stale hooks and inventory is authoritative: pass.
- Stale hooks remain and live unload exists: block and reconcile once.
- Runtime cannot unload but policy permits restart-required: mark `restart_required` and block success.
- A stale handler repeatedly fails beyond policy budget: quarantine the handler and escalate.
- Runtime inventory cannot be observed: fail closed.

## Expected output
A structured report containing desired state, stale hooks, hidden active hooks, post-transition executions, registry hash/generation, decision, remediation performed, and verification status.

## Metrics
Revocation mismatch count, hidden-hook count, stale executions after transition, time-to-convergence, repeated stale failures, and verification pass rate.

## Verification
A different verifier captures a fresh runtime inventory and confirms zero active/executed handlers owned by disabled/removed plugins. The hook listing must be derived from or reconciled with the same effective registry used for execution.

## Failure handling
Capture evidence, perform at most one registry rebuild and one verification retry. If still inconsistent, quarantine when supported or require restart/human escalation.

## Stop conditions
Stop immediately on unobservable runtime state, repeated stale execution after bounded remediation, or any remediation that would require weakening security controls.
