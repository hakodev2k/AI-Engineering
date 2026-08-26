# Mobile Threat Modeling

## Purpose
Systematically identify mobile attack surfaces, trust boundaries, abuse cases, and mitigations before implementation or release.

## When to use
Use for new mobile features, authentication changes, sensitive-data flows, SDK integrations, deep links, IPC, payments, or major architecture changes. Do not use as a substitute for code review or penetration testing.

## Inputs
Architecture diagrams, requirements, data flows, platform targets, API contracts, permissions, third-party dependencies, and deployment model.

## Preconditions
Confirm scope, assets, actors, environments, and business impact. Obtain current architecture evidence rather than assuming it.

## Context to inspect
Inspect client/server boundaries, local storage, OS services, WebViews, IPC, deep links, push notifications, network paths, cryptographic boundaries, telemetry, and third-party SDKs.

## Core knowledge
Model assets, entry points, trust boundaries, attacker capabilities, and abuse paths. Use STRIDE or another structured method where useful, but prioritize realistic mobile threats: device compromise, malicious apps, interception, tampering, credential theft, insecure storage, and backend abuse.

## Procedure
1. Define security objectives and sensitive assets.
2. Draw data flows and trust boundaries.
3. Enumerate entry points and privileged operations.
4. Define plausible attacker capabilities.
5. Identify threats per component and flow.
6. Rank threats by likelihood and impact.
7. Map each material threat to preventive, detective, or recovery controls.
8. Identify residual risk and ownership.
9. Convert mitigations into testable requirements.
10. Revisit the model when architecture changes.

## Decision points
Prefer controls enforced by the server when the client cannot be trusted. Use platform security primitives before custom mechanisms. Accept residual risk only when impact, exploitability, compensating controls, and ownership are explicit.

## Common failure patterns
Treating the device as trusted; ignoring backend abuse; assuming TLS solves endpoint compromise; overlooking deep links, WebViews, backups, logs, clipboard, screenshots, or third-party SDKs; producing a threat list without actionable controls.

## Verification
Verify every high-risk flow has an owner, mitigation, validation method, and residual-risk disposition. Cross-check implementation and security tests against the model.

## Expected output
A current threat model with prioritized threats, mitigations, verification criteria, and explicit residual risks.

## Stop conditions
Escalate when critical architecture is unknown, required controls conflict with product requirements, sensitive regulatory scope is unclear, or risk acceptance requires authorized approval.