# Multi-Interrupt Resume Addressability Gate

## Topic
Deterministic binding of human resume values to pending interrupt IDs across parallel and nested agent workflows.

## Category
Thinking

## Problem
When multiple human interrupts are pending, a scalar resume can be semantically ambiguous even if it is syntactically valid. Nested subgraphs can hide that multiplicity from validation and allow one branch to consume a value that was not explicitly addressed to it.

## Evidence
See `evidence/research.md`. The primary current signal is LangGraph issue #8579 (2026-08-09), which reproduces scalar resume acceptance with two pending interrupt IDs inside one subgraph task. PR #6108 documents the intended invariant, and official LangGraph interrupt documentation recommends pairing interrupt IDs with resume values when handling multiple interrupts.

## Existing approach
Interrupt IDs, `Command(resume=...)`, runtime validation for multiple pending interrupts, and application-level human-in-the-loop forms.

## Existing limitations
Validation may count top-level tasks rather than effective interrupt IDs; nested parallelism can bypass the check; scalar values carry no target identity; serialization/order can drift; top-level-only tests miss nested behavior.

## Proposed improvement
Normalize the effective pending interrupt set before dispatch. When more than one unique ID is pending, reject scalar resumes and require an ID-keyed map. Reject unknown/duplicate IDs, allow policy-controlled partial addressed resumes, and verify that the exact predicted IDs remain pending afterward.

## Architecture
- `evidence/research.md` — observed evidence, interpretation, existing approaches, limitations, root causes.
- `config/policy.json` — addressability policy.
- `skills/resume-addressability-audit.md` — reusable analysis procedure.
- `rules/resume-addressability.md` — enforceable invariants.
- `subagents/interrupt-state-analyst.md` — canonical pending-set analyst.
- `subagents/resume-verification-agent.md` — independent verifier.
- `workflows/diagnose-and-enforce.md` — baseline-to-fix workflow.
- `workflows/regression-verification.md` — bounded case matrix.
- `hooks/pre-resume-addressability-gate.md` — deterministic blocking hook.
- `scripts/resume_gate.py` — dependency-free pre-resume validator.
- `tests/test_resume_gate.py` — regression tests.

## Installation
Python 3.9+ is sufficient for the reference validator; no third-party packages are required.

## Configuration
Map your runtime's durable interrupt objects to `pending_interrupts: [{"id": "..."}]`. Preserve IDs exactly. Adapt partial-resume policy only if your runtime can durably keep unaddressed interrupts pending.

## Usage
Run tests:

```bash
python -m unittest tests/test_resume_gate.py
```

Validate a resume payload:

```bash
python scripts/resume_gate.py resume-input.json --pretty
```

For multiple pending IDs, `resume` must be an object keyed by interrupt ID. The output lists `resumed_ids` and `remaining_ids`.

## Workflow
Observe → enumerate canonical pending IDs → capture baseline → diagnose validation scope → enforce ID-based addressability → measure post-resume state → independent verification.

## Metrics
Ambiguous scalar resumes rejected; unknown/duplicate IDs rejected; correctly addressed resumes accepted; nested-subgraph coverage; exact remaining-set match; unintended branch-consumption incidents.

## Verification
The reference validator was tested with five deterministic cases: scalar with multiple pending IDs, full addressed map, partial addressed map, unknown ID, and duplicate pending ID. Integrators must add a nested-subgraph test matching their runtime.

## Safety
Never guess a target from order or scheduling. Preserve durable checkpoint state when a resume is blocked. For approval/payment/deployment or other high-impact interrupts, existing human approval and side-effect protections remain mandatory.

## Failure handling
**Detection:** exit 2 or a post-resume remaining-set mismatch. **Evidence:** canonical pre/post ID sets plus reason code. **Retry:** at most two retries after changed implementation/evidence. **Fallback:** keep the checkpoint paused. **Escalation:** require explicitly addressed human input or runtime repair. **Stop condition:** ambiguous mapping or any value consumed by an unintended interrupt.

## Implemented / Measured / Verified
- **Implemented:** ID-normalization rules, deterministic gate, workflows, hook, and tests.
- **Measured:** five deterministic addressability cases.
- **Verified:** reference tests pass; runtime integration is verified only after top-level and nested-subgraph cases demonstrate exact consumed/remaining ID behavior.

## Definition of Done
Evidence documented; baseline captured; effective pending IDs are canonical; scalar resume with multiple IDs is blocked; valid ID maps work; unknown/duplicate IDs fail; partial resume preserves exact remaining state; nested regression passes; bounded verification completes; no blocking ambiguity remains.

## Customization
Runtimes may add signatures, decision types, expiry, actor identity, or batch-completion requirements. They MUST retain stable interrupt identity and MUST NOT route ambiguous scalar values by incidental order.
