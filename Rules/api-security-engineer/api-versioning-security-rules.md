# API Versioning Security Rules

## Purpose
Prevent legacy compatibility from preserving unacceptable security weaknesses indefinitely.

## Scope
API versions, deprecation, migrations, compatibility layers, and sunset decisions.

## MUST
- Assess security impact when introducing, maintaining, or retiring API versions.
- Define migration and sunset plans for versions that cannot meet required security controls.
- Keep security fixes consistent across supported versions unless documented incompatibility prevents it.
- Track consumers of security-relevant legacy behavior.

## MUST NOT
- Preserve a known critical vulnerability solely for backward compatibility.
- Introduce an older insecure behavior into a new version without explicit risk acceptance.

## SHOULD
- Minimize simultaneously supported versions and publish deprecation timelines.

## Exceptions
Temporary legacy support requires risk owner, compensating controls, monitored exposure, deadline, and approval.

## Verification
Review supported-version inventory, vulnerability coverage, contract diffs, consumer telemetry, and deprecation evidence.