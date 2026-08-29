# Workflow: Observe → Diagnose → Verify Resume Correlation

## Trigger
A new interrupt/resume integration, a framework upgrade, or any observed resume mismatch.

## Goal
Ensure every response is correlated to the intended current interrupt before the workflow continues.

## Inputs
Pending interrupt snapshot, incoming envelope, framework adapter, representative nested/parallel tests.

## Baseline
Record current resume success rate, number of pending IDs, existing miscorrelation/partial-resume reproductions, and retry/rework count.

## Context
Use current checkpoint/runtime evidence, not model memory.

## Stages
1. **Observe** — Resume Investigator captures current pending IDs and reproduces behavior.
2. **Measure baseline** — Run existing flow without changing policy; record outcomes.
3. **Diagnose** — Classify type overloading, scalar ambiguity, stale state, or incomplete mapping.
4. **Form hypothesis** — State the smallest observable cause and expected test change.
5. **Implement** — Add explicit canonical envelope and pre-resume guard.
6. **Measure again** — Re-run identical fixtures and compare correlation outcomes/retries.
7. **Improved?** — If no, re-evaluate once; do not weaken the exact-set rule.
8. **Verify** — Independent Verifier runs mandatory cases.
9. **Complete** — Publish implemented/measured/verified status separately.

## Responsible agents
Investigator for stages 1–4, implementation owner for stage 5, Independent Verifier for stages 6–8.

## Tools
`python scripts/resume_correlation_guard.py`, unit/integration tests, framework checkpoint inspection.

## Outputs
Baseline report, diagnosis, guard report, before/after comparison, verification record.

## Checkpoints
- authoritative pending state captured;
- hypothesis has supporting evidence;
- no execution before guard passes;
- verifier is independent from implementation.

## Metrics
Miscorrelation failures, blocked ambiguous resumes, extra resume invocations, replay/rework count, verification coverage.

## Retry policy
Maximum one diagnosis/implementation retry for the same hypothesis. A second failure requires a new hypothesis or escalation.

## Stop conditions
Stop immediately on changing pending state that cannot be re-read consistently, duplicate interrupt IDs, unverifiable framework behavior, or evidence of unintended side effects.

## Failure path
Keep workflow interrupted, preserve diagnostics, restore previous known-good adapter if applicable, and escalate. Never auto-select one pending interrupt.

## Verification
Unit tests plus at least one real framework fixture with multiple simultaneous interrupt IDs and one fixture whose single answer is a JSON object.

## Definition of Done
Evidence documented; baseline captured; exact correlation gate implemented; tests pass; before/after outcomes recorded; independent verification passes; no unresolved blocking ambiguity remains.
