# Security Threat Modeling and Data Protection

## Purpose
Identify and mitigate security threats introduced by automation workflows, connectors, AI steps, credentials, data movement, and privileged side effects.

## When to use
Use before production release, when adding a new external integration, when processing sensitive data, or when increasing workflow permissions.

## Inputs
Architecture, data-flow diagram, identities, permissions, data classifications, trust boundaries, external dependencies, AI/tool capabilities, and security policies.

## Context to inspect
Inspect exposed endpoints, connector permissions, webhook validation, secret storage, logs, data retention, network paths, dependency provenance, and historical security incidents.

## Core knowledge
Automation expands trust across systems. Threats include spoofed triggers, injected instructions/data, credential theft, excessive permissions, insecure direct object access, data exfiltration, replay, supply-chain compromise, and unsafe autonomous actions.

## Procedure
1. Map assets, actors, entry points, data flows, and trust boundaries.
2. Classify data and identify regulated or sensitive fields.
3. Enumerate threats for triggers, credentials, transformations, integrations, storage, AI steps, and side effects.
4. Verify authentication and authorization independently.
5. Apply least privilege to each machine identity.
6. Validate and constrain all untrusted inputs.
7. Protect secrets and sensitive data in transit, at rest, and in telemetry.
8. Define retention and deletion behavior.
9. Limit AI/tool permissions and isolate user-controlled content from instructions.
10. Add replay, abuse, and anomaly controls where relevant.
11. Review third-party connector and package trust.
12. Test mitigations and document residual risk.

## Decision points
Use stronger isolation and approval as impact increases. Prefer deny-by-default permission models. Avoid sending sensitive data to external AI/services unless explicitly authorized and contractually supported.

## Common failure patterns
Admin-level service accounts, unsigned webhooks, secrets in logs, trusting upstream validation, hidden cross-tenant data leakage, and granting AI agents broad tools without action constraints.

## Verification
Perform permission tests, malicious-input tests, webhook spoof/replay tests, secret scans, data-flow review, and targeted security testing for high-risk boundaries.

## Expected output
A threat model with ranked risks, mitigations, verification evidence, residual risk, ownership, and review triggers.

## Stop conditions
Stop when critical threats lack mitigation, data processing lacks authorization, or privileged access cannot be constrained to an acceptable boundary.