# Release Promotion Rules

## Purpose
Ensure the exact artifact that passed security and quality gates is the artifact promoted toward production.

## Scope
Artifact repositories, staging, promotion workflows, environment gates, and production release.

## MUST
- Promotion MUST reference immutable artifact identities such as cryptographic digests.
- The artifact promoted to production MUST be the same artifact that passed required tests and security gates.
- Promotion workflows MUST record source revision, artifact digest, approvals, and destination environment.
- Production promotion MUST require controls proportional to impact, including human approval where policy requires it.
- Failed integrity, signature, provenance, or policy checks MUST block promotion.

## MUST NOT
- MUST NOT rebuild source separately for each environment when artifact promotion can preserve identity.
- MUST NOT substitute artifacts after approval without rerunning applicable gates.
- MUST NOT bypass failed release-security controls merely because a deployment is urgent.

## SHOULD
- Promotion SHOULD be automated, auditable, and reversible.
- Higher environments SHOULD accept artifacts only from designated lower-trust stages or approved repositories.

## Exceptions
Emergency exceptions require explicit authorization, incident-style logging, compensating validation, and post-release review.

## Verification
Compare artifact digests across environments, promotion logs, approval records, gate results, and release manifests.