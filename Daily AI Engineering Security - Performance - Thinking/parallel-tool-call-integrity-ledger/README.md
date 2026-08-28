# Parallel Tool Call Integrity Ledger

**Category:** Thinking

## Problem
Agent orchestration layers can silently lose, collapse, mis-pair, or omit parallel tool calls/results. A valid model response does not guarantee that execution state is complete before the next reasoning step.

## Evidence
See `evidence/research.md`.

## Existing approach
Framework pairing repair, provider adapters, retries, HITL state hydration, and sequential fallbacks.

## Existing limitations
Silent drops may look like empty success; state spans streaming/dispatch/approval/resume; blind retries can duplicate side effects.

## Proposed improvement
Maintain a deterministic ledger keyed by batch and stable call ID. Require exactly one terminal outcome per declared call before advancing, and fail closed on ambiguous mutations.

## Architecture
`evidence/research.md`, `schemas/event.schema.json`, `scripts/tool_call_ledger.py`, `tests/test_tool_call_ledger.py`, `skills/parallel-call-reconciliation.md`, `rules/tool-call-integrity.md`, `workflows/reconcile-and-recover.md`, `hooks/pre-next-model-turn.md`.

## Installation
Python 3.10+, no third-party packages.

## Usage
`python scripts/tool_call_ledger.py events.jsonl`

## Metrics
Missing-result rate, duplicate-result rate, orphan rate, ambiguous mutations, recovery success, rework turns.

## Verification
`python -m unittest discover -s tests`

## Safety
Never replay an ambiguous mutating call automatically.

## Failure handling
One safe retry for proven read-only/idempotent absence; maximum two reconciliation passes; ambiguous mutation escalates immediately.

## Definition of Done
Implemented: ledger checkpoint integrated. Measured: integrity baseline captured. Verified: loss, duplicate, orphan, and mutation ambiguity fixtures detected with no unsafe replay.
