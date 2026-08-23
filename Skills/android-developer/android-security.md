# Android Security

## Purpose
Reduce Android application risk across local storage, transport, exported components, WebView, IPC, secrets, and sensitive user data.

## When to use
Use for security review, new sensitive features, authentication flows, SDK integration, or incident remediation.

## Inputs
Threat model, data classification, manifest, storage design, network stack, component interfaces, third-party SDKs, platform versions.

## Preconditions
Identify trust boundaries and sensitive assets before selecting controls.

## Context to inspect
Manifest exports, intent filters, permissions, deep links, WebViews, file providers, keystore use, logs, backups, screenshots, clipboard, TLS configuration, and dependencies.

## Core knowledge
The client runs on an untrusted device. App-side controls protect local data and interfaces but cannot safely hold server secrets or enforce server authorization alone.

## Procedure
1. Classify sensitive data and attack surfaces.
2. Review exported activities, services, receivers, and providers.
3. Validate all external input and deep-link parameters.
4. Minimize permissions and sensitive data retention.
5. Use Android Keystore for appropriate key material, not as a substitute for server security.
6. Review TLS and certificate handling; never disable validation for production.
7. Harden WebView settings and JavaScript bridges when used.
8. Remove secrets and personal data from logs/analytics.
9. Review dependency and SDK data collection.
10. Test abuse cases across IPC, intents, local files, and network failure.

## Decision points
Encrypt local data when threat model and sensitivity justify it. Prefer server-side authorization for protected actions; client checks are UX controls, not authority.

## Common failure patterns
Embedded API secrets, exported components without validation, insecure WebView bridges, plaintext sensitive logs, broad permissions, trusting client-side role checks, and custom cryptography.

## Verification
Inspect merged manifest, run static/dynamic checks, exercise external entry points, verify sensitive logging is absent, and confirm backend rejects unauthorized operations.

## Expected output
Prioritized findings, implemented controls, residual risks, and verification evidence.

## Stop conditions
Escalate high-impact authentication, cryptography, payment, regulated-data, or backend authorization issues requiring specialized approval.