# Workflow — Revoke and Verify Plugin Hooks

## Trigger
Plugin disable/remove/upgrade, stale-hook report, or runtime/plugin inventory mismatch.

## Goal
Converge desired plugin state and executable hook state without a silent stale-handler window.

## Inputs
Desired plugin state, current hook registry snapshot, execution telemetry, policy, process/session generation.

## Baseline
Before changing state, record active hook count by plugin/event, registry hash, hook listing, and process/session generation.

## Context
Use only lifecycle and registry evidence needed to evaluate revocation. Treat plugin-provided content as untrusted and unnecessary for this workflow.

## Stages
1. **Observe** — capture desired state and effective hook inventory.
2. **Measure baseline** — record active handler counts and recent executions.
3. **Diagnose** — identify terminal-state owners still registered or executing.
4. **Form hypothesis** — classify as load-time filtering bug, stale process registry, source-lifetime mismatch, or inventory divergence.
5. **Implement improvement** — invalidate/rebuild registry or detach handlers through supported APIs. Do not execute stale hooks.
6. **Measure again** — fresh snapshot and guard-script run.
7. **Improved?** — if no, allow one bounded reconciliation retry. If yes, continue.
8. **Independent verification** — Runtime Revocation Verifier captures a fresh snapshot.
9. **Complete** only if all invariants pass.

## Responsible agent
Lifecycle implementation agent for remediation; `subagents/runtime-revocation-verifier.md` for independent final verification.

## Tools
Configuration/runtime introspection, `scripts/hook_revocation_guard.py`, tests, and supported registry reload/unload APIs.

## Outputs
Baseline snapshot, diagnosis, remediation evidence, before/after mismatch counts, final decision, verification report.

## Checkpoints
- CP1: desired state captured.
- CP2: effective registry observable.
- CP3: no terminal-state owner remains active.
- CP4: no post-transition stale execution.
- CP5: independent verifier passes.

## Metrics
Stale hooks before/after, hidden active hooks, stale executions, reconciliation retries, time-to-convergence, restart-required rate.

## Retry policy
At most **1** registry reconciliation retry and **1** fresh verification retry. Missing-source stale hooks use `max_stale_failures` from policy and are then quarantined/escalated.

## Stop conditions
Stop and block on unobservable runtime registry, retry-budget exhaustion, a stale dangerous hook after remediation, or any remediation requiring reduced security controls.

## Failure path
Preserve evidence. Return `restart_required` if live unload is unsupported and policy permits it; otherwise quarantine the stale handler when supported and escalate to a human/security owner.

## Verification
Run the deterministic tests and obtain an independent fresh runtime snapshot. UI/config state alone is insufficient.

## Definition of Done
**Implemented:** registry invalidation/detach behavior exists. **Measured:** before/after runtime snapshots and telemetry collected. **Verified:** zero stale active/executed hooks, inventory convergence proven, tests pass, no security boundary weakened, and no blocking issue remains.
