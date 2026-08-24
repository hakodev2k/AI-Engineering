# Security and Privacy Rules

## Purpose
Reduce exposure of credentials, personal data, privileged capabilities, and attack surfaces.

## Scope
Applies to Android application code, configuration, storage, IPC, networking, WebView usage, and third-party SDKs.

## MUST
- Apply least privilege to permissions, exported components, credentials, and backend scopes.
- Validate all untrusted inputs crossing intents, links, IPC, files, web content, or network boundaries.
- Keep secrets out of source code, packaged resources, logs, analytics, and crash metadata.
- Use platform-supported secure transport and storage mechanisms appropriate to the threat model.
- Review third-party SDK data collection and permissions before release.

## MUST NOT
- Disable certificate or hostname validation in production.
- Expose components without an explicit interoperability requirement and access control review.
- Enable dangerous WebView bridges or file access for untrusted content without a threat-modelled control.
- Weaken a security control solely to unblock development without approved risk acceptance.

## SHOULD
- Minimize data collection and retention.
- Threat-model high-risk authentication, payment, identity, and sensitive-data flows.

## Exceptions
Security exceptions require documented threat, compensating controls, expiry, verification, and authorized human approval.

## Verification
Use manifest/config inspection, static/dependency security scanning, penetration testing for high-risk surfaces, log review, and security-focused integration tests.