# Active Goal Acceptance Ledger

**Category:** Thinking

## Problem
Long-running coding agents can preserve activity while losing the actual user deliverable, terminate after partial milestones, or treat plans/tests/reports as substitutes for unfinished work. Mutable todo state can also hide unresolved tasks.

## Evidence
See `evidence/research.md` for recent Codex and Claude Code reports plus 2026 research on independent verification and agent plans.

## Existing approach
Plans, todos, tests, summaries, and self-review help but remain model-interpreted and mutable. They often do not mechanically prevent a terminal success response.

## Existing limitations
Corrections may not invalidate downstream work; support artifacts can be mistaken for outcomes; the implementer may be its only verifier; criteria can disappear across compaction/handoffs.

## Proposed improvement
Maintain an append-only active-goal ledger with immutable criterion IDs, typed deliverables/evidence, dependency invalidation, independent verification where needed, and a deterministic finalization gate.

## Architecture
- `skills/goal-ledger-management.md`: ledger lifecycle procedure.
- `rules/goal-completion-rules.md`: enforceable invariants.
- `subagents/acceptance-verifier.md`: independent criterion verifier.
- `workflows/execute-verify-finalize.md`: bounded execution flow.
- `hooks/pre-finalize-gate.md`: terminal-response blocker.
- `scripts/ledger_gate.py`: deterministic ledger validator.
- `tests/finalization-cases.md`: false-success and valid-success cases.
- `evidence/research.md`: public evidence and root-cause analysis.

## Package tree
```text
README.md
evidence/research.md
skills/goal-ledger-management.md
rules/goal-completion-rules.md
subagents/acceptance-verifier.md
workflows/execute-verify-finalize.md
hooks/pre-finalize-gate.md
scripts/ledger_gate.py
tests/finalization-cases.md
```

## Installation
Requires Python 3.9+. Persist a `goal-ledger.json` in the orchestration state and invoke the pre-finalize hook before terminal success.

## Configuration
Define which criteria require independent verification, how corrections reference invalidated criteria, and how deliverable existence is checked. Do not store hidden reasoning; record only observable facts, assumptions, decisions, evidence and status.

## Usage
A criterion should include `id`, `required`, `status`, and `evidence` when verified. Run:
`python3 scripts/ledger_gate.py goal-ledger.json`
Exit 0 allows ledger finalization; 2 indicates malformed state; 3 means unresolved completion requirements.

## Workflow
Observe → create ledger → baseline coverage → diagnose open rows → implement mapped work → attach evidence → independently verify → run finalization gate → finish only when all required rows pass. Same-failure retries are capped at two.

## Metrics
Premature completion blocks, verified criterion coverage, stale-evidence invalidations, correction rework, unresolved-row preservation, independent-verification coverage, false-success regression rate.

## Verification
Run `tests/finalization-cases.md`. In addition, confirm the requested deliverable exists and is usable independently of plans/reports/tests. High-impact rows must receive an independent verifier verdict.

## Safety
Do not modify acceptance criteria merely to obtain success. Do not delete unresolved rows. Do not expose hidden chain-of-thought. Human approval remains required for dangerous/irreversible operations.

## Failure handling
Detection: gate/verifier failure. Evidence: ledger row plus artifact/test reference. Retry: maximum two per unchanged diagnosis. Fallback: preserve checkpoint and report incomplete/blocked. Escalation: human review when state cannot be reconstructed. Stop when all rows verify or a real blocker prevents safe progress.

## Implemented / Measured / Verified
Implemented means ledger/gate integration exists. Measured means coverage and rework metrics are captured. Verified means all required criteria have current evidence, independent checks pass where required, and the requested deliverable satisfies the gate.

## Definition of Done
Goal and criteria persisted; corrections propagated; requested deliverable exists; all required rows verified with current evidence; supporting artifacts not substituted for the outcome; bounded retries respected; verifier and deterministic gate pass; no blocking issue remains.

## Customization
Add JSON Schema, event-sourced storage, CI checks, or domain-specific evidence validators while preserving immutable criterion lineage and mechanical terminal gating.