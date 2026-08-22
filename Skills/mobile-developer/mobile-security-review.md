# Mobile Security Review

## Purpose
Identify exploitable weaknesses in mobile code, configuration, data handling, and platform integration.

## When to use
Sensitive features, release readiness, auth changes, external SDK additions.

## Inputs
Repository, threat model, build configuration, data classification.

## Context to inspect
Permissions, exported components, URL schemes, WebViews, storage, network security, logs, clipboard, screenshots, dependencies.

## Core knowledge
Mobile clients run on attacker-controlled devices. Never rely on client secrecy or client-side authorization for server trust.

## Procedure
1. Identify sensitive assets and entry points.
2. Review permissions for least privilege.
3. Review deep links and exported surfaces.
4. Inspect secret/token storage.
5. Review TLS and certificate policy.
6. Review WebView/JavaScript bridges.
7. Check logging, screenshots, clipboard, backups.
8. Review dependency and build-signing risks.
9. Verify server-side authorization assumptions.
10. Prioritize findings by exploitability and impact.

## Decision points
Apply hardening proportional to threat model; treat obfuscation as friction, not a security boundary.

## Common failure patterns
Hard-coded secrets, trusting rooted-device checks, excessive permissions, unsafe URL handlers, sensitive logs.

## Verification
Static/dynamic checks and adversarial test cases with documented evidence.

## Expected output
Prioritized findings, remediation, residual risk.

## Stop conditions
Escalate critical vulnerabilities or security decisions requiring formal acceptance.