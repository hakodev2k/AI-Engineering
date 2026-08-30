# Platform Security Incident Response

## Purpose
Provide a disciplined response process for security incidents affecting platform control planes, shared infrastructure, tenant isolation, CI/CD, identity, or privileged automation.

## When to use
Use when there is suspected credential compromise, unauthorized platform change, cross-tenant exposure, supply-chain tampering, control-plane intrusion, or suspicious privileged activity.

## Inputs
Alerts, audit logs, identity events, deployment history, network telemetry, affected assets, incident timeline, ownership map, and recovery procedures.

## Context to inspect
Inspect control-plane APIs, IAM, CI/CD, secret managers, artifact registries, cluster/cloud audit logs, platform databases, recent configuration changes, and privileged sessions.

## Core knowledge
Platform incidents can propagate across many workloads. Containment must consider both attacker access and operational dependencies. Evidence preservation, credential revocation, blast-radius analysis, and trusted recovery are more important than rapid but destructive cleanup.

## Procedure
1. Establish incident severity and accountable incident lead.
2. Preserve relevant logs, snapshots, and configuration evidence.
3. Identify suspected identities, entry points, and affected trust boundaries.
4. Determine tenant, environment, and control-plane blast radius.
5. Contain high-risk access using targeted revocation or isolation.
6. Rotate exposed credentials and invalidate sessions in dependency order.
7. Validate artifact, pipeline, and configuration integrity before recovery.
8. Rebuild compromised platform components from trusted sources when necessary.
9. Restore service using known-good identities, artifacts, and configuration.
10. Monitor for persistence, replay, and re-entry.
11. Document timeline, decisions, evidence, and residual uncertainty.
12. Convert root causes into platform-level preventive and detective controls.

## Decision points
Prefer targeted containment when broad shutdown would destroy evidence or create severe availability harm. Use full credential-domain rotation when compromise boundaries cannot be established confidently.

## Common failure patterns
Deleting evidence too early, rotating one credential while leaving equivalent sessions active, restoring from unverified artifacts, underestimating shared-platform blast radius, and declaring closure without proving attacker access is removed.

## Verification
Verify compromised identities are invalid, unauthorized changes are removed, trusted artifacts/configuration are restored, detections remain quiet under heightened monitoring, and affected tenants are identified accurately.

## Expected output
A contained and recovered platform, evidence-backed incident timeline, verified trust restoration, and prioritized corrective actions.

## Stop conditions
Escalate immediately when cross-tenant compromise, signing-key compromise, production control-plane takeover, or uncertain attacker persistence is suspected.