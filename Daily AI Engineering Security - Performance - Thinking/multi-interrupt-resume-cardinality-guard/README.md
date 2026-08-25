# Multi-Interrupt Resume Cardinality Guard

**Category:** Thinking

## Problem
Human-in-the-loop agent runtimes can expose multiple simultaneous interrupts or approval requests, yet later accept a scalar response, apply only one response, or lose siblings during resume. This creates observable decision ambiguity: an answer can attach to the wrong pending request, an approved call can disappear, or a workflow can continue with unresolved decisions.

## Evidence
See `evidence/research.md`. Current 2026 reports from LangGraph and Microsoft Agent Framework independently show ambiguous scalar resume, dropped approved calls, lost parallel approval state, and invalid resumed histories.

## Existing approach
Frameworks use interrupt IDs, pending-approval registries, resumable checkpoints, and provider-level validation. Some reject scalar resume when multiple interrupts are visible.

## Existing limitations
Cardinality checks may count parent tasks instead of every nested interrupt; approval consumers may process only the first response; state may be queued across multiple runs; and provider validation happens after the workflow has already made a bad resume decision.

## Proposed improvement
Represent each interrupt as an immutable ID-bearing item and require exact set reconciliation at resume: every live interrupt receives exactly one explicit disposition, no unknown/stale IDs are accepted, and scalar resume is legal only when exactly one pending interrupt exists. Nested interrupts are flattened before validation. Resume application is atomic at the batch boundary.

## Architecture
- `evidence/research.md` — current evidence, approaches, gaps, root causes.
- `skills/interrupt-set-reconciliation.md` — reusable diagnosis and verification procedure.
- `rules/resume-cardinality-contract.md` — enforceable invariants.
- `subagents/resume-verifier.md` — independent verification role.
- `workflows/interrupt-resume-lifecycle.md` — bounded lifecycle workflow.
- `hooks/pre-resume-cardinality-check.md` — deterministic blocking hook.
- `scripts/interrupt_resume_guard.py` — dependency-free validator.
- `tests/test_interrupt_resume_guard.py` — regression tests.
- `examples/resume-batch.json` — valid multi-interrupt example.

## Installation
Python 3.10+; no third-party packages.

## Usage
```bash
python scripts/interrupt_resume_guard.py examples/resume-batch.json
python -m unittest tests/test_interrupt_resume_guard.py
```
Exit `0` means the resume set is complete and unambiguous; exit `2` blocks resume; exit `1` means invalid input/runtime failure.

## Workflow
Observe pending interrupts → flatten nested state → measure baseline mismatch/drop rate → form explicit set hypothesis → validate proposed resume → atomically apply → reconcile emitted terminal results → independently verify → continue.

## Metrics
`pending_interrupt_count`, `resume_response_count`, missing/unknown/duplicate IDs, scalar-on-multiple attempts, dropped-approved-call rate, unresolved-interrupt rate after resume, and resume verification latency.

## Verification
**Implemented:** deterministic validator, rules, hook, workflow, tests. **Measured:** target runtimes must capture baseline mismatch/drop counts. **Verified:** regression tests and integration traces must prove that 2+ pending interrupts reject scalar resume, exact ID maps pass, missing/unknown IDs block, and no approved sibling silently disappears.

## Safety
The guard never invents a human decision and never maps an unknown response to the “first” request. Rejection, approval, and cancellation remain distinct. High-impact actions still require the underlying authorization policy.

## Failure handling
Detection: set mismatch or illegal scalar resume. Evidence: sanitized IDs and counts. Retry: at most two attempts after refreshing current pending state. Fallback: ask the host to re-render the current exact interrupt set; do not guess. Escalation: human/workflow owner. Stop: any ambiguity after two attempts blocks continuation.

## Definition of Done
Evidence documented; interrupt identity preserved through nesting; exact set reconciliation enforced; scalar resume limited to cardinality one; batch application atomic; tests pass; target integration emits zero dropped approvals and zero misbound responses; independent reviewer verifies; no blocking issue remains.

## Customization
Adapters may map framework-specific interrupt objects to `{id, status, task_id}`. Keep the invariant framework-neutral: every live pending decision must be explicitly and uniquely addressed before continuation.