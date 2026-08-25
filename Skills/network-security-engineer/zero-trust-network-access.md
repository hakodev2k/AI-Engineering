# Zero Trust Network Access

## Purpose
Replace implicit network trust with identity-aware, context-sensitive, least-privilege access to applications and services.

## When to use
Use for remote-access modernization, third-party access, privileged access reduction, or segmentation beyond location-based controls.

## Inputs
Users, applications, identity provider, device posture, access policies, session risks, legacy protocol constraints.

## Context to inspect
Identity federation, connectors, application discovery, DNS, client agents, policy engine, logging, fallback paths.

## Core knowledge
Continuous verification, identity and device context, application-level access, policy enforcement points, session risk, legacy compatibility.

## Procedure
1. Inventory applications and access populations.
2. Define identity assurance and device posture requirements.
3. Map least-privilege application access.
4. Deploy connectors without exposing unnecessary inbound paths.
5. Pilot low-risk applications.
6. Validate user experience and break-glass paths.
7. Migrate from broad VPN access progressively.
8. Monitor policy denials and bypass routes.

## Decision points
Use agentless access for compatible web apps; agents when device posture or broader protocol support is required. Retain VPN only for justified network-level use cases.

## Common failure patterns
Calling VPN relabeling zero trust, broad application groups, unmanaged bypass routes, weak identity assurance, no emergency access design.

## Verification
Test allowed, denied, unmanaged-device, revoked-user, and degraded-provider scenarios; inspect session telemetry.

## Expected output
ZTNA policy model, migration plan, exception process, test evidence.

## Stop conditions
Stop migration when application dependencies are unknown, identity availability is insufficient, or break-glass access is untested.