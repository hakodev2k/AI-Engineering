# Progress Liveness Gate

**Category:** Thinking  
**Date:** 2026-08-20 (UTC+7)

## Problem
Long-running agents can appear active while making no measurable progress: repeating continuation messages, reviews, planning loops, or support artifacts without changing the requested deliverable or satisfying acceptance criteria.

## Evidence
See `evidence/research.md`. Current public Codex reports show automatic continuation loops consuming tokens without edits, layered instruction stacks causing repeated meta-workflows with zero implementation, and tasks terminating after proxy artifacts while explicit acceptance gates remain unsatisfied.

## Existing approach
Common controls include max-turn limits, generic retry counters, plan/execute/review loops, user-authored stop instructions, and automatic continuation.

## Existing limitations
Turn counts measure activity rather than liveness. Repeated prose, plans, or reviews can keep a loop alive without advancing the goal. Failed approaches may also repeat without a changed hypothesis.

## Proposed improvement
Measure liveness using goal-relevant state deltas, maintain a no-progress streak, require a changed hypothesis after stagnation, and stop autonomous continuation after a bounded threshold.

## Architecture
- `evidence/research.md` — current signals and root-cause analysis.
- `skills/liveness-analysis.md` — reusable progress-analysis procedure.
- `rules/progress-and-stop.md` — observable thinking/reliability rules.
- `subagents/liveness-verifier.md` — independent verifier.
- `workflows/observe-progress-recover.md` — bounded execution/recovery workflow.
- `hooks/post-iteration-liveness-check.md` — continuation gate.
- `scripts/liveness_gate.py` — deterministic liveness evaluator.
- `tests/test_liveness_gate.py` — regression tests.

## Installation
Python 3.10+; no third-party packages.

## Configuration
Each iteration writes JSON such as:
```json
{
  "no_progress_streak": 1,
  "hypothesis_changed": false,
  "mandatory_criteria_open": 2,
  "claim_complete": false,
  "events": [
    {"kind":"required_test_passed","id":"api-tests","verified":true}
  ]
}
```
Counted event kinds are: `criterion_satisfied`, `required_test_passed`, `deliverable_changed`, `verified_evidence_added`, and `blocker_removed`. Events only count when `verified: true`.

## Usage
```bash
python scripts/liveness_gate.py --input iteration.json
```
Exit codes: `0` measurable progress, `1` invalid input, `2` bounded recovery/action change required, `3` stop autonomous continuation.

## Workflow
Snapshot active goal → execute one bounded stage → measure state delta → independent liveness verification → continue only on progress → require changed hypothesis after stagnation → stop at threshold → verify every mandatory criterion before completion.

## Metrics
No-progress iterations, criteria completed per iteration, tokens per accepted criterion, repeated-hypothesis count, recovery success rate, forced-stop count, final acceptance coverage.

## Verification
```bash
python -m unittest tests/test_liveness_gate.py
```
Integration verification should feed real iteration events from diffs, test results, acceptance ledgers, and blocker tracking.

## Safety
The package does not request hidden chain-of-thought. It uses observable Facts, Evidence, Hypothesis IDs, Decisions, Risks, and Verification status. It never weakens security or verification requirements to create artificial progress.

## Failure handling
If liveness cannot be measured, long-running autonomous continuation becomes indeterminate and should pause for a human checkpoint. After two zero-progress iterations, an unchanged hypothesis is rejected. After three, the loop stops.

## Definition of Done
**Implemented:** all package artifacts and deterministic evaluator exist.  
**Measured:** progress/no-progress, hypothesis-change, acceptance, and token/time metrics are collected.  
**Verified:** fixtures show that prose-only activity does not reset liveness, completion with open mandatory criteria is blocked, retry loops remain bounded, and final required criteria are independently verified.

## Customization
Organizations may add additional event kinds only when each is objectively verifiable and directly advances an explicit acceptance criterion or removes a real blocker.