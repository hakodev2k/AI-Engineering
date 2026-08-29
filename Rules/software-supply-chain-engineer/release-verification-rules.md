# Release Verification Rules

## Purpose
Ensure a release is the intended, reviewed, and validated artifact before distribution or deployment.

## Scope
Applies to release candidates, packages, images, binaries, manifests, signatures, provenance, and promotion gates.

## MUST
- Release candidates MUST be identified by immutable artifact digest or equivalent immutable identity.
- Release verification MUST confirm source revision, required tests, policy checks, signatures or attestations where required, and expected artifact contents.
- Promotion between environments MUST preserve artifact identity rather than rebuild from mutable inputs when architecture allows.
- High-risk releases MUST have documented approval and rollback or containment readiness.

## MUST NOT
- MUST NOT promote an artifact whose identity differs from the verified release candidate.
- MUST NOT waive failed integrity or policy checks without explicit approved exception.

## SHOULD
- Release verification SHOULD be automated and produce durable evidence.
- Independent verification SHOULD be used for especially critical artifacts where practical.

## Exceptions
Exceptions MUST record the failed or unavailable check, rationale, risk, compensating validation, approver, and expiry where applicable.

## Verification
Inspect release records, artifact digests, signatures, provenance, test results, approvals, and deployment manifests. Confirm deployed or published artifacts match the verified release candidate.