# Long-Running Agent Convergence Gate

**Category:** Thinking

## Problem
Long-running coding agents can keep creating review cycles, subagent lanes, or empty continuation turns instead of reducing a finite set of acceptance criteria.

## Evidence
`evidence/research.md` documents current 2026 reports from OpenAI Codex and oh-my-openagent.

## Existing approach
Task lists, planner/reviewer agents, manual interruption, and prose retry instructions.

## Existing limitations
Lists can expand, reviewers can manufacture work, and model-level stop instructions are not deterministic.

## Proposed improvement
A machine-checkable acceptance ledger plus a deterministic convergence guard enforcing cycle caps, no-progress limits, causal new-work rules, and snapshot-and-stop recovery.

## Architecture
```text
README.md
config/convergence-policy.json
schemas/progress-ledger.schema.json
evidence/research.md
skills/convergence-diagnosis.md
rules/convergence-contract.md
subagents/convergence-reviewer.md
workflows/observe-converge.md
workflows/failure-recovery.md
hooks/post-cycle-check.md
scripts/convergence_guard.py
tests/test_convergence_guard.py
```

## Installation
Python 3.10+; no third-party dependencies.

## Configuration
Adjust only `config/convergence-policy.json`. Tighten limits for costly or high-risk tasks. Do not disable evidence or independent verification.

## Usage
Maintain a ledger matching `schemas/progress-ledger.schema.json`, then run:
`python scripts/convergence_guard.py --ledger ledger.json --policy config/convergence-policy.json`

## Workflow
Use `workflows/observe-converge.md`; on a stop decision, use `workflows/failure-recovery.md`.

## Metrics
Cycles to completion, no-progress cycles, remaining criteria, new-work items per failed criterion, rework rate, snapshot latency.

## Verification
Run:
`python -m unittest tests/test_convergence_guard.py`

## Safety
The guard never authorizes deployment or destructive actions. It preserves scope and requires independent verification. Dangerous or irreversible operations remain human-gated.

## Failure handling
Detection is deterministic. Maximum same-criterion corrections: 2. Non-convergence triggers snapshot-and-stop rather than more autonomous work.

## Definition of Done
**Implemented:** ledger, guard, hook, bounded workflows integrated.  
**Measured:** per-cycle metrics captured.  
**Verified:** unit tests pass, guard reaches `complete`, independent reviewer confirms evidence and no blocking issue remains.

## Customization
Add project-specific criterion evidence fields or stricter cycle caps without weakening causal new-work and stop rules.
