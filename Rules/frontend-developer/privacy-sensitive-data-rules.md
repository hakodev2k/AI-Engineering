# Privacy and Sensitive Data Rules
## Purpose
Minimize exposure of personal, confidential, and regulated data in browser environments.
## Scope
Rendering, storage, telemetry, URLs, clipboard, downloads, analytics, and third-party integrations.
## MUST
- Inspect project data-classification requirements before handling sensitive fields.
- Collect, render, persist, and transmit only data necessary for the approved user purpose.
- Sensitive values MUST be excluded or redacted from telemetry, analytics, error reports, and URLs unless explicitly approved.
- Browser persistence MUST have a justified lifetime and cleanup strategy.
## MUST NOT
- Production personal data MUST NOT be copied into development fixtures without approved protection.
- Client logs MUST NOT expose secrets, credentials, or unnecessary sensitive records.
## SHOULD
- Prefer short-lived in-memory handling for sensitive values when feasible.
## Exceptions
Required retention or telemetry requires documented purpose, controls, and approval.
## Verification
Inspect network payloads, browser storage, analytics events, logs, error reporting, and retention behavior.