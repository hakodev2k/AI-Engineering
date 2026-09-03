# Workflow: Backend Conformance

## Trigger
Checkpoint backend/version change, storage migration, resume inconsistency, or persistence code change.

## Goal
Prove that required checkpoint semantics remain stable before the backend is eligible for production resume.

## Inputs
Invariant profile, backend adapters, representative fixtures, expected semantic results.

## Baseline
Run the approved current backend and capture normalized invariant results plus raw observations.

## Stages
1. **Observe** — identify checkpoint facts consumed by agent decisions.
2. **Measure baseline** — capture metadata, latest selection, history/parents, ordering and sync/async results.
3. **Diagnose** — compare candidate backend observations with the baseline and profile.
4. **Form hypothesis** — attribute mismatch to serialization, query ordering, pagination, ID assumptions, or API-path divergence.
5. **Implement** — repair saver integration or application adapter without weakening invariants.
6. **Measure again** — replay identical fixtures on a clean database.
7. **Verify** — independent Conformance Verifier reruns the corpus and checks eligibility.

## Responsible agent
Persistence implementer for stages 1–6; `subagents/conformance-verifier.md` for stage 7.

## Tools
Saver APIs, isolated databases, fixtures, `scripts/conformance_check.py`, framework tests.

## Outputs
Baseline, candidate observations, before/after comparison, eligibility verdict, verification record.

## Checkpoints
Backend/version recorded; fixture corpus unchanged; required metadata paths present; ordering comparisons deterministic; verification performed independently.

## Metrics
100% required-invariant pass rate and zero resume-critical semantic differences.

## Retry policy
One rerun for environment/harness failure. At most two remediation cycles for semantic failures.

## Stop conditions
Success after independent verification. Failure after retry limits or when a required invariant cannot be guaranteed.

## Failure path
Keep the candidate backend/version ineligible, retain the previous verified backend where safe, document evidence, and escalate migration decisions to a human owner.

## Definition of Done
Evidence documented, baseline captured, limitations identified, candidate measured, all required invariants pass, independent verification succeeds, risks are recorded, and no blocking issue remains.
