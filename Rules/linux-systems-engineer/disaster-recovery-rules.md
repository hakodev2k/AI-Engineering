# Disaster Recovery Rules

## Purpose
Ensure Linux-hosted services can be rebuilt or restored after loss of hosts, zones, credentials, or supporting infrastructure.

## Scope
Applies to host rebuilds, recovery environments, configuration sources, credentials, bootstrapping, dependency restoration, and DR exercises.

## MUST
- Critical systems MUST have a documented recovery path that does not depend on the failed host remaining accessible.
- Recovery documentation MUST identify required infrastructure, configuration, secrets, data sources, network dependencies, and ordering.
- DR assumptions MUST be tested through exercises or real recoveries at a frequency proportional to criticality.
- Recovery objectives MUST be validated against observed exercise times and data-loss results.
- Break-glass recovery access MUST be protected, tested, and independent enough to survive plausible control-plane failures.

## MUST NOT
- A host image alone MUST NOT be treated as a complete recovery plan when external configuration, secrets, data, or networking are required.
- Untested manual knowledge held by one operator MUST NOT be the sole recovery mechanism for critical systems.
- DR execution that destroys surviving production state MUST NOT proceed without explicit human approval.

## SHOULD
- Prefer automated rebuild from trusted sources.
- Exercise dependency failures, not only clean host replacement.
- Record recovery bottlenecks and remediate them.

## Exceptions
Legacy systems lacking full automation require an owned, tested manual runbook and a documented modernization risk.

## Verification
Run recovery exercises, measure achieved RTO/RPO, verify restored identity/network/storage/service behavior, test break-glass access, and confirm recovery artifacts are available when primary systems are unavailable.