# Consumer Governance Rules

## Purpose
Protect shared CDC streams from undocumented consumers, incompatible assumptions, and unsafe contract changes.

## Scope
Consumer registration, ownership, SLAs, contract use, replay, and deprecation.

## MUST
- Production consumers MUST have identifiable ownership and purpose.
- Critical consumer assumptions about ordering, retention, freshness, and schema MUST be documented.
- Contract-breaking changes MUST identify and migrate affected consumers.
- Replay-sensitive consumers MUST declare whether historical events trigger external side effects.
- Deprecated streams or fields MUST have an announced removal process.

## MUST NOT
- MUST NOT promise retention or ordering stronger than the platform actually provides.
- MUST NOT delete a shared stream solely because observed traffic is low.
- MUST NOT allow unknown consumers to block security-critical remediation indefinitely.

## SHOULD
- Maintain machine-readable consumer metadata where practical.
- Track consumer lag and inactive ownership.

## Exceptions
Anonymous/public consumption requires a deliberately stable public contract and stronger compatibility controls.

## Verification
Inspect consumer registry, ownership, compatibility tests, deprecation notices, and usage telemetry.