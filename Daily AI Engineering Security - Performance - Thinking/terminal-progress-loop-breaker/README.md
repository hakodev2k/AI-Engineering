# Terminal Progress Loop Breaker

**Category:** Thinking

## Problem
An agent can stay alive and keep calling tools without making durable progress. Some runtimes detect repeated behavior but only block a tool or warn the model; the model can then retry near-equivalent actions until an external timeout or budget ends the run.

## Evidence
August 2026 signals include OpenClaw reports where critical loop detection did not terminate the run and a measured agent run that used about 1.06M tokens without writing a patch. Current GitHub Copilot SDK documentation exposes per-turn events and separates mechanical idle from best-effort semantic task completion, enabling an external progress governor. See `evidence/research.md`.

## Existing approach
Hard turn/token/time limits, warning thresholds, model nudges, manual interruption, and best-effort completion signals.

## Existing limitations
Hard budgets can stop too late; warning-only detectors lack terminal ownership; activity is easily mistaken for progress; exact-match fingerprints miss retries with volatile argument changes.

## Proposed improvement
Use observable event fingerprints plus durable progress markers and an external runtime-owned terminal state. Equivalent repeated failures are bounded, hard budgets remain in place, and the model cannot override a terminal decision.

## Architecture
```text
terminal-progress-loop-breaker/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── post-tool-result.md
├── rules/
│   └── progress-and-terminal-ownership.md
├── scripts/
│   └── progress_loop_guard.py
├── skills/
│   └── observable-progress-governance.md
├── subagents/
│   └── progress-verifier.md
├── tests/
│   └── test_progress_loop_guard.py
└── workflows/
    ├── baseline-diagnose-integrate.md
    └── regression-verification.md
```

## Installation
Python 3.10+; no third-party Python dependencies.

## Configuration
Edit `config/policy.json` after measuring successful and failed traces for the target task class. Keep hard turn/token/time budgets enabled even when equivalent-failure detection is active.

## Usage
After every tool result, provide an event with turn, tokens used, wall time, tool, arguments, result class, and durable progress markers:

`python scripts/progress_loop_guard.py --state run-state.json --event event.json --policy config/policy.json`

Exit 0 permits continuation. Exit 4 means the runtime must checkpoint/stop or terminate. Exit 2 means input parsing failed.

## Workflow
Use `workflows/baseline-diagnose-integrate.md` for initial integration and incidents. Use `workflows/regression-verification.md` for every change to loop detection, retries, budgets, or terminal handling.

## Metrics
Zero-progress turns before stop; tokens/time after first repeated equivalent failure; false-stop rate; durable-artifact completion rate; median/p95 cost per completed task.

## Verification
Run:

`python -m unittest tests/test_progress_loop_guard.py`

Then replay representative successful, transient-failure, runaway-loop, and hard-budget traces. Independent verification is defined in `subagents/progress-verifier.md`.

## Safety
The package uses only observable events and durable state. It does not request hidden chain-of-thought. Existing authorization and human-approval controls remain authoritative for dangerous or irreversible actions.

## Failure handling
**Detection:** terminal guard decision, budget exhaustion, or missing required event data.  
**Evidence:** bounded event history, fingerprints, progress markers, reason codes, and runtime terminal state.  
**Retry policy:** maximum two threshold/hypothesis revisions; one full benchmark rerun per revision.  
**Fallback:** disable autonomous continuation for the affected task class while retaining hard budgets.  
**Escalation:** inability to own terminal state, ambiguous progress semantics, or unsafe checkpointing.  
**Stop condition:** exhausted retries, any post-terminal model turn, or unresolved runaway path.

## Definition of Done
**Implemented:** post-tool gate controls whether another model turn can be scheduled.  
**Measured:** baseline and post-change cost/progress/false-stop metrics are captured.  
**Verified:** deterministic tests pass; transient recovery still succeeds; confirmed zero-progress loops terminate within policy; an independent verifier confirms the model cannot override terminal state.

## Customization
Define task-specific durable progress markers such as patch hashes, changed-file digests, new evidence IDs, passing-test sets, or completed workflow checkpoints. Do not count mere messages, heartbeats, or repeated reads as progress.
