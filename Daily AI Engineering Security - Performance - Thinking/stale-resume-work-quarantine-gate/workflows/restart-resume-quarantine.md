# Workflow — Restart/Resume Quarantine

## Trigger
A runtime restart, upgrade, crash recovery, host migration, pending-delivery restoration, or explicit session resume discovers persisted work.

## Goal
Recover legitimate recent interrupted work without resurrecting stale or terminal historical tasks as autonomous execution.

## Inputs
Persisted session/task records, freshness policy, current time, workspace/external state identifiers, approval records.

## Baseline
Before changing recovery behavior, replay representative persisted-state fixtures and record how many recent, stale, terminal, and provenance-missing cases are auto-resumed.

## Context
Separate semantic activity fields from storage metadata. Preserve original task identity and execution epoch.

## Stages
1. **Observe** — enumerate resumable candidates without dispatching them.
2. **Measure baseline** — classify current behavior against labeled fixtures.
3. **Diagnose** — identify which field/event currently grants resume eligibility.
4. **Form hypothesis** — define the semantic freshness and terminal-state policy.
5. **Implement** — build a resume envelope and run deterministic quarantine before model/tool dispatch.
6. **Measure again** — replay the same fixtures plus current production-like records.
7. **Improved?** — stale/terminal/provenance-missing cases must no longer auto-run while recent valid interruptions still recover.
8. **Verify** — Resume Verifier independently checks policy and side-effect approval behavior.

## Responsible agent
Recovery implementation owner for stages 1–6; independent Resume Verifier for stage 8.

## Tools
Read-only state dump, freshness checker, workspace identity comparison, test runner.

## Outputs
Resume decision records, before/after matrix, quarantined candidates, required approvals, verification result.

## Checkpoints
No model/tool dispatch before quarantine decision; no stale side-effect resume without fresh approval; terminal-state decision recorded.

## Metrics
Stale auto-resume rate, valid recovery rate, provenance coverage, side-effect reapproval coverage, false quarantine rate, duplicate/resurrected task count.

## Retry policy
State reconstruction may retry at most twice for transient read errors. Policy denial/quarantine is not retried automatically.

## Stop conditions
Stop on missing provenance, stale age, terminal task, state drift requiring revalidation, or after two reconstruction failures.

## Failure path
Keep the candidate quarantined, retain evidence, surface reason codes, and require operator resolution. Never convert uncertainty into an automatic resume.

## Verification
Fixture tests pass; production-like dry run produces only expected decisions; no quarantine path invokes model/tool side effects.

## Definition of Done
Implemented: deterministic pre-resume gate is wired before dispatch. Measured: before/after matrix exists. Verified: stale and terminal fixtures are blocked, recent valid interruption passes, maintenance timestamp refresh does not alter freshness, and permission boundaries are preserved.
