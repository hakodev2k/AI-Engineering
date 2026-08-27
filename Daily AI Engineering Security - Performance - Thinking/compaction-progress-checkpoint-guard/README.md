# Compaction Progress Checkpoint Guard

**Category:** Thinking

## Problem
Long-running coding agents can lose operational progress across context compaction and then reread the same files, repeat plans, or compact again without producing repository/task progress.

## Evidence
See `evidence/research.md` for multiple 2026 Codex reports describing compaction loops, lost task continuity, repeated file reads, and long-running-task failures across surfaces.

## Existing approach
Automatic compaction, session resume, broad summaries, manual handoff notes, git state, and user intervention.

## Existing limitations
Broad summaries may preserve goals but not the exact execution frontier. A resumed agent may not know what was already inspected, which hypothesis failed, which acceptance criteria are satisfied, or what next action is admissible. Many loops lack deterministic no-progress stop conditions.

## Proposed improvement
Persist an observable checkpoint before compaction, compare post-compaction action signatures and state against it, require measurable progress, and stop/recover after bounded repetition.

## Architecture
```text
compaction-progress-checkpoint-guard/
├── README.md
├── evidence/research.md
├── schemas/checkpoint.schema.json
├── skills/compaction-checkpointing.md
├── rules/progress-and-stop-rules.md
├── subagents/continuity-verifier.md
├── workflows/checkpoint-resume-recover.md
├── hooks/pre-compaction-checkpoint.md
├── hooks/post-compaction-progress-check.md
├── scripts/progress_guard.py
└── tests/test_progress_guard.py
```

## Installation
Python 3.10+; standard library only. JSON Schema validation is optional for integrations; the runtime guard validates required fields itself.

## Configuration
Default guard policy evaluates three-action windows and stops after two consecutive no-progress windows. Integrations may change the window size via CLI arguments, but MUST preserve a finite stop condition.

## Usage
1. Before compaction, create `checkpoint.json` conforming to `schemas/checkpoint.schema.json`.
2. Append observable post-compaction events to `events.jsonl` with: `seq`, `action_signature`, `progress_token`, `completed_steps_count`, `evidence_ids`.
3. Run `python scripts/progress_guard.py --checkpoint checkpoint.json --events events.jsonl --window 3 --max-no-progress-windows 2`.

## Workflow
Follow `workflows/checkpoint-resume-recover.md`: Observe → Checkpoint → Compact/Handoff → Resume from checkpoint → Measure progress → one recovery tactic → bounded stop → independent verification.

## Metrics
Repeated action signatures, progress-token delta, completed-step delta, new evidence IDs, post-compaction reread rate, number of recovery attempts, verification coverage.

## Verification
Run `python -m unittest tests/test_progress_guard.py`. The Continuity Verifier must separately confirm that checkpoint claims match observable task artifacts and that the implementing agent is not its own sole verifier.

## Safety
Checkpoints store observable facts and structured state, not hidden chain-of-thought. Secrets, raw credentials, and credential-bearing tool outputs MUST NOT be stored. Dangerous or irreversible recovery actions require explicit human approval.

## Failure handling
Detection: exit 3 after the configured bounded no-progress condition; exit 2 for invalid input. Evidence: checkpoint plus event stream. Retry policy: one recovery tactic after the first no-progress window. Maximum retries: two no-progress windows total. Fallback: stop and hand off checkpoint/evidence. Escalation: checkpoint contradiction, destructive action, or missing acceptance criteria.

## Definition of Done
**Implemented:** checkpoint hook and progress guard integrated.  
**Measured:** normal continuation and repeat-work fixtures captured.  
**Verified:** tests pass, bounded stop triggers on repeated no-progress behavior, normal continuation remains allowed, and checkpoint consistency is independently verified.

## Customization
Add project-specific progress-token calculation using observable state such as git tree SHA, completed test IDs, artifact hashes, or task-ledger revision. Never use hidden reasoning as the progress signal.
