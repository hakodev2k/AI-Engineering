# Build and CI Rules
## Purpose
Make frontend artifacts reproducible and prevent defective changes from bypassing automated gates.
## Scope
Build configuration, linting, type checks, tests, generated assets, and CI pipelines.
## MUST
- Production builds MUST be reproducible from version-controlled source and declared dependencies.
- Type checking, static analysis, and required automated tests MUST run in CI for protected changes.
- Build-time environment variables MUST be classified as public because shipped frontend bundles are inspectable.
- Generated artifacts MUST have a defined source of truth and drift policy.
- CI failures MUST be resolved or explicitly approved under project governance before release.
## MUST NOT
- Secrets MUST NOT be embedded through frontend build configuration.
- Quality gates MUST NOT be disabled merely to obtain a green build.
## SHOULD
- Keep local and CI commands semantically aligned.
## Exceptions
Emergency bypasses require named approval, risk record, and follow-up remediation.
## Verification
Clean build, lockfile reproducibility, CI logs, artifact inspection, and configuration review.