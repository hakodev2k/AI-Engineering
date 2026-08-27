# Secrets Incident Response

## Purpose
Contain, investigate, rotate, and recover from suspected secret compromise while preserving evidence and minimizing service disruption.

## When to use
Use when a credential is leaked, used unexpectedly, accessed by an unauthorized identity, or when vault integrity is in doubt.

## Inputs
- Incident description
- Affected secret metadata
- Audit logs
- Consumers and owners
- Revocation and rotation mechanisms

## Context to inspect
Inspect issuance, access, authentication, provider usage, deployments, source history, related identities, downstream permissions, and recent policy changes.

## Core knowledge
A secret incident is both a credential-lifecycle problem and an access investigation. Containment often requires revocation before full certainty when blast radius is high. Evidence should be preserved without reproducing secret values.

## Procedure
1. Classify severity by privilege, exposure, external usability, and active evidence.
2. Preserve relevant audit and provider logs.
3. Identify all aliases, copies, consumers, and derived credentials.
4. Restrict or revoke the affected credential as risk requires.
5. Issue replacements through trusted channels.
6. Update and validate consumers.
7. Investigate unauthorized use during the exposure window.
8. Remove leaked plaintext from uncontrolled surfaces.
9. Review policy, identity, and process weaknesses that enabled exposure.
10. Confirm old credentials no longer work and close with documented evidence.

## Decision points
For highly privileged or internet-usable credentials, favor immediate containment. For credentials whose abrupt revocation risks critical harm, use a controlled overlap only with incident authority and active monitoring.

## Common failure patterns
- Waiting for proof of abuse before rotating a critical leaked credential
- Rotating only one replica
- Destroying evidence during cleanup
- Forgetting derived sessions or tokens
- Closing after replacement without investigating use

## Verification
Verify revocation, replacement health, no remaining active copies, reviewed access logs, and documented root cause and corrective controls.

## Expected output
A contained incident with revocation proof, impact assessment, restored consumers, and follow-up remediation.

## Stop conditions
Escalate immediately when root/admin material, signing keys, production master credentials, or evidence of active compromise is involved.