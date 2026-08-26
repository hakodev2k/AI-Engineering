# Privacy and Data Handling Rules

## Purpose
Prevent sensitive data exposure through shared caches, logs, edge processing, or geographic delivery.

## Scope
Applies to cached objects, headers, cookies, logs, edge functions, geographic processing, and provider data handling.

## MUST
- Data classification MUST inform cacheability, logging, retention, and edge-processing decisions.
- Authorization-dependent responses MUST be isolated from unauthorized cache reuse.
- Telemetry MUST redact or omit secrets and sensitive personal data unless explicitly required and protected.
- Geographic processing or storage constraints MUST be reflected in CDN architecture where applicable.
- Provider data handling MUST match applicable project privacy requirements.

## MUST NOT
- MUST NOT cache private responses in shared caches without proven partitioning and policy approval.
- MUST NOT expose internal identifiers or sensitive origin headers unnecessarily.
- MUST NOT increase data retention merely for convenience.

## SHOULD
- Minimize data sent to edge logic and logs.
- Use coarse geographic signals when precise location is unnecessary.
- Periodically review provider retention and access controls.

## Exceptions
Sensitive-data processing exceptions require purpose, minimization analysis, retention, access controls, risk assessment, and privacy/security approval.

## Verification
Inspect cache directives, key isolation, log schemas, redaction tests, provider settings, retention policies, geographic configuration, and authorized privacy/security review evidence.