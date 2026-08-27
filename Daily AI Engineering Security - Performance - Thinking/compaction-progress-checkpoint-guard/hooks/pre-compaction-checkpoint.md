# Hook: Pre-Compaction Checkpoint

## Trigger
Immediately before a context compaction or intentional session handoff.

## Preconditions
Task ID and acceptance criteria exist.

## Action
Serialize a checkpoint matching `schemas/checkpoint.schema.json` with facts, completed/pending steps, rejected hypotheses, progress token, verification status, and next action.

## Script/command
Use the host system's JSON serializer and validate against `schemas/checkpoint.schema.json` when a JSON Schema validator is available.

## Expected result
Checkpoint is complete, secret-free, and stored with task artifacts.

## Failure behavior
Block autonomous compaction when task continuity would otherwise be lost; if platform compaction cannot be blocked, emit the smallest safe checkpoint possible and mark verification incomplete.

## Blocking
Yes when controllable.
