# Durable History Projection Integrity Guard

## Topic
Verify that resumed/rendered AI-agent history is a faithful projection of durable session evidence.

## Category
Thinking

## Problem
Current agent clients can preserve complete durable rollouts while projected, paginated, resumed, or rendered history stops early, hides older records, or contradicts terminal state. Continuing from that derived view can cause repeated work, unsupported conclusions, false recovery behavior, and incorrect completion status.

## Evidence
See `evidence/research.md`. It documents fresh August 2026 Codex and Claude Code reports where durable/local history remains present while UI/resume projection is incomplete or semantically wrong.

## Existing approach and limitation
Append-only logs, pagination, resume/replay, migration, and client hydration improve scalability, but a derived projection can still fail deterministically on one record, lose ordinal coverage, or disagree with terminal evidence. Restarting is not verification.

## Proposed improvement
Treat durable events as an integrity source. Before resumed history becomes decision context, audit projection coverage, missing critical ordinals, event-type agreement, and terminal-state consistency. If invalid, enter bounded rebuild/recovery and require independent verification.

## Architecture
```text
README.md
evidence/research.md
skills/history-integrity-diagnosis.md
rules/history-integrity-invariants.md
subagents/history-verifier.md
workflows/audit-rebuild-verify.md
hooks/post-resume-integrity-check.md
scripts/history_projection_audit.py
tests/test_history_projection_audit.py
```

## Installation
Python 3.10+; standard library only. Copy this directory intact.

## Input format
Both durable and projected files are JSONL objects with at minimum integer `ordinal` and string `type`. Optional `state` values are used for terminal reconciliation. Hosts should map native event types to the package's critical types (`user`, `assistant`, `tool_call`, `tool_result`, `approval`, `decision`, `final`, `task_complete`) or extend the script conservatively.

## Usage
```text
python scripts/history_projection_audit.py --durable durable.jsonl --projected projected.jsonl --runtime-state idle --output report.json
```
Exit codes: `0` healthy, `20` invalid, `21` degraded, `2` invalid input.

## Workflow
Follow `workflows/audit-rebuild-verify.md`: Observe → baseline → diagnose first failing invariant → form one repair hypothesis → rebuild derived projection → measure again → independently verify. Maximum two repair attempts.

## Metrics
Projection coverage ratio, missing ordinal ranges, missing critical count, terminal mismatch count, rebuild attempts, rebuild success rate, repeated-work incidents, and diagnosis latency.

## Verification
Run:
```text
python -m unittest tests/test_history_projection_audit.py
```
Fixtures cover healthy projection, projection truncation before tool/final records, non-critical omission, duplicate ordinal, terminal-state contradiction, and event-type mismatch.

### Status semantics
- **Implemented:** package artifacts and audit logic exist.
- **Measured:** source/projection fixtures have produced coverage and mismatch metrics.
- **Verified:** regression tests pass and an independent verifier accepts a faithful rebuilt projection while rejecting corrupted variants.

## Safety
The audit is read-only. Durable source records must never be deleted or rewritten to make projection pass. Degraded recovery is read-only for consequential actions unless a human explicitly approves otherwise. Repairing and verifying agents must be distinct for high-impact sessions.

## Failure handling
Detection is an invalid/degraded audit, input/schema error, or runtime/projection contradiction. Preserve durable/source hashes and stop normal continuation. Refresh evidence once; attempt at most two changed repair hypotheses. If still invalid, retain the durable source, mark projection untrusted, and escalate.

## Definition of Done
Current evidence documented; baseline hashes/counts captured; first discrepancy identified; existing approach limitation recorded; repaired projection measured; coverage and terminal consistency verified; tests pass; independent verifier succeeds; risks documented; no blocking issue remains.

## Customization
Extend event-type mappings and projection adapters, but keep the core invariants observable: durable identity, ordinal coverage, critical-event presence, terminal reconciliation, bounded repair, and independent verification.
