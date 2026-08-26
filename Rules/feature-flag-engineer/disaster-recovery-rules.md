# Disaster Recovery Rules

## Purpose
Preserve safe flag behavior when the control plane, data plane, region, or provider fails.

## Scope
Backups, configuration recovery, provider outages, regional failures, and operator recovery.

## MUST
- Critical flag configuration MUST have a documented recovery strategy and recovery objectives.
- Applications MUST define behavior when the flag provider is unavailable.
- Recovery procedures MUST preserve or deliberately reconstruct high-risk targeting and defaults.
- Disaster recovery MUST be exercised periodically for critical usage.

## MUST NOT
- Recovery MUST NOT depend on undocumented operator memory.
- Restored configuration MUST NOT be promoted without integrity and freshness checks.
- Provider outage MUST NOT automatically expose unreleased functionality.

## SHOULD
- Export or backup mechanisms SHOULD avoid irreversible provider lock-in for critical controls.

## Exceptions
Reduced recovery capability requires explicit risk acceptance and compensating controls.

## Verification
Review backup evidence, restoration drills, outage tests, recovery documentation, and configuration checksums or diffs.