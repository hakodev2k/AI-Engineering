# Build and Configuration Rules

## Purpose
Keep Vue builds reproducible and environment configuration safe, explicit, and diagnosable.

## Scope
Vite or equivalent tooling, environment variables, aliases, plugins, transpilation, CI builds, and runtime configuration.

## MUST
- Build inputs required for reproducibility MUST be version-controlled or supplied through documented environment mechanisms.
- Frontend-exposed environment variables MUST be treated as public information regardless of naming.
- Environment-specific behavior MUST be explicit and tested for supported deployment targets.
- Build warnings that indicate correctness, security, or compatibility risk MUST be resolved or formally accepted.
- Production builds MUST use pinned dependency resolution and approved toolchain versions.

## MUST NOT
- Secrets MUST NOT be stored in `.env` files committed to source or injected into variables that become client bundle content.
- Development-only mocks, debug endpoints, or privileged flags MUST NOT silently ship enabled to production.
- Local developer machine state MUST NOT be an undocumented prerequisite for successful builds.

## SHOULD
- Fail builds early for missing required configuration.
- Keep custom build plugins minimal and covered by upgrade/compatibility review.

## Exceptions
Runtime-served public configuration may vary after build when the deployment architecture intentionally supports it and validation is defined.

## Verification
Rebuild in clean CI, inspect emitted assets/config, scan bundles for secrets/debug artifacts, and test supported environment matrices.