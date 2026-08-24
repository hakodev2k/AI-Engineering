# Multimodal Transcript Materialization Amplification Guard

**Category:** Performance

## Problem
Long-lived AI coding sessions with screenshots or generated images can become disproportionately expensive to resume, render, fork, compact, and persist. Recent reports show duplicate inline base64, whole-transcript reification, repeated image inheritance into child rollouts, and hidden generated-image retention producing multi-gigabyte disk state, multi-gigabyte RAM spikes, freezes, and host OOM failures.

## Evidence
See `evidence/research.md`.

## Existing approach and limitation
Transcript JSONL plus inline image blocks preserves fidelity, but the same bytes can exist in raw transcript text, parsed objects, normalized messages, wire payloads, logs, caches, and child snapshots. Token compaction alone does not bound disk or RAM amplification.

## Proposed improvement
Measure transcript and image-byte amplification before resume/fork/compaction, enforce explicit budgets, prefer references/content-addressed storage over duplicate base64, stream large transcripts, and block high-risk materialization until the workload is reduced or isolated.

## Architecture
- `skills/materialization-baseline.md`
- `rules/materialization-budget.md`
- `subagents/performance-verifier.md`
- `workflows/measure-optimize-verify.md`
- `workflows/failure-recovery.md`
- `hooks/pre-resume-budget.md`
- `scripts/transcript_profile.py`
- `config/budgets.json`
- `tests/test_transcript_profile.py`
- `evidence/research.md`

## Installation
Python 3.10+, no third-party dependencies.

## Usage
`python scripts/transcript_profile.py path/to/session.jsonl --budget config/budgets.json`

`python -m unittest tests/test_transcript_profile.py`

## Metrics
Transcript bytes, base64 bytes, duplicate-payload ratio, largest line, image-bearing lines, projected materialization, peak RSS, resume/fork latency, and child-state amplification.

## Workflow
Measure baseline -> diagnose -> hypothesize one change -> optimize -> measure again -> independent verification. Maximum optimization retries: 2.

## Verification
**Implemented:** profiler, budget gate, rules, workflows, tests.

**Measured:** capture real before/after transcript metrics, peak RSS, and elapsed time.

**Verified:** resource metrics improve below configured budgets, resume/fork succeeds, required context is preserved, and an independent verifier confirms the result.

## Safety
The profiler is read-only and never decodes image payloads to disk, edits transcripts, or deletes generated artifacts. Cleanup must use supported mechanisms or explicit human approval.

## Failure handling
A budget violation blocks high-risk automatic resume/fan-out. Retry optimization at most twice. Never manufacture a pass by deleting required context or weakening correctness/security.

## Definition of Done
Baseline captured; dominant source identified; budget enforced; before/after measurements recorded; required context retained; tests pass; independent verification passes.