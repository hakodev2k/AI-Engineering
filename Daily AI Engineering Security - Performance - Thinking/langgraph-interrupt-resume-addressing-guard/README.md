# LangGraph Interrupt Resume Addressing Guard

**Category:** Thinking

## Problem
Stateful human-in-the-loop workflows can continue with a response attached to the wrong pending interrupt when scalar resume is accepted despite multiple nested/parallel interrupts, or when an ordinary object payload is mistaken for an interrupt-ID map.

## Evidence
See `evidence/research.md`. Current LangGraph issue #8579 (2026-08-09) reports scalar resume accepted with two child interrupts in one subgraph task. Issue #8693 (2026-08-23) reports ordinary dictionary values misclassified as interrupt maps. Current LangGraph docs require ID/value pairing for multiple interrupts while also permitting arbitrary JSON-serializable resume values.

## Existing approach
Direct `Command(resume=...)`, framework validation, ID-mapped resumes for parallel interrupts, and application-specific UI checks.

## Existing limitations
Framework checks can miss nested/grouped pending interrupts, payload type is overloaded with addressing semantics, UI layers can lose IDs, and workflow continuation does not prove correct response association.

## Proposed improvement
Put an explicit addressing contract before framework resume. The caller supplies either `{kind:"scalar", value:...}` or `{kind:"by_id", values:{interrupt_id: value}}`. The guard validates this against the authoritative current pending set and emits a normalized framework payload only when association is unambiguous.

## Architecture
```text
langgraph-interrupt-resume-addressing-guard/
├── README.md
├── config/policy.json
├── evidence/research.md
├── hooks/pre-resume-validation.md
├── rules/interrupt-addressing.md
├── schemas/resume-envelope.schema.json
├── scripts/resume_guard.py
├── skills/resume-contract-analysis.md
├── subagents/verification-agent.md
├── tests/pending-multiple.json
├── tests/resume-by-id.json
├── tests/test_resume_guard.py
└── workflows/resume-preflight-and-recovery.md
```

## Installation
Python 3.10+ is sufficient for the reference guard and tests; there are no third-party dependencies. The pattern is framework-agnostic, but integration adapters should fetch pending IDs from LangGraph's current checkpoint/runtime state immediately before resume.

## Configuration
`config/policy.json` is strict by default: discriminated envelopes, scalar only for one pending interrupt, full ID coverage for multi-resume, rejection of unknown/duplicate IDs, and a bounded pending-set size.

`require_all_pending_for_by_id` can be set to false only when the application intentionally supports partial resumes and has tests proving residual interrupts remain correctly pending.

## Usage
From this package directory:

```bash
python scripts/resume_guard.py \
  --policy config/policy.json \
  --pending tests/pending-multiple.json \
  --resume tests/resume-by-id.json
python -m unittest tests/test_resume_guard.py
```

On an allowed result, use `framework_resume` as the value passed to the framework adapter. Do not bypass the guard by rebuilding a raw payload from UI text.

## Workflow
Follow `workflows/resume-preflight-and-recovery.md`: Observe -> Measure baseline -> Diagnose -> Form hypothesis -> Implement -> Measure again -> Verify. Only one stale-state refresh/retry is allowed.

## Metrics
- ambiguous resume attempts blocked
- unknown/stale IDs blocked
- duplicate IDs detected
- multi-interrupt explicit-ID mapping rate
- expected vs actual resolved-ID coverage
- residual pending-interrupt count
- regression pass rate

## Verification
`tests/test_resume_guard.py` covers the two critical semantic classes: an explicit object-valued scalar stays data, while scalar mode is blocked when multiple interrupts are pending. It also verifies full ID coverage, unknown-ID rejection, duplicate-ID detection, and envelope enforcement.

Integration verification MUST compare current pending IDs before resume with actual resolved/pending IDs after resume. Continuing execution alone is not evidence of correct association.

Statuses are distinct:
- **Implemented:** adapter uses the explicit guard contract.
- **Measured:** pre/post interrupt identity is captured in controlled tests.
- **Verified:** independent review confirms intended IDs received intended values and no ambiguous path remains.

## Safety
For approvals that guard irreversible or dangerous actions, do not guess when identity is stale or ambiguous. Preserve pending state and obtain a fresh externally supplied response. This package relies only on observable IDs/state and never requests hidden chain-of-thought.

## Failure handling
Detection: scalar with multiple pending interrupts, raw/ambiguous dictionary, unknown/duplicate IDs, incomplete map, or stale state. Evidence: pending snapshot, envelope, decision reason and post-state where available. Retry: refresh authoritative pending state once. Fallback: block resume and preserve checkpoint. Escalation: workflow/UI owner or human responder. Stop: verified association or persistent ambiguity after one refresh.

## Definition of Done
Evidence documented; baseline captured; IDs preserved end to end; discriminated envelope integrated; guard and regression tests pass; nested/parallel integration test verifies intended association; metrics captured; risks documented; independent verification complete; no blocking ambiguity remains.

## Customization
Adapters may attach namespace, action ID, UI correlation ID, or checkpoint version alongside each interrupt ID. Keep those as metadata; the durable interrupt ID remains the addressing key. Add partial-resume mode only with explicit product requirements and tests.
