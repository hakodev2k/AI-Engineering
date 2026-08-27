# Agent Progress Convergence Guard

**Category:** Thinking

## Problem
Long-running coding-agent and subagent workflows can keep expanding planning, governance, reviews, and delegated work without proportional production progress or a bounded stop condition.

## Evidence
See `evidence/research.md` for current August 2026 public signals.

## Existing approach
Current systems use task lists, subagents, status polling, review cycles, and user intervention. These mechanisms help orchestration but do not automatically prove that each cycle increases accepted production progress.

## Existing limitations
Process activity is often mistaken for task progress; objectives can expand; review/rework loops can repeat without an explicit progress delta; and termination is frequently based on model judgment instead of measurable acceptance evidence.

## Proposed improvement
Introduce a deterministic progress ledger and convergence gate. Every work cycle must declare accepted deliverable delta, unresolved blockers, scope growth, evidence, and retry count. A cycle with no accepted delta cannot silently spawn more process work. Repeated zero-delta cycles stop and escalate.

## Architecture
- `evidence/research.md` — current evidence and root-cause analysis
- `skills/progress-convergence-analysis.md` — reusable diagnosis procedure
- `rules/convergence-rules.md` — enforceable rules
- `subagents/verification-agent.md` — independent verification role
- `workflows/execute-and-converge.md` — bounded execution loop
- `workflows/failure-recovery.md` — bounded recovery path
- `hooks/post-cycle-convergence-check.md` — deterministic blocking hook
- `scripts/convergence_guard.py` — machine-readable gate
- `tests/test_convergence_guard.py` — regression tests
- `examples/cycle-log.json` — example input

## Installation
Python 3.10+. No third-party dependencies.

## Usage
`python scripts/convergence_guard.py --log examples/cycle-log.json --max-zero-delta 2 --max-scope-growth 1`

## Workflow
Use `workflows/execute-and-converge.md`; on a blocked gate, switch to `workflows/failure-recovery.md`.

## Metrics
Accepted deliverables per cycle; zero-delta cycle count; scope-growth events; review-to-implementation ratio; bounded retry count; cycles to Definition of Done; unsupported-completion rate.

## Verification
Run `python -m unittest tests/test_convergence_guard.py`.

## Safety
The guard does not request hidden chain-of-thought. It evaluates observable artifacts, evidence, accepted deliverables, blockers, and retry counts. Dangerous or irreversible actions still require explicit human approval.

## Failure handling
Detection: zero accepted delta, unapproved scope growth, repeated review-only cycles, or exhausted retries. Evidence: cycle log and acceptance artifacts. Maximum retries: 2 after diagnosis. Fallback: freeze scope and return the smallest verified partial deliverable. Escalation: unresolved blocker or required scope change. Stop condition: configured threshold reached or acceptance cannot be verified.

## Definition of Done
**Implemented:** ledger and gate integrated into the workflow.  
**Measured:** baseline and cycle metrics collected.  
**Verified:** regression tests pass; independent verifier confirms accepted production delta and no unbounded loop remains.

## Customization
Adjust thresholds for task size, but preserve bounded retries, explicit scope control, and evidence-backed acceptance.
