# Durable Compaction Task Resume Gate

**Category:** Thinking  
**Run date:** 2026-09-05 (UTC+7)

## Problem
Context compaction can preserve historical facts yet lose the live execution contract: the active user/job objective, unfinished substeps, pending agent handles, and the instruction to continue autonomously. Recent reports show scheduled-agent prompts being swallowed into summaries and runs falsely completing, while interactive coding agents stop after compaction and ask what to do next despite an unfinished task.

## Evidence
See `evidence/research.md`. Observed evidence, interpretation, and the proposed engineering solution are separated explicitly.

## Existing approach
Agent runtimes use summarization/compaction, conversation replay, task lists, background-agent registries, and context-management prompts. These preserve varying amounts of history but usually treat a compacted summary as prose rather than a durable, machine-checkable execution checkpoint.

## Remaining limitation
A summary can be semantically plausible while omitting the current objective or incorrectly implying it is complete. Interactive continuation prompts also fail for scheduled/non-interactive runs where there is no new user message after compaction.

## Proposed improvement
Persist an explicit `active_goal_checkpoint` outside the summarizable transcript. Before compaction, capture goal, completion criteria, pending work, evidence references, external handles, and resume mode. After compaction, deterministically validate that the checkpoint is still actionable and require the agent to resume or emit a terminal failure—not silently succeed or ask for a new instruction when autonomous continuation was required.

## Package tree
- `evidence/research.md`
- `skills/compaction-continuity-analysis.md`
- `rules/task-continuity-rules.md`
- `subagents/continuity-verifier.md`
- `workflows/capture-compact-resume.md`
- `workflows/recovery.md`
- `hooks/pre-compaction-checkpoint.md`
- `scripts/validate_checkpoint.py`
- `config/checkpoint.example.json`
- `tests/test_validate_checkpoint.py`

## Installation
Python 3.10+. No third-party dependencies.

## Configuration
Integrate the checkpoint with runtime state that is not discarded by transcript compaction. Required fields are defined by the validator. `resume_mode` is `autonomous` or `interactive`.

## Usage
`python scripts/validate_checkpoint.py config/checkpoint.example.json`

Exit 0 means the checkpoint is safe to resume. Exit 2 is a blocking continuity defect. Exit 1 is malformed input/runtime failure.

## Workflow
Observe -> capture pre-compaction baseline -> persist checkpoint -> compact -> reload checkpoint -> validate invariants -> resume unfinished work -> verify completion against explicit criteria. Recovery attempts are bounded to two.

## Metrics
Checkpoint coverage; compactions with intact active goal; false-success rate after compaction; unnecessary user re-prompts; lost pending handles; resumed-task completion rate; rework/tool-call overhead after compaction.

## Verification
**Implemented:** checkpoint schema-by-validation, rules, hooks, bounded workflows, tests.  
**Measured:** before/after traces record whether goal, pending work, and completion criteria survive compaction.  
**Verified:** autonomous fixtures resume without a new user message; incomplete checkpoints block success; completed tasks terminate normally; independent verifier confirms observable completion evidence.

## Safety
The checkpoint stores observable task state, never hidden chain-of-thought. Secrets and raw credentials MUST NOT be persisted. Dangerous pending actions still require normal authorization/human approval after resume.

## Failure handling
Detection: validator failure, missing checkpoint, lost pending handle, or post-compaction no-progress. Retry capture/reconstruction at most twice using durable evidence. If still unresolved, emit a terminal blocked state and escalate; never mark the task successful.

## Definition of Done
Evidence documented; active goal captured; completion criteria explicit; pending work represented; validator/tests pass; resume behavior measured; no false success; no secret material persisted; independent verification complete.

## Customization
Add domain-specific checkpoint fields (ticket ID, deployment state, test shard, research source IDs) while keeping goal, criteria, status, pending work, evidence, resume mode, and version mandatory.