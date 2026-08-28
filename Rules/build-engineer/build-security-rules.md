# Build Security Rules

## Purpose
Protect the build pipeline, toolchain, workers, and produced artifacts from tampering and credential exposure.

## Scope
Applies to build scripts, runners, toolchains, dependencies, credentials, artifact signing inputs, and execution permissions.

## MUST
- Build workers MUST use least-privilege identities and scoped credentials.
- Untrusted pull-request code MUST be isolated from privileged release credentials and protected deployment capabilities.
- Build tools and downloaded dependencies MUST be integrity-verified where supported.
- Security-sensitive build configuration changes MUST receive explicit review.
- Build logs and artifacts MUST avoid exposing secrets, tokens, signing material, or sensitive environment values.

## MUST NOT
- MUST NOT embed credentials in build scripts or committed configuration.
- MUST NOT disable integrity, sandboxing, or policy checks merely to unblock a build.
- MUST NOT execute unreviewed third-party build hooks with privileged credentials.

## SHOULD
- Build environments SHOULD be ephemeral and regularly refreshed.
- Release pipelines SHOULD separate build, signing, and deployment privileges.

## Exceptions
Exceptions require documented threat analysis, compensating controls, bounded duration, and security approval.

## Verification
Review runner permissions, secret access, dependency verification, logs, artifact scans, and protected-branch or release-workflow controls.