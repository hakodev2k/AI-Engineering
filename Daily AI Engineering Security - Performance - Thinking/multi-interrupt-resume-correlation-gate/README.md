# Multi-Interrupt Resume Correlation Gate

**Category:** Thinking  
**Run date:** 2026-08-30 (UTC+7)

## Problem
Concurrent/nested agent interrupts need exact response-to-interrupt correlation. Fresh LangGraph bugs show two concrete failure modes: a scalar resume can be accepted despite multiple child interrupts, and an ordinary dictionary answer can be interpreted as an interrupt map. Both make implicit type/order inference unsafe at an application boundary.

## Evidence
See `evidence/research.md`. Key current signals are LangGraph #8579 (2026-08-09), #8693 (2026-08-23), and the official documentation requirement to map multiple resume values by interrupt ID.

## Existing approach
Frameworks expose interrupt IDs and support ID-keyed resume mappings. Applications frequently pass UI/webhook payloads directly to those APIs or use ad-hoc branching based on JSON shape.

## Existing limitations
Nested task layouts can stress framework validation; JSON objects are overloaded as both legitimate answer values and maps; stale/incomplete mappings are easy to construct; and logs may not prove the exact pending set validated at resume time.

## Proposed improvement
Use a framework-neutral, explicit envelope:
- `{"mode":"single","value":...}` only when exactly one interrupt is pending;
- `{"mode":"by_id","responses":{"interrupt-id":...}}` for multi-interrupt resume, with exact key-set equality.

The deterministic guard validates the envelope before any framework-specific resume command is created.

## Architecture
```text
README.md
evidence/research.md
schemas/resume-envelope.schema.json
skills/resume-correlation-audit.md
rules/resume-integrity-rules.md
subagents/resume-investigator.md
subagents/independent-verifier.md
workflows/observe-diagnose-verify.md
hooks/pre-resume-gate.md
scripts/resume_correlation_guard.py
tests/test_resume_correlation_guard.py
```

## Installation
Python 3.10+; standard library only.

## Configuration
No secrets or provider configuration are required. The host must export the authoritative pending interrupt snapshot as a JSON array containing unique `id` fields.

## Usage
```bash
python scripts/resume_correlation_guard.py \
  --pending pending.json \
  --resume resume.json \
  --json-out report.json

python -m unittest tests/test_resume_correlation_guard.py
```

Example single object-valued answer:
```json
{"mode":"single","value":{"approved":true,"note":"ship"}}
```

Example two-interrupt answer:
```json
{"mode":"by_id","responses":{"interrupt-a":"approve","interrupt-b":"reject"}}
```

## Workflow
Follow `workflows/observe-diagnose-verify.md`: Observe → Measure baseline → Diagnose → Hypothesize → Implement → Measure again → independent verification. Loops are bounded to one retry for the same hypothesis.

## Metrics
- ambiguous resumes blocked;
- exact ID-set match rate;
- correlation integration-test failures;
- unnecessary replay/rework count;
- stale-state revalidation count.

## Verification
**Implemented:** explicit envelope, exact-set deterministic validator, rules and hook.  
**Measured:** baseline and post-change fixtures use identical pending/resume cases.  
**Verified:** independent tests prove multi-interrupt responses reach the intended IDs and object-valued single answers are preserved.

## Safety
The package never chooses a pending interrupt implicitly. It does not approve actions, change permissions, or expose hidden reasoning. Sensitive answer values should be excluded from routine logs.

## Failure handling
Detection: invalid IDs, mode mismatch, incomplete/extra mappings, changed pending state, failed tests.  
Retry: refresh authoritative pending state once.  
Maximum retries: 1.  
Fallback: keep the workflow interrupted.  
Escalation: operator review with IDs and non-sensitive evidence.  
Stop condition: unresolved ambiguity or inconsistent state.

## Definition of Done
- evidence documented;
- authoritative baseline captured;
- limitations/root cause identified;
- exact-set guard implemented;
- unit/integration tests pass;
- before/after comparison complete;
- independent verifier passes mandatory cases;
- no unresolved correlation ambiguity remains.

## Customization
Adapters may translate `adapter_resume` to LangGraph or another runtime, but the canonical envelope and exact-set validation should remain framework-neutral and occur before execution.
