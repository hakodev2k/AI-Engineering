# Incremental Build Rules

## Purpose
Keep incremental builds correct while avoiding unnecessary work.

## Scope
Applies to dependency tracking, invalidation, changed-file analysis, local builds, remote builds, and CI affected-target execution.

## MUST
- Incremental build decisions MUST derive from declared dependency relationships and stable input fingerprints.
- A changed input that can alter an output MUST invalidate every dependent output that consumes it.
- Changes to dependency-analysis logic MUST be validated against clean-build results.
- Build acceleration MUST preserve semantic equivalence with a clean build.
- False cache hits or missed invalidations MUST be treated as correctness incidents, not minor performance defects.

## MUST NOT
- MUST NOT skip targets based solely on file timestamps when stronger content or dependency evidence is available.
- MUST NOT trade correctness for faster incremental execution without an explicitly documented degraded mode.
- MUST NOT assume generated files are unchanged merely because their generator source did not change.

## SHOULD
- Affected-target calculation SHOULD be explainable to developers through diagnostics or graph inspection.
- Incremental invalidation SHOULD be as narrow as correctness permits.

## Exceptions
Exceptions require a documented correctness boundary, evidence from clean-build comparison, bounded blast radius, and reviewer approval.

## Verification
Compare incremental and clean build outputs after representative source, configuration, toolchain, and dependency changes. Test invalidation rules in CI.