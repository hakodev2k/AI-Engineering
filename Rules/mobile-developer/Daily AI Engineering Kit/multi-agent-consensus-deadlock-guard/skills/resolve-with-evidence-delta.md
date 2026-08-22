# Skill: Resolve With Evidence Delta

## Purpose
Move a disagreement forward only when new evidence can materially change the decision.

## Inputs
- Current disagreement record
- Previous round record, if any
- Candidate evidence sources
- Consensus policy

## Process
1. Compare current and previous evidence fingerprints.
2. If fingerprints are unchanged, do not open another debate round; escalate.
3. Identify the smallest evidence-producing action for each unresolved claim.
4. Run only those tests, queries, builds, or inspections.
5. Preserve outputs with stable evidence IDs.
6. Update `new_evidence_ids`, positions, round, and evidence fingerprint.
7. Apply deterministic repository/security/business rules before asking agents to reinterpret evidence.
8. If one claim is contradicted by evidence, resolve with mode `evidence-dominates`.
9. If a mandatory rule decides the conflict, resolve with `policy-rule`.
10. If high-risk ambiguity remains, hand off to the independent Consensus Verifier.
11. Run `scripts/evaluate-deadlock.py` before any further round.

## Verification
Progress exists only when the evidence set or a relevant immutable source revision changed. New wording alone is not progress.

## Failure handling
Transient tool failure may be retried once. Validation, permission, or semantic disagreement is not blindly retried.

## Stop conditions
- `max_rounds` reached
- No evidence progress
- Required evidence cannot be obtained safely
- Human approval is required
- Status becomes resolved, human-decision-required, or blocked
