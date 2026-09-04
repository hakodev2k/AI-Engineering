# CI Execution Rules

## Purpose
Keep browser automation trustworthy, reproducible, and operationally useful in continuous integration.

## Scope
Applies to CI jobs, runners, dependencies, browser installation, caching, artifacts, sharding, retries, and gating behavior.

## MUST
- CI browser and framework versions MUST be reproducibly resolved from controlled configuration.
- Required runtime dependencies MUST be provisioned explicitly rather than relying on undocumented runner state.
- Release-gating automation MUST fail visibly when execution infrastructure prevents valid verification.
- CI artifacts MUST identify commit, environment, browser, worker, and attempt where relevant.
- Changes to gating criteria, retry policy, or skipped coverage MUST be reviewed for release-risk impact.

## MUST NOT
- A missing browser, failed setup step, or unavailable environment MUST NOT be reported as a passing test result.
- CI caches MUST NOT be treated as authoritative state when stale content can alter correctness.
- Failing critical scenarios MUST NOT be disabled merely to restore a green pipeline without an explicit risk decision.

## SHOULD
- Fast deterministic checks SHOULD run before expensive browser suites.
- Expensive suites SHOULD be sharded or tiered according to measured feedback needs and risk.

## Exceptions
Temporary reduction of coverage requires documented reason, affected risk, alternative verification, owner, and restoration condition.

## Verification
Review CI configuration and lockfiles, execute from a clean runner, invalidate caches, inspect gating behavior on deliberate failures, and confirm artifacts provide reproducible execution metadata.