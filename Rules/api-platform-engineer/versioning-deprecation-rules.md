# Versioning and Deprecation

## Purpose
Make API evolution controlled and reversible.

## Scope
Versions, compatibility windows, deprecation, and retirement.

## MUST
- Versioning policy MUST define what constitutes a breaking change.
- Deprecation MUST identify replacement guidance, affected versions, deadlines, and owner.
- Retirement MUST use consumer-usage evidence and approved communication windows.
- Supported versions MUST receive defined security and reliability treatment.

## MUST NOT
- MUST NOT retire an API solely because a replacement exists.
- MUST NOT create a new major version to avoid evaluating backward-compatible alternatives.

## SHOULD
- Prefer additive evolution and explicit sunset telemetry.

## Exceptions
Emergency retirement requires documented security or operational risk, approval, and consumer mitigation.

## Verification
Inspect specification history, usage telemetry, deprecation notices, migration status, and release gates.