# Suppression and Exception Rules

## Purpose
Govern exclusions, allowlists, maintenance suppressions, and other mechanisms that intentionally reduce alerting.

## Scope
Applies to entity allowlists, rule exceptions, scheduled suppressions, maintenance windows, and trusted automation.

## MUST
- Every persistent exception MUST have a documented reason, narrow scope, accountable owner, approval, and review or expiration date.
- Exceptions MUST match the smallest reliable set of attributes needed to exclude known benign behavior.
- Security-sensitive exceptions MUST be reviewed after relevant infrastructure, identity, or application changes.
- Expired exceptions MUST be automatically removed or surfaced for explicit renewal.

## MUST NOT
- MUST NOT create wildcard exceptions for entire privileged groups, networks, or tools solely because they are noisy.
- MUST NOT use undocumented analyst knowledge as a permanent suppression mechanism.
- MUST NOT suppress telemetry collection when alert suppression alone is sufficient.

## SHOULD
- Exceptions SHOULD preserve searchable evidence even when alerts are suppressed.
- Temporary suppressions SHOULD be preferred for bounded maintenance activity.

## Exceptions
Emergency exceptions require bounded duration, documented incident context, post-event review, and accountable approval.

## Verification
Inspect exception inventories, approval records, expiration enforcement, match scope, retained telemetry, and periodic review evidence.