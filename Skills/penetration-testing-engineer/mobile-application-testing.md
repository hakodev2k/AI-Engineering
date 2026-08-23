# Mobile Application Testing

## Purpose
Assess mobile applications and their backend trust assumptions for insecure local storage, transport, platform integration, authentication, authorization, and client-side control weaknesses.

## When to use
Use for authorized Android/iOS applications and associated backend functionality in scope.

## Inputs
Application builds, test devices/emulators, accounts, backend scope, architecture, and signing/distribution context.

## Context to inspect
Inspect local storage, logs, backups, deep links, inter-process communication, permissions, WebViews, transport, certificate validation, secrets, authentication tokens, and API behavior.

## Core knowledge
The mobile client is attacker-controlled. Client obfuscation, root/jailbreak checks, and UI restrictions are defense-in-depth, not substitutes for server authorization. Findings should distinguish device compromise assumptions from remotely exploitable risk.

## Procedure
1. Establish test-device and application baseline.
2. Map application components and backend endpoints.
3. Review local sensitive-data handling.
4. Inspect platform permissions and exported/deep-link behavior.
5. Evaluate transport and trust configuration.
6. Test authentication/session handling through the client and API.
7. Verify server-side authorization independent of client controls.
8. Inspect embedded secrets and environment configuration.
9. Test WebViews and external-content boundaries where relevant.
10. Validate findings on supported versions and document realistic prerequisites.

## Decision points
Prioritize server-impacting weaknesses over bypassing local anti-tamper controls unless local protections are explicit security requirements.

## Common failure patterns
Reporting hardcoded public identifiers as secrets, assuming rooted-device access equals remote compromise, ignoring backend APIs, and testing production accounts unnecessarily.

## Verification
Reproduce on clean test state, distinguish local vs remote attacker prerequisites, and verify backend impact separately.

## Expected output
Mobile findings with platform/version, prerequisites, affected trust boundary, evidence, impact, and remediation.

## Stop conditions
Stop before accessing unrelated device data, modifying third-party apps, or testing backend assets outside scope.