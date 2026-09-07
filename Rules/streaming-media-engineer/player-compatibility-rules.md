# Player Compatibility Rules

## Purpose
Prevent delivery changes from breaking supported devices, browsers, applications, and playback stacks.

## Scope
Playback contracts, device matrices, capability negotiation, fallbacks, and client-version compatibility.

## MUST
- Supported playback targets MUST have explicit codec, container, protocol, encryption, and feature constraints.
- Contract changes MUST be tested against representative supported clients before production rollout.
- Capability-dependent features MUST be negotiated or safely defaulted rather than inferred from unreliable identifiers alone.
- Breaking playback changes MUST have a migration or versioning strategy and human approval.

## MUST NOT
- MUST NOT remove a required rendition, codec, manifest field, or fallback without compatibility evidence.
- MUST NOT treat one reference player as proof of ecosystem compatibility.
- MUST NOT rely on undocumented client quirks as a permanent contract.

## SHOULD
- Compatibility matrices SHOULD prioritize actual traffic and business-critical devices.
- Deprecated client behavior SHOULD be monitored before support removal.

## Exceptions
Emergency compatibility mitigations require documented scope, expiry condition, evidence, and follow-up remediation.

## Verification
Run device/browser matrices, contract tests, staged rollout telemetry, playback error analysis, and regression suites.