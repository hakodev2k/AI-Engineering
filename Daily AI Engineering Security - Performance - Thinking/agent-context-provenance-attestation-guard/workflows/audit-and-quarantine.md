# Workflow: Audit and Quarantine

## Trigger
Disputed/synthetic user instruction, privileged action request, context rebuild, or provenance regression test.

## Goal
Prevent unverifiable context from acquiring user authority while preserving evidence needed for correct investigation.

## Inputs
Context-event JSONL, raw transcript/request evidence, privilege classification.

## Baseline
Measure provenance coverage and mismatch counts before policy rollout; retain a benign session fixture and at least one injected/synthetic fixture.

## Stages
1. **Observe** — capture model-visible event metadata and transcript state.
2. **Measure baseline** — run `scripts/provenance_guard.py` without changing data.
3. **Diagnose** — identify missing bindings, source/role mismatches, or transcript divergence.
4. **Hypothesis** — map mismatch to adapter, queue, compaction, interruption, or unknown origin.
5. **Implement improvement** — fix event labeling/binding in the host runtime; never weaken the rule.
6. **Measure again** — rerun validator and regression tests.
7. **Independent verification** — Context Forensics Reviewer reproduces result.
8. **Complete** — re-enable action only when authorizing provenance is verified.

## Responsible agent
Runtime owner implements; Context Forensics Reviewer verifies.

## Tools
Validator, hashes, transcript/request diff, runtime logs.

## Outputs
Provenance report, quarantined event IDs, remediation evidence, final verdict.

## Checkpoints
Before privileged action; after any adapter fix; before quarantine release.

## Metrics
Coverage %, violation count, false-positive rate, reconciliation time.

## Retry policy
Maximum two normalization/reconciliation retries. A third failure escalates.

## Stop conditions
Verified provenance, blocked action, or retry exhaustion.

## Failure path
Preserve raw evidence, keep privileged action disabled, escalate to security/runtime owner.

## Verification
Unit tests pass and reviewer independently reproduces zero violations for benign fixtures plus blocking for adversarial fixtures.

## Definition of Done
Evidence documented, validator integrated, mismatches resolved or quarantined, tests pass, independent review complete, no blocking issue remains.