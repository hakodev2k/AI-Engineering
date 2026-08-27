# Workflow: Research and Diagnose

**Trigger:** suspected synthetic user message or change to routing/normalization.  
**Goal:** locate the exact hop where source identity or original role is lost.

## Inputs
Raw envelopes, normalized messages, router configuration, policy, tool privilege inventory.

## Baseline
Measure provenance-field coverage and role/source mismatch count on a representative trace.

## Stages
1. Observe the raw message at origin.
2. Measure metadata after each transport hop.
3. Diagnose the first provenance/role mutation.
4. Form one explicit root-cause hypothesis.
5. Reproduce with a minimal fixture.
6. Apply the smallest routing/envelope correction.
7. Measure again.

## Responsible agent
Implementation owner diagnoses; Security Verifier independently validates.

## Tools
Read-only logs, guard script, unit tests.

## Outputs
Baseline, root-cause evidence, corrected envelope behavior, before/after metrics.

## Checkpoints
After baseline, before implementation, before privileged-tool verification.

## Metrics
Provenance coverage, mismatch count, unauthorized privileged-request count.

## Retry policy
Maximum two root-cause/implementation iterations.

## Stop conditions
Secret exposure, unknown origin, irreversible action risk, or exhausted retries.

## Failure path
Disable affected transport/feature or downgrade it to untrusted data-only handling; escalate to a human owner.

## Verification
Independent reproduction with adversarial source-promotion fixtures.

## Definition of Done
First bad hop identified, fix implemented, metrics improved, all regression tests pass, no security boundary weakened.
