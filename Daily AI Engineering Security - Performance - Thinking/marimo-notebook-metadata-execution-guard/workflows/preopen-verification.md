# Workflow: Pre-open Verification

## Trigger
A notebook is downloaded, cloned, attached to an issue, or changed by an untrusted contributor.

## Goal
Prevent metadata-driven side effects before editor/runtime initialization.

## Inputs
Artifact, provenance, extracted metadata, policy.

## Baseline
Record current runtime version and whether the artifact path currently initializes services before trust review.

## Stages
1. Observe provenance and hash the artifact.
2. Extract metadata with a non-executing parser.
3. Measure risky/unknown configuration paths.
4. Form the hypothesis that a specific metadata path can cross into a side-effect capability.
5. Run `scripts/metadata_guard.py`.
6. If blocked, quarantine; do not retry with weaker policy.
7. If allowed, run regression tests and independent review.

## Responsible agent
Artifact Trust Analyst; Security Verifier signs off independently.

## Tools
Read-only parser, metadata guard, unit tests.

## Outputs
Decision JSON, risky paths, test result, reviewer decision.

## Checkpoints
After extraction; before trust elevation; after tests.

## Metrics
Pre-open coverage, malicious-fixture block rate, safe pass rate, unknown-section count.

## Retry policy
Maximum 1 extraction correction and 1 implementation correction.

## Stop conditions
Any process launch, network request, credential access, or provenance ambiguity blocks completion.

## Failure path
Quarantine artifact and escalate to security owner.

## Verification
Run `python -m unittest tests/test_metadata_guard.py`; independent reviewer confirms no side effects occurred during analysis.

## Definition of Done
Evidence captured, deterministic decision produced, tests pass, risky paths require explicit trust, reviewer passes.
