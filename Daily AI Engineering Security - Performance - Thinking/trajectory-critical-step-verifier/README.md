# Trajectory Critical-Step Verifier

**Category:** Thinking

## Problem
Long-horizon agents can commit to an early wrong assumption, continue executing for many steps, and later self-verify against the same mistaken interpretation. Final success/failure and narrative self-reflection do not reliably reveal where the decisive error entered the trajectory.

## Evidence
`evidence/research.md` documents current public evidence, including LongRCA Bench (August 2026), checkpoint-based diagnosis research published August 20, 2026, Microsoft Research AgentRx, and SWE-Marathon.

## Existing approach
Teams commonly rely on final tests, outcome-level benchmark scores, self-reflection, complete trajectory logs, end-of-run human review, and LLM-as-a-judge evaluation.

## Existing limitations
Final tests may validate the wrong interpretation; outcome scores do not localize failure; self-verification shares assumptions with the generator; long traces are costly to inspect; unresolved assumptions can silently become premises; agents may continue far beyond a useful replan point.

## Proposed improvement
Use a minimal observable trajectory contract. Every step records evidence IDs, active/resolved assumption IDs, verification status, and progress claim. A deterministic guard identifies unsupported completion, unresolved assumptions, and excessive spans without verified checkpoints. Recovery starts from the last verified checkpoint and final completion requires independent verification.

This package never asks for or records hidden chain-of-thought.

## Architecture
```text
trajectory-critical-step-verifier/
├── README.md
├── evidence/
│   └── research.md
├── hooks/
│   └── pre-completion.md
├── rules/
│   └── verification-discipline.md
├── schemas/
│   └── trajectory-event.schema.json
├── scripts/
│   └── trajectory_guard.py
├── skills/
│   └── critical-step-analysis.md
├── subagents/
│   └── trajectory-reviewer.md
├── templates/
│   └── evidence-ledger.md
├── tests/
│   └── test_trajectory_guard.py
└── workflows/
    └── diagnose-and-recover.md
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Set `--max-unverified-steps` according to task risk and cost. A smaller value gives earlier checkpoints. Do not increase the value merely to suppress warnings.

## Usage
Create JSONL events matching `schemas/trajectory-event.schema.json`, one event per step:

```bash
python scripts/trajectory_guard.py trace.jsonl --max-unverified-steps 5
```

Exit codes: `0` clean observable trajectory; `3` independent verification/replan required; `2` invalid input.

Use `templates/evidence-ledger.md` to assign stable IDs to facts, evidence, assumptions, hypotheses, decisions, risks, and verification status.

## Workflow
Follow `workflows/diagnose-and-recover.md`: Observe → Measure baseline → Diagnose first risk step → Form/test hypothesis → Replan from last verified checkpoint → Implement → Measure again → Independent verify.

## Metrics
- Steps to first detected risk
- Verification coverage
- Maximum unverified span
- Unsupported completion count
- Unresolved assumptions at completion
- Recovery retries
- Rework after final review
- Acceptance-criterion evidence coverage

## Verification
Run:

```bash
python -m unittest tests/test_trajectory_guard.py
```

The deterministic test suite covers clean completion, unsupported completion, unresolved assumptions, and bounded checkpoint spans. The script and tests were executed successfully before publication.

## Safety
Do not expose hidden reasoning. Use explicit artifacts only. Dangerous or irreversible actions require explicit human approval independent of this verification mechanism. Verification must not weaken security or acceptance criteria to obtain a pass.

## Failure handling
**Detection:** non-zero guard result, failed deterministic test, unresolved assumption, or independent-review failure.  
**Evidence:** original trace, first risk step, evidence ledger, test results.  
**Retry policy:** maximum 2 recovery attempts from the last verified checkpoint.  
**Fallback:** stop autonomous continuation and produce an escalation packet containing only observable facts/evidence gaps.  
**Escalation:** responsible engineer/reviewer.  
**Stop condition:** exhausted retries, contradictory requirements, unavailable critical evidence, or inability to independently verify.

## Definition of Done
**Implemented:** trajectory schema, guard, hook, evidence ledger, workflow, rules, and reviewer role integrated.  
**Measured:** baseline and post-change trajectory metrics captured.  
**Verified:** deterministic tests pass; no unsupported completion remains; critical assumptions are resolved; checkpoint policy is met; independent reviewer reproduces decisive evidence and final acceptance checks.

## Customization
Add domain-specific evidence types, acceptance checks, and risk-based checkpoint intervals while preserving the invariants: observable assumptions, evidence-linked claims, bounded loops, stop conditions, and independent verification.
