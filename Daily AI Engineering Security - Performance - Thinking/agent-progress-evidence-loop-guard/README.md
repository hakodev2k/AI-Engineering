# Agent Progress Evidence Loop Guard

**Category:** Thinking

## Problem
Tool-using agents can remain live while repeatedly performing equivalent actions without creating new artifacts, verification evidence, or external-state change. Hard step/token/time ceilings limit worst-case cost but are poor at distinguishing productive long runs from no-progress loops.

## Evidence
See `evidence/research.md`. Current 2026 signals include Vercel AI production-oriented reports of repeated identical tool-call loops and hard-stop behavior, plus a measured long-running benchmark case that consumed substantial tokens without producing the intended patch.

## Existing approach
Step caps, wall-clock/token budgets, exact repeated-call checks, model self-reflection, and manual cancellation.

## Existing limitations
Budget caps detect exhaustion rather than progress. Exact-call checks miss semantically equivalent retries. Model-only recovery is not independent. Polling can legitimately repeat when results change.

## Proposed improvement
A deterministic runtime-side progress guard that canonicalizes tool actions and compares them with result/durable-state fingerprints. It stops only after a bounded streak of equivalent actions with no new evidence, while allowing repeated polling when observed state changes.

## Architecture
```
agent-progress-evidence-loop-guard/
├── README.md
├── config/
│   └── policy.json
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-step-progress-check.md
├── rules/
│   └── progress-control.md
├── scripts/
│   └── progress_guard.py
├── skills/
│   └── progress-evidence-analysis.md
├── subagents/
│   └── verification-agent.md
├── tests/
│   └── test_progress_guard.py
└── workflows/
    └── observe-recover-verify.md
```

## Installation
Python 3.10+; standard library only.

## Configuration
Edit `config/policy.json` to set the no-progress streak, hard step ceiling, recovery limit, checkpoint requirement, and progress fingerprint fields. Do not remove hard limits merely because the progress guard is enabled.

## Usage
Prepare JSONL where each step may include `tool_calls`, `tool_result`, and configured durable-state fingerprint fields. Run:

`python scripts/progress_guard.py --trace trace.jsonl --policy config/policy.json`

Exit `0` = continue; `3` = stop/recover; `2` = invalid evidence/configuration.

## Workflow
Follow `workflows/observe-recover-verify.md`: Observe → Measure baseline → Diagnose → Form hypothesis → Recover → Measure again → independently verify. Recovery is limited to two attempts.

## Metrics
- Steps and tokens after the last durable progress event.
- No-progress streak length at stop.
- Recovery attempts and recovery success rate.
- False-positive stops on legitimate polling.
- Verified completion rate after recovery.

## Verification
Run:

`python -m unittest tests/test_progress_guard.py`

The independent verifier in `subagents/verification-agent.md` must confirm completion or resumed progress from observable evidence.

## Safety
No hidden chain-of-thought is requested or stored. The package never treats liveness as progress and never weakens task acceptance criteria to avoid a stop.

## Failure handling
Detection failures return exit `2` and block autonomous continuation. No-progress recovery is bounded to two attempts. When recovery fails, persist partial work plus the last verified checkpoint and escalate rather than retry indefinitely.

## Definition of Done
**Implemented:** guard, policy, hook, workflow, rules, verifier and tests are integrated.  
**Measured:** trace metrics and durable-state fingerprints are collected.  
**Verified:** tests pass; no-progress fixtures stop; changing-result polling continues; an independent verifier confirms that completion/progress claims are evidence-backed.

## Customization
Add application-specific progress fingerprints such as test-result hashes, PR diff hashes, deployment state IDs, ticket state versions, or database snapshot IDs. Preserve canonical action comparison, hard ceilings, bounded recovery, and independent verification.
