# Configuration and Environment Rules
## Purpose
Prevent mobile builds from contacting wrong services or exposing environment-specific secrets and behavior.
## Scope
Build variants, endpoints, identifiers, feature configuration, certificates, and environment separation.
## MUST
- Production, test, and development configuration MUST be distinguishable and reviewable in release artifacts.
- Environment selection MUST be controlled by build/release configuration rather than user-manipulable production settings unless intentionally supported.
- Sensitive configuration MUST come from protected mechanisms and never be treated as secret merely because it is compiled into the app.
## MUST NOT
- Production builds MUST NOT contain active test backdoors, debug menus granting privilege, or unintended non-production endpoints.
- Client-embedded API keys MUST NOT be relied upon as confidential credentials.
## SHOULD
- Configuration SHOULD fail closed when a missing value could route sensitive data incorrectly.
## Exceptions
Public identifiers may be embedded when their exposure is expected and backend controls prevent abuse.
## Verification
Inspect release binaries/config, build variants, endpoint routing, secret scans, and environment-specific automated tests.