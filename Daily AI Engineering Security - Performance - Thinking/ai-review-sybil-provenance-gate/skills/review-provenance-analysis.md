# Skill: Review Provenance Analysis

## Purpose
Assess whether repository approvals represent independent controlling principals rather than merely distinct account names.

## Trigger
Any high-risk pull request, AI-authored contribution, suspicious coordinated review pattern, or protected-path change before merge.

## Inputs
Pull-request author provenance, review records, controller/provenance attestations, CODEOWNERS mapping, changed paths, policy.

## Preconditions
Provenance inputs come from an authenticated inventory, attestation service, or explicitly trusted administrative mapping. Username heuristics alone are insufficient.

## Required context
Changed paths, author controller, reviewer controller IDs, identity types, CODEOWNER status, provenance verification status.

## Allowed tools
Read-only GitHub metadata, attestation verification, CODEOWNERS lookup, `scripts/review_provenance_gate.py`.

## Constraints
MUST NOT claim that distinct usernames are independent. MUST NOT count unknown provenance for a protected merge. MUST NOT expose secrets or private identity data beyond stable controller identifiers required by policy.

## Procedure
1. Identify whether changed paths are high-risk or protected.
2. Resolve author and reviewer accounts to authenticated controller IDs.
3. Verify provenance status and CODEOWNER membership.
4. Run the deterministic gate.
5. Record counted, rejected and duplicate-controller reviews.
6. If blocked, request genuinely independent review rather than relaxing the quorum.
7. Preserve attestation references and decision evidence for audit.

## Decision points
Allow only when unique-controller quorum and required human CODEOWNER conditions pass. Unknown, author-controlled, or duplicate-controller approvals do not count.

## Expected output
Merge decision, unique-controller count, counted reviewers, rejected reviews with reason codes, and verification status.

## Metrics
Unique controllers per approval set, rejected duplicate-controller reviews, unknown-provenance rate, human CODEOWNER coverage, blocked high-risk merges.

## Verification
Independent security reviewer validates policy inputs and reruns the gate.

## Failure handling
Fail closed for protected merges when provenance cannot be verified. Retry attestation retrieval at most twice, then escalate.

## Stop conditions
Stop after deterministic allow/block plus one independent verification; do not weaken the quorum to force completion.
