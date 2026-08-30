# Build Failure and Recovery Rules

## Purpose
Ensure build failures are classified correctly, recover safely, and do not corrupt subsequent builds or artifacts.

## Scope
Applies to local failures, CI failures, cache corruption, remote worker faults, dependency resolution failures, and interrupted builds.

## MUST
- Failures MUST be classified as deterministic, transient infrastructure, configuration, dependency, or unknown when evidence allows.
- Recovery procedures MUST avoid reusing outputs known or suspected to be incomplete or corrupted.
- Interrupted publication or packaging operations MUST leave a detectable incomplete state rather than a valid-looking partial artifact.
- Repeated unknown failures MUST trigger investigation using logs, traces, and reproduction evidence.
- Recovery mechanisms MUST be tested before being relied upon for critical release paths.

## MUST NOT
- MUST NOT repeatedly retry deterministic failures without new evidence.
- MUST NOT delete broad caches or build state as the default response when the failure scope is unknown.
- MUST NOT report success after partial recovery if required targets remain unverified.

## SHOULD
- Failure signatures SHOULD be correlated with recent build-system, toolchain, and infrastructure changes.
- Recovery SHOULD prefer the smallest safe invalidation scope supported by evidence.

## Exceptions
Emergency recovery actions MUST document the evidence available, affected scope, risk, and follow-up verification.

## Verification
Review failure classification, reproduction attempts, cache invalidation scope, recovery logs, required target results, and post-recovery clean-build evidence.