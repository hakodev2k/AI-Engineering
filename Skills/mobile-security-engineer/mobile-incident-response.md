# Mobile Security Incident Response

## Purpose
Investigate, contain, remediate, and learn from security incidents involving mobile applications, signing, credentials, dependencies, or client/backend abuse.

## When to use
Use for suspected token leakage, malicious releases, SDK compromise, exploited vulnerabilities, fraud spikes, or signing-key incidents.

## Inputs
Incident report, affected versions, telemetry, release history, backend logs, dependency inventory, signing state, threat model.

## Preconditions
Preserve evidence and establish incident authority, severity, and communication channels.

## Context to inspect
Store versions, rollout state, crash/analytics data, API logs, auth events, build provenance, signing keys, dependency changes, and user impact.

## Core knowledge
Mobile remediation is constrained by store review and client update latency. Containment therefore often requires backend controls, token revocation, feature flags, or service-side policy.

## Procedure
1. Confirm indicators and affected scope.
2. Preserve relevant evidence.
3. Identify exploitable path and attacker prerequisites.
4. Contain server-side where possible.
5. Revoke exposed credentials/keys as required.
6. Prepare patched release and regression tests.
7. Coordinate rollout and minimum-version policy if justified.
8. Monitor exploitation and recovery.
9. Document root cause and systemic actions.

## Decision points
Use forced upgrades only when security impact exceeds availability/user disruption. Prefer reversible server-side containment while client fixes propagate.

## Common failure patterns
Waiting only for app-store release, destroying evidence, rotating secrets without closing root cause, unsupported forced upgrades, and no monitoring after remediation.

## Verification
Confirm exploit path is closed on backend and patched clients, compromised credentials are invalid, and indicators decline.

## Expected output
A documented incident timeline, containment, verified remediation, and preventive follow-up actions.

## Stop conditions
Escalate immediately for signing-key compromise, active widespread exploitation, regulated-data breach, or uncertain legal notification obligations.