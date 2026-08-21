# Skill: Quarantine Decision

## Purpose
Decide whether a diagnosed unstable test may be temporarily quarantined without hiding a real product regression or creating an indefinite coverage gap.

## When to use
Use only after `skills/flaky-test-triage.md` has produced a supported non-product classification.

## Inputs
- Triage report.
- Aggregated run summary.
- Flaky-test policy.
- Existing quarantine registry.
- Test criticality and coverage context.
- Proposed owner, issue/work item, expiry, and remediation plan.

## Preconditions
- Classification is not `product-regression` or `unknown`.
- Minimum observation count is satisfied.
- The first failure and rerun evidence are preserved.

## Process
1. Verify the classification is allowed by policy.
2. Confirm the observed execution count meets `min_observations_for_quarantine`.
3. Determine whether this test is the only automated coverage for a critical behavior.
4. Mark `critical_path` when the test protects security, payments, identity, data integrity, migrations, core authorization, or similarly critical behavior.
5. Identify the remediation owner.
6. Link a concrete issue/work item describing the suspected cause and repair plan.
7. Set an expiry date no later than `max_quarantine_days` from creation unless an explicit exception is approved.
8. Record evidence references, not merely a statement that the test is flaky.
9. Define what CI behavior quarantine will change and how the test remains visible.
10. Require human approval when policy requires it, especially for critical-path quarantine.
11. Produce one decision: `approve`, `revise`, or `reject`.
12. If approved, create/update the registry entry and run deterministic registry validation.

## Allowed tools
- Read repository/test code.
- Read policy and registry.
- Read triage artifacts and CI evidence.
- Edit the quarantine registry after approval conditions are satisfied.
- Run `scripts/validate-quarantine.py`.

## Constraints
- MUST NOT approve quarantine for `product-regression` or `unknown`.
- MUST require owner, issue reference, created date, expiry, classification, and evidence.
- MUST preserve visible reporting of quarantined failures.
- MUST NOT create permanent or expiry-free quarantine.
- MUST NOT broaden quarantine from one test to a suite without explicit human approval and separate evidence.
- SHOULD choose the shortest practical expiry window.

## Expected output
A decision record with:
- decision;
- rationale;
- classification;
- critical-path status;
- evidence references;
- owner;
- issue/work item;
- expiry;
- required approval identity/reference when applicable;
- expected CI treatment;
- remediation success criteria.

## Verification
An approved quarantine is verified only after `validate-quarantine.py` succeeds and all required approval/evidence fields are present.

## Failure handling
- Missing owner or issue: return `revise`.
- Expiry exceeds policy: return `revise` or require explicit approved exception.
- Critical-path test lacks approval: return `reject` until approval exists.
- Evidence contradicts the classification: return to triage; do not approve.

## Stop conditions
Stop when:
- quarantine is approved and registry validation succeeds;
- decision is rejected;
- required information cannot be obtained;
- evidence indicates a product regression or unresolved dangerous condition.
