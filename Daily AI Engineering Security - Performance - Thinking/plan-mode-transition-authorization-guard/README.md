# Plan Mode Transition Authorization Guard

**Category:** Security

## Problem
Plan-first coding workflows depend on a write barrier that must survive errors, reconnects, process relaunches, context transitions, and permission-mode changes. Current reports show that runtime mode can diverge from actual user approval, allowing either unauthorized execution or an unusable stuck planning state.

## Evidence
See `evidence/research.md`. The strongest current signal is Claude Code issue #85095, reproduced by a maintainer in August 2026, plus independent reports covering degraded plan approval, lost approval state, and inconsistent post-plan permission modes.

## Existing approach
Plan mode, ExitPlanMode dialogs, session resume state, project instructions, and separate permission modes.

## Existing limitations
The mode bit is not itself proof of authorization. Resume/relaunch can reconstruct mode independently from approval; error text can be misinterpreted as consent; context clearing can lose approval; post-plan permissions can diverge from configured intent.

## Proposed improvement
Use a durable transition ledger. Bind an accepted approval to `plan_id`, SHA-256 `plan_hash`, `mode_before`, `mode_after`, `approval_id`, and `transition_epoch`. Revalidate this record after resume and before the first privileged post-plan action. Missing or contradictory state fails closed.

## Architecture
- `evidence/research.md` — current signals, existing approaches, gap, root causes.
- `skills/transition-verification.md` — reusable verification procedure.
- `rules/transition.rules.md` — enforceable authorization invariants.
- `subagents/transition-verifier.md` — independent verifier.
- `workflows/secure-transition.md` — bounded diagnose/fix/retest path.
- `hooks/pre-privileged-action-gate.md` — deterministic action-time gate.
- `scripts/transition_guard.py` — dependency-free ledger/hash validator.
- `tests/test_transition_guard.py` — approved and fail-closed fixtures.

## Package tree
```text
plan-mode-transition-authorization-guard/
├── README.md
├── evidence/research.md
├── hooks/pre-privileged-action-gate.md
├── rules/transition.rules.md
├── scripts/transition_guard.py
├── skills/transition-verification.md
├── subagents/transition-verifier.md
├── tests/test_transition_guard.py
└── workflows/secure-transition.md
```

## Installation
Python 3.9+ is sufficient for the reference validator and tests. Persist the transition ledger in a store that survives the agent process and session UI.

## Configuration
A ledger record must include `plan_id`, `plan_hash`, `approval_id`, `approval_status`, `mode_before`, `mode_after`, and `transition_epoch`.

## Usage
```bash
python3 scripts/transition_guard.py --ledger transition.json --plan plan.md --requested-mode workspace-write --epoch 7
python3 tests/test_transition_guard.py
```
Exit `0` permits the exact recorded transition; `1` blocks on invariant failure; `2` blocks on malformed/unreadable input.

## Workflow
Observe → measure transition integrity → diagnose first divergence → hypothesize one persistence/ordering/recovery defect → implement minimal fix → replay approved and hostile fixtures → independent verification. Maximum two repair cycles.

## Metrics
Unauthorized capability transitions blocked, valid approval-binding rate, resume mismatch count, stale-plan mismatch count, false-block rate.

## Verification
**Implemented:** ledger contract, guard, rules, workflow, and tests exist.  
**Measured:** production or fixture transition records are evaluated and mismatch metrics recorded.  
**Verified:** an independent verifier proves unapproved/stale/resume-error transitions fail closed and a correctly approved plan-hash-bound transition passes.

## Safety
The validator does not mutate the plan, approval, or runtime mode. It never treats system/model prose as authorization and never loosens per-tool security to escape a stuck state.

## Failure handling
Detection: validator or runtime/ledger mismatch. Evidence: plan hash, approval ID/status, modes, epoch. Retry: at most two reconstruction/revalidation attempts. Fallback: planning/read-only. Escalation: platform/security owner. Stop condition: unresolved mismatch or any attempted privileged action without a valid record.

## Definition of Done
Evidence documented; baseline captured; unresolved limitation identified; ledger-backed improvement integrated; tests pass; resume/relaunch path tested; before/after metrics recorded; independent verification complete; no blocking mismatch remains.

## Customization
Hosts may extend the ledger with repository SHA, worktree ID, user identity, environment, or approval expiry. They MUST preserve the core binding between exact plan, accepted approval, requested capability, and transition epoch.
