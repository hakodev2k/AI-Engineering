# Identity Threat Modeling

## Purpose
Identify identity-specific abuse paths before implementation or during review, focusing on account takeover, privilege escalation, trust abuse, token theft, and lifecycle weaknesses.

## When to use
Use for new identity flows, federation changes, privileged systems, security reviews, and post-incident hardening.

## Inputs
Architecture diagrams, trust relationships, authentication flows, authorization policies, lifecycle flows, privileged paths, attacker assumptions.

## Context to inspect
IdP configuration, token issuance, recovery, provisioning, role assignments, service identities, secret stores, emergency access, logs.

## Core knowledge
Identity attacks often chain weak recovery, stale privileges, token reuse, over-trusted claims, and administrative control-plane access. Threat models must include humans, workloads, insiders, and compromised applications.

## Procedure
1. Define protected assets and sensitive actions.
2. Map actors, trust boundaries, and credential types.
3. Trace authentication, authorization, provisioning, and recovery flows.
4. Enumerate account takeover and privilege-escalation paths.
5. Model token, session, and secret theft.
6. Examine tenant and environment boundary failures.
7. Review administrative and emergency paths.
8. Rank threats by likelihood and impact.
9. Map mitigations to preventive, detective, and recovery controls.
10. Validate mitigations with abuse-case tests.

## Decision points
Prioritize threats that cross trust boundaries or grant durable privilege. Accept residual risk only with explicit ownership.

## Common failure patterns
Modeling login only, ignoring recovery, excluding service accounts, trusting internal networks, and failing to test chained attacks.

## Verification
Replay prioritized abuse cases in a safe test environment or through configuration evidence and confirm controls block or detect them.

## Expected output
Threat model, abuse cases, ranked risks, mitigations, evidence gaps, and residual risk owners.

## Stop conditions
Escalate when critical trust assumptions cannot be verified or mitigating a high-impact threat requires business risk acceptance.