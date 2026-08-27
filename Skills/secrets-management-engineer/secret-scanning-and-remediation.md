# Secret Scanning and Remediation

## Purpose
Detect exposed credentials in source, artifacts, logs, and collaboration systems, then remediate them without spreading the secret further.

## When to use
Use for preventive scanning, repository onboarding, incident response, or after discovering possible credential leakage.

## Inputs
- Repositories and artifact sources
- Approved scanning tools
- Secret fingerprints or patterns
- Credential ownership and revocation mechanisms

## Context to inspect
Inspect Git history, branches, CI logs, packages, container layers, tickets, wikis, and deployment artifacts as policy allows.

## Core knowledge
Deletion is not revocation. Once a usable secret is exposed to an uncontrolled surface, assume compromise according to risk. Scanning must balance entropy/pattern detection, validation, false positives, and safe handling.

## Procedure
1. Define approved scan scope and data-handling rules.
2. Scan current content and relevant history using multiple detection signals.
3. Triage findings without copying full values into tracking systems.
4. Identify credential owner, privilege, and external usability.
5. Revoke or rotate confirmed exposed credentials first.
6. Update consumers through the authoritative secret path.
7. Remove plaintext from current content and, when justified, rewrite history carefully.
8. Investigate access and usage around the exposure window.
9. Add preventive pre-commit, CI, or platform controls.
10. Record fingerprinted evidence and closure status.

## Decision points
Rewrite history only when reducing residual exposure justifies disruption; revocation remains mandatory when exposure is plausible. Validate suspicious matches only through safe metadata or controlled provider APIs.

## Common failure patterns
- Treating Git deletion as containment
- Posting the secret into an incident ticket
- Rotating only one copy while aliases remain active
- Ignoring build artifacts and logs
- Blocking development with noisy unmaintained rules

## Verification
Verify the exposed credential no longer authenticates, replacement consumers work, scans no longer find active plaintext, and related unauthorized usage was assessed.

## Expected output
A remediated exposure with revocation proof, cleaned surfaces, impact assessment, and preventive controls.

## Stop conditions
Stop and escalate when exposure may involve privileged production credentials, evidence handling requires incident-response authority, or cleanup could destroy forensic evidence.