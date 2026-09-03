# Workflow: Diagnose and Enforce

## Trigger
A workflow has multiple pending interrupts, nested parallel interrupts, or a bug report showing scalar resume accepted despite ambiguity.

## Goal
Make resume dispatch deterministic and explicitly addressable without breaking valid single-interrupt or partial-resume behavior.

## Inputs
Durable pending-interrupt state, proposed resume, runtime nesting, policy, reproduction trace.

## Baseline
Record pending IDs and current runtime behavior for scalar and addressed resumes without performing dangerous side effects.

## Context
Use observable IDs/state only. Do not request hidden chain-of-thought.

## Stages
1. **Observe** — inventory pending interrupts from all relevant tasks/subgraphs.
2. **Measure baseline** — capture scalar/addressed behavior and post-resume pending set.
3. **Diagnose** — locate where effective ID cardinality is lost or validation is scoped too narrowly.
4. **Form hypothesis** — predict which nested structure bypasses the addressability check.
5. **Implement improvement** — normalize pending IDs before dispatch and require ID-keyed resume when cardinality > 1.
6. **Measure again** — repeat baseline matrix.
7. **Verify** — independent agent compares consumed/remaining IDs with predictions.

## Responsible agent
Interrupt State Analyst diagnoses; runtime implementer changes code; Resume Verification Agent verifies.

## Tools
Checkpoint inspection, `scripts/resume_gate.py`, synthetic nested-interrupt fixtures, test runner.

## Outputs
Before/after decision matrix, root cause, normalized pending set, verification record.

## Checkpoints
After inventory, baseline, implementation, and independent verification.

## Metrics
Ambiguous scalar rejection rate, addressed resume acceptance, unknown/duplicate ID rejection, post-resume remaining-set accuracy.

## Retry policy
Maximum 2 implementation retries, each requiring changed code or evidence.

## Stop conditions
Stop on ambiguous mapping, ID duplication, unexpected branch consumption, or inability to derive a canonical pending set.

## Failure path
Do not resume. Preserve checkpoint and request an explicitly addressed decision after the runtime/state defect is repaired.

## Verification
Nested and top-level cases must both satisfy the same ID-based invariant.

## Definition of Done
Evidence documented; baseline captured; root cause identified; normalization/gate implemented; scalar ambiguity rejected; valid addressed cases pass; remaining set verified; independent verification complete; no blocking ambiguity remains.
