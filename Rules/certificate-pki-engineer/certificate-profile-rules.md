# Certificate Profile Rules

## Purpose
Keep certificate semantics interoperable, constrained, and policy-aligned.

## Scope
X.509 profiles, extensions, validity, names, usages, and constraints.

## MUST
- Every profile MUST define subject/SAN rules, key usage, extended key usage, validity, algorithm policy, and critical extensions.
- CA certificates MUST carry appropriate Basic Constraints and key-cert-signing restrictions.
- Profile changes affecting relying parties MUST undergo compatibility and security review.

## MUST NOT
- MUST NOT issue certificates with broader usages than the authenticated request requires.
- MUST NOT depend on deprecated subject fields when SAN is required by the relying ecosystem.
- MUST NOT introduce unknown critical extensions without verified consumer support.

## SHOULD
- Profiles SHOULD be version-controlled and machine-validated.

## Exceptions
Exceptions require documented interoperability need, bounded scope, testing, and approval.

## Verification
Lint issued certificates, compare them with approved profiles, and test representative relying parties.