# Build and Tooling Rules

## Purpose
Keep frontend builds reproducible, diagnosable, and safe across development and deployment environments.

## Scope
Applies to bundlers, compilers, transpilation, environment variables, source maps, linting, and build configuration.

## MUST
- Production builds MUST be reproducible from committed configuration and lockfiles.
- Build-time environment variables MUST be classified as public because frontend bundles are client-visible.
- Source-map publication MUST follow the project's security and observability policy.
- Tooling changes MUST verify development, test, and production build paths.
- Compiler/linter rule suppressions affecting correctness or security MUST be narrow and justified.

## MUST NOT
- MUST NOT embed secrets in build-time variables intended for browser code.
- MUST NOT disable type checking or linting globally to unblock a release.
- MUST NOT depend on undocumented local machine state for production builds.

## SHOULD
- Prefer minimal custom build configuration over unnecessary plugin chains.
- Prefer CI validation that matches production build settings.

## Exceptions
Document required deviation, affected environments, risk, alternative considered, and verification evidence.

## Verification
Use clean CI builds, lockfile checks, bundle inspection, environment/configuration review, lint/type checks, and production-like smoke tests.