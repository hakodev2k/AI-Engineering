# Privacy and Permission Rules
## Purpose
Minimize personal-data collection and platform permissions while preserving required functionality.
## Scope
Runtime permissions, personal data, identifiers, sensors, photos, contacts, location, tracking, and consent.
## MUST
- Permissions MUST be requested only when needed for a clear user-facing purpose.
- Data collection MUST be limited to documented purpose, retention, and access requirements.
- Denied or revoked permissions MUST have safe application behavior.
## MUST NOT
- Permission prompts MUST NOT misrepresent why access is needed.
- Sensitive identifiers MUST NOT be repurposed beyond approved purpose without required consent or review.
## SHOULD
- Prefer privacy-preserving platform APIs and coarse data when sufficient.
## Exceptions
Regulatory or safety obligations may require collection beyond normal minimization with documented authority.
## Verification
Audit permission manifests, runtime prompts, telemetry schemas, retention behavior, and deny/revoke flows.