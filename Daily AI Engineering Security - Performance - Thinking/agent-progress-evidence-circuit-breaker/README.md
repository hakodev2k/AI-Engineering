# Agent Progress Evidence Circuit Breaker

**Category:** Thinking

## Problem
Long-running agent loops can keep consuming tokens and time while producing no verifiable progress. A fixed step cap is too blunt: it can terminate productive work early while still allowing a stuck run to burn its full budget.

## Evidence
See `evidence/research.md`. Current public signals include an August 10, 2026 Codex report of automatic continuation turns that consumed tokens without doing work, an August 10 Codex report where a persisted paused goal still received continuation turns, and a July 21 Vercel AI SDK request for repeated-identical-tool-call detection because existing loop controls leave a gap between blunt step caps and effectively unbounded loops.

## Existing approach
Typical controls are fixed maximum steps, model-declared loop completion, user interruption, task status flags, and ad-hoc duplicate-call detection.

## Existing limitations
Step caps do not measure progress; model-declared completion is not a deterministic stop condition; scheduler/task state can disagree with persisted goal state; duplicate calls are only one form of no-progress behavior.

## Proposed improvement
Add a deterministic progress ledger and circuit breaker that requires observable progress evidence across continuation windows. Progress is defined by measurable state changes such as changed files, changed test results, new evidence IDs, new tool-result hashes, or completion-state transitions. Repeated no-progress windows, identical calls, or paused/blocked states stop continuation before another model/tool step is scheduled.

## Architecture

```text
agent-progress-evidence-circuit-breaker/
├── README.md
├── evidence/research.md
├── config/policy.json
├── scripts/progress_guard.py
├── tests/test_progress_guard.py
├── skills/progress-evidence-analysis.md
├── rules/bounded-agent-loop.md
├── subagents/progress-verifier.md
├── workflows/diagnose-and-gate.md
└── hooks/pre-continuation.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Tune deterministic thresholds in `config/policy.json`. Keep retry limits bounded. Do not increase thresholds merely to make a failing run continue.

## Usage

```bash
python scripts/progress_guard.py --events run-events.jsonl --policy config/policy.json
```

Exit `0` means continuation is permitted. Exit `3` means the run must stop or escalate.

## Workflow
Observe → capture baseline → classify progress evidence → evaluate repeated/no-progress windows → continue only if policy permits → independently verify before completion.

## Metrics
- consecutive no-progress windows
- repeated identical tool-call count
- unique progress-evidence count
- tokens spent per accepted progress event
- continuation turns after paused/blocked state
- bounded-retry compliance

## Verification
Run:

```bash
python -m unittest tests/test_progress_guard.py
```

## Safety
The guard does not request hidden chain-of-thought. It evaluates only observable events and state transitions. Dangerous or irreversible actions still require the platform's normal authorization and human-approval boundaries.

## Failure handling
Detection is deterministic. Maximum no-progress continuations and duplicate-call thresholds are finite. When blocked, preserve evidence and escalate rather than silently extending the loop.

## Definition of Done
**Implemented:** policy, guard, hook, workflow, and tests are integrated.  
**Measured:** baseline and post-change loop metrics are captured.  
**Verified:** regression fixtures pass; paused/blocked goals do not continue; repeated/no-progress loops stop within policy bounds; independent reviewer confirms evidence before completion.

## Customization
Add domain-specific progress signals only when they are externally observable and testable. Do not count commentary, intention statements, or repeated status acknowledgements as progress.