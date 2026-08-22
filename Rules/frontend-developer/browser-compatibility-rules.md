# Browser Compatibility Rules
## Purpose
Keep supported users functional across declared browser and platform targets.
## Scope
Web APIs, CSS capabilities, transpilation, polyfills, feature detection, and progressive enhancement.
## MUST
- Supported browser targets MUST be explicit and reflected in build/test configuration.
- New platform APIs MUST be checked against support targets before adoption.
- Critical functionality MUST have a fallback or explicit unsupported-state behavior when required capabilities are absent.
- Polyfills MUST be scoped to actual compatibility needs and evaluated for cost/security.
## MUST NOT
- User-agent sniffing MUST NOT replace capability detection unless a documented platform defect requires it.
- Compatibility failures MUST NOT be dismissed based only on developer-machine success.
## SHOULD
- Prefer progressive enhancement and standards-based APIs.
## Exceptions
Dropping support for a target requires product approval, impact evidence, and communication/migration plan where applicable.
## Verification
Compatibility matrix, automated cross-browser tests, real-browser checks for critical paths, and build-target inspection.