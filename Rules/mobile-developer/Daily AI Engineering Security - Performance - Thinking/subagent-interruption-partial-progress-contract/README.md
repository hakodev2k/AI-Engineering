# Subagent Interruption Partial-Progress Contract

**Category:** Thinking

## Problem
Interrupted child agents can have real partial work and side effects even when the parent receives only a generic error such as “interrupted.” Without a structured handoff, the parent can misattribute the cause, deny actions that happened, redo work, or retry unsafe operations.

## Evidence
See `evidence/research.md`. August 2026 public reports document user interruptions with missing child progress, quota exhaustion without handoff, watchdog timeouts mislabeled as user interruption, and headless success while child work remained incomplete.

## Existing approach and limitations
A single terminal status is too lossy. Raw transcripts are too low-level for normal orchestration. Blind retry can duplicate side effects. Workspace inspection alone cannot account for network/external actions.

## Proposed improvement
Require a structured partial-progress envelope for every non-clean child termination and block retry/completion until it is validated and reconciled against observable state.

## Architecture
- `schemas/partial-progress.schema.json` — interoperable envelope shape.
- `config/policy.json` — causes, required fields, and retry policy.
- `scripts/validate_partial_progress.py` — deterministic validator/recovery safety gate.
- `tests/test_validate_partial_progress.py` — executable fixtures.
- `rules/interruption-handoff.md` — parent/child invariants.
- `skills/interruption-recovery.md` — evidence-driven recovery procedure.
- `subagents/recovery-verifier.md` — independent state verifier.
- `workflows/interrupt-reconcile-recover.md` — bounded recovery workflow.
- `hooks/post-interruption-gate.md` — automatic post-interruption block.
- `evidence/research.md` — public evidence and analysis.

## Package tree
```text
subagent-interruption-partial-progress-contract/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/post-interruption-gate.md
├── rules/interruption-handoff.md
├── schemas/partial-progress.schema.json
├── scripts/validate_partial_progress.py
├── skills/interruption-recovery.md
├── subagents/recovery-verifier.md
├── tests/test_validate_partial_progress.py
└── workflows/interrupt-reconcile-recover.md
```

## Installation
Python 3.10+; standard library only. Integrate your runtime so non-clean child termination emits the JSON envelope before parent recovery.

## Configuration
Adjust allowed causes and retry budget in `config/policy.json`. Keep causes mutually understandable at the parent boundary. If the runtime cannot prove human initiation, use `unknown` or the actual machine cause rather than `user_cancelled`.

## Usage
```bash
python scripts/validate_partial_progress.py envelope.json --policy config/policy.json
python -m unittest discover tests -v
```
Exit 0 means the envelope meets policy; 4 means unsafe/incomplete recovery state; 2 means malformed evidence/config.

## Workflow
Follow `workflows/interrupt-reconcile-recover.md`: Observe → Validate → Reconcile → Choose recovery → Recover → Verify. Recovery retries are bounded to two by default.

## Metrics
Structured-envelope coverage, cause accuracy, side-effect verification coverage, duplicate action rate, recovered checkpoint reuse, unsupported parent conclusions, rework time/tokens.

## Verification
**Implemented:** schema, policy, validator, tests, rules, skill, reviewer, workflow, and hook exist.

**Measured:** consumers must baseline interruption/rework behavior in their runtime.

**Verified:** only when product-specific interruption fixtures show truthful cause/progress handoff, side effects are reconciled before retry, and final deliverables are independently checked.

## Safety
This package records operational facts, not hidden chain-of-thought. Do not put secrets in envelopes. Dangerous or irreversible actions require explicit human approval before replay. Unknown state remains unknown until verified.

## Failure handling
Invalid envelope blocks automatic retry. Side effects force verify-first or escalation. Maximum two recovery retries; unresolved ambiguity stops automation instead of looping.

## Definition of Done
Evidence documented; baseline captured; all tested non-clean terminations emit valid envelopes; causal attribution is correct; partial side effects/checkpoints are reconciled; retries are bounded; duplicate work reduced/measured; final verification complete; no blocking unknown remains.

## Customization
Add domain-specific side-effect types (GitHub comment, deployment, database write, payment, filesystem write) and read-only verification adapters. Preserve the core rule that missing evidence never becomes a confident “nothing happened.”
