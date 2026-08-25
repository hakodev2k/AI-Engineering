# Workflow — Provenance Diagnosis

## Trigger
Classifier reject, inconsistent repeated reject, or classifier unavailable.

## Goal
Explain the denial using provenance and reach a safe deterministic routing decision.

## Inputs
Context segments, action, classifier response, policy, prior fingerprints.

## Baseline
Record denial rate, retry count, gate latency, and whether flagged text maps to an origin.

## Stages
1. **Observe** — capture decision metadata and redact secrets.
2. **Measure baseline** — compute retry count and gate latency.
3. **Diagnose** — envelope segments and map flagged IDs.
4. **Form hypothesis** — untrusted content, trusted-control false positive, availability failure, or unresolved.
5. **Implement instrumentation only** — add provenance metadata; do not weaken policy.
6. **Measure again** — rerun the same fixture/trace.
7. **Verify** — Safety Reviewer checks decision and invariants.

## Responsible agent
Investigator; independent Safety Reviewer.

## Tools
`scripts/provenance_gate.py`, logs, tests.

## Outputs
Gate JSON, evidence note, metric delta, verification status.

## Checkpoints
After provenance mapping; before policy changes; after tests.

## Metrics
Provenance-resolution rate, identical retries avoided, manual reviews, unsafe false negatives.

## Retry policy
One identical retry by default; maximum two diagnostic fix/retest iterations.

## Stop conditions
Block on user/untrusted signal; review on trusted-control-only signal; stop on unresolved provenance; complete only after verification.

## Failure path
Malformed/missing evidence preserves denial and escalates. Classifier outage uses policy fallback. No silent bypass.

## Definition of Done
Evidence captured; provenance resolved/unresolved explicitly; deterministic decision reproduced; tests pass; independent verification recorded.
