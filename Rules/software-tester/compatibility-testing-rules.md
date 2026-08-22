# Compatibility Testing Rules

## Purpose
Control risk across supported platforms, browsers, devices, versions, locales, and configurations.
## Scope
Declared compatibility matrix and backward/forward compatibility obligations.
## MUST
- Derive test coverage from the supported matrix and real usage/risk data.
- Validate critical journeys on materially different supported configurations.
- Record exact platform/version for compatibility defects.
## MUST NOT
- Claim universal compatibility from one environment.
- Spend equal effort on configurations with materially different risk without rationale.
## SHOULD
- Use representative pairings and telemetry-informed prioritization to control matrix size.
## Exceptions
Unsupported configurations must be clearly excluded from release claims.
## Verification
Compare executed coverage to the support matrix and inspect environment-specific evidence.