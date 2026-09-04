# Policy System Security Rules

## Purpose
Protect policy source, artifacts, evaluators, administration paths, and decision integrity from unauthorized modification or disclosure.

## Scope
Applies to policy repositories, build systems, bundles, signing, distribution, evaluator identities, administration interfaces, secrets, and runtime permissions.

## MUST
- Policy source and deployment paths that affect protected systems MUST require authenticated, authorized changes with review appropriate to risk.
- Evaluator and distributor identities MUST use least privilege and narrowly scoped credentials.
- Policy artifacts crossing trust boundaries MUST have integrity verification appropriate to the threat model.
- Secrets required by policy infrastructure MUST be stored in approved secret-management mechanisms and excluded from policy source and bundles.
- Administrative operations that can disable enforcement, replace policy, or expand access MUST be auditable.
- Dependencies and evaluator runtimes MUST be tracked for security vulnerabilities and supported-version risk.

## MUST NOT
- Credentials, private keys, access tokens, or production secrets MUST NOT be committed to policy source.
- Untrusted policy bundles MUST NOT be activated without provenance and integrity validation.
- Security controls MUST NOT be disabled to simplify debugging or deployment without explicit bounded approval.
- Policy error messages or traces MUST NOT expose sensitive decision data to unauthorized callers.

## SHOULD
- High-risk policy artifacts SHOULD be signed and verified before activation.
- Administrative duties SHOULD separate policy authorship from high-risk production activation where practical.

## Exceptions
Security exceptions require threat analysis, bounded scope, compensating controls, expiry when applicable, verification evidence, and security-owner approval.

## Verification
Use repository protection inspection, secret scanning, dependency scanning, artifact-integrity tests, permission review, administrative audit logs, and adversarial tests against unauthorized policy replacement or enforcement bypass.