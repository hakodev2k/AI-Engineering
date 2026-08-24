# Cross-Surface Session Convergence Guard

**Category:** Thinking

## Problem
AI coding sessions increasingly move between desktop, CLI, mobile, web, and remote-control surfaces. August 2026 reports show that one logical session can have canonical turns that a resumed surface omits, an older selected child restored as current, or a live local session that remote surfaces no longer see.

## Evidence
See `evidence/research.md`.

## Existing approach and limitation
Stable thread IDs, local resume caches, active-writer locks, and remote bridge registration do not by themselves prove freshness. A surface can have the right session ID and still hold stale decision-critical state.

## Proposed improvement
Require a versioned convergence contract before a resumed surface may continue model or tool execution. Compare canonical version, last durable turn, selected child, active-writer identity, and registration epoch; block write-capable continuation on divergence until bounded reconciliation succeeds.

## Architecture
- `skills/session-convergence-analysis.md`
- `rules/convergence-contract.md`
- `subagents/session-state-verifier.md`
- `workflows/resume-and-reconcile.md`
- `workflows/failure-recovery.md`
- `hooks/pre-resume-convergence.md`
- `scripts/convergence_check.py`
- `schemas/session_snapshot.schema.json`
- `tests/test_convergence_check.py`
- `evidence/research.md`

## Installation
Python 3.10+. No third-party dependency is required.

## Usage
`python scripts/convergence_check.py canonical.json desktop.json mobile.json`

`python -m unittest tests/test_convergence_check.py`

Exit `0` means PASS, `2` means blocking divergence, and `1` means invalid input or operational failure.

## Workflow
Observe -> capture canonical baseline -> compare surfaces -> diagnose -> reconcile -> measure again -> independent verification. Maximum reconciliation retries: 2.

## Metrics
Stale continuation attempts blocked; canonical-version lag; durable-turn lag; selected-child mismatches; writer conflicts; registration-epoch mismatches; reconciliation success rate; recurrence rate.

## Verification
**Implemented:** comparator, schema, rules, workflows, hook, tests.

**Measured:** run the comparator on real snapshots and record mismatch/lag metrics.

**Verified:** matching snapshots pass, stale snapshots block, reconciliation removes the mismatch, and the independent verifier confirms the result.

## Safety
The guard never deletes transcripts, steals writer leases, or silently overwrites a selected child. Dangerous recovery requires explicit human approval.

## Failure handling
Fail closed for writes when critical state is unknown. Retry reconciliation at most twice, then preserve evidence and require manual recovery.

## Definition of Done
Evidence documented; baseline captured; no blocking mismatch remains; independent verification passes; tests pass; no transcript bodies or secrets are logged.