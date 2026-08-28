# Checkpoint Resume Semantic Integrity Gate

**Category:** Thinking  
**Run date:** 2026-08-28 (UTC+7)

## Problem
A long-running workflow can deserialize a checkpoint successfully yet resume from the wrong semantic state: restart from the entry executor, break ancestry, change executor identity/topology, replay answered requests, or lose approval-state meaning. These failures can duplicate work, skip work, corrupt auditability and make human-in-the-loop flows unsafe.

## Evidence
See `evidence/research.md`. Current 2026 evidence includes Microsoft Agent Framework issues for lost restore after compute recreation, broken checkpoint ancestry and approval-type loss, plus current framework guidance requiring checkpointed executor state and stable identities during rehydration.

## Existing approach
Framework checkpoint stores, restore/resume APIs, stable IDs, state-save/restore callbacks and workflow logs.

## Existing limitations
API success proves that bytes were restored, not that the workflow continued from the intended observable state. Resume correctness therefore needs explicit invariants and regression evidence.

## Proposed improvement
Gate consequential post-resume work on deterministic checks for ancestry, workflow signature, executor identity, iteration continuity and pending/answered request reconciliation, followed by independent verification.

## Architecture
```text
README.md
evidence/research.md
skills/resume-integrity-analysis.md
rules/checkpoint-resume-rules.md
subagents/resume-investigator.md
subagents/resume-verification-agent.md
workflows/resume-verify-recover.md
hooks/pre-resume-integrity-check.md
scripts/checkpoint_integrity.py
tests/test_checkpoint_integrity.py
```

## Installation
Python 3.10+; no third-party dependencies.

## Usage
Export checkpoint records as JSONL. Checkpoint rows support `checkpoint_id`, `previous_checkpoint_id`, `iteration`, `workflow_signature`, `executor_ids`, `pending_request_ids`, and `answered_request_ids`. A resume record uses `event: "resume"`, `restored_checkpoint_id`, and `first_new_checkpoint_id`.

```bash
python scripts/checkpoint_integrity.py checkpoints.jsonl --expected-signature wf-v1 --expected-executors planner worker verifier --json-out resume-integrity.json
python -m unittest tests/test_checkpoint_integrity.py
```

## Workflow
Use `workflows/resume-verify-recover.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Correct → Measure again → independent verification. Maximum corrective attempts: 2.

## Metrics
Resume-integrity pass rate; ancestry failures; executor identity mismatches; answered-request replay detections; iteration rollback/restart detections; recovery time; verified-resume coverage.

## Verification
- **Implemented:** checkpoint integrity export/checker and pre-resume gate are integrated.
- **Measured:** pre/post-resume checkpoints and resume event are captured.
- **Verified:** deterministic checks pass, no duplicate/skipped observable work is found, and an independent reviewer reproduces the result.

## Safety
The package checks observable workflow evidence only and never requests hidden chain-of-thought. Ambiguous approval/request state or duplicate consequential-action risk blocks execution and requires human review.

## Failure handling
Keep the workflow paused, preserve checkpoint evidence, retry correction at most twice, then restore the last known-good runtime/version or create a new safe session only after explicit operational approval and work reconciliation.

## Definition of Done
Current evidence documented; resume baseline captured; root cause identified; correction implemented; tests pass; ancestry/identity/request invariants pass; risks documented; independent verification complete; no blocking ambiguity remains.

## Customization
Add framework-specific export adapters, but preserve the canonical integrity fields so cross-version and cross-runtime comparisons remain deterministic.
