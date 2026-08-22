# CI, Build, and Signing Rules
## Purpose
Keep mobile builds reproducible, reviewable, and protected from credential or artifact tampering.
## Scope
CI pipelines, build variants, provisioning, signing, secrets, artifacts, and release provenance.
## MUST
- Release builds MUST use controlled CI configuration and protected signing credentials.
- Environment-specific endpoints and identifiers MUST be injected through explicit configuration, not source edits.
- Build artifacts MUST be traceable to source revision, dependencies, and build configuration.
## MUST NOT
- Production signing keys, passwords, or provisioning secrets MUST NOT be exposed in logs or repositories.
- Debuggable or test-backdoor configurations MUST NOT ship unintentionally in production variants.
## SHOULD
- CI SHOULD verify dependency locks, static analysis, tests, and release configuration before signing.
## Exceptions
Local emergency signing requires explicit authorization and subsequent provenance documentation.
## Verification
Inspect CI permissions, secret masking, artifact metadata, variant settings, signing identity, and reproducibility evidence.