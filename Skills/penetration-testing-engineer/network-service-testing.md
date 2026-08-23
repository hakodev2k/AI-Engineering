# Network Service Testing

## Purpose
Assess authorized network services for exposed attack paths, insecure configuration, weak trust boundaries, and exploitable service behavior.

## When to use
Use for internal or external network ranges explicitly included in scope.

## Inputs
Approved ranges/hosts, segmentation expectations, service inventory, credentials if provided, rate constraints, and critical-system list.

## Context to inspect
Inspect reachable ports, service versions, protocols, encryption, authentication, administrative interfaces, segmentation, and unnecessary exposure.

## Core knowledge
Service banners are clues, not proof of vulnerability. Validate configuration and reachable behavior. Network testing can affect fragile systems, so rate and exploit depth must reflect operational risk.

## Procedure
1. Confirm exact authorized ranges.
2. Discover live hosts using permitted low-impact methods.
3. Enumerate exposed services conservatively.
4. Correlate versions with configuration and actual reachable features.
5. Test authentication and transport protections where authorized.
6. Validate segmentation assumptions using controlled paths.
7. Review management interfaces and default/unnecessary exposure.
8. Validate candidate vulnerabilities without destructive exploitation.
9. Prioritize paths enabling privilege, sensitive access, or lateral movement.
10. Document evidence and remediation at the service/control layer.

## Decision points
Prefer configuration validation over exploit attempts when it proves the issue. Avoid aggressive scanning for OT, legacy, embedded, or otherwise fragile systems unless explicitly approved.

## Common failure patterns
Reporting CVEs from banners alone, scanning outside CIDRs, excessive concurrency, missing UDP or alternate protocols, and confusing network reachability with exploitability.

## Verification
Recheck service identity, validate from the intended network position, and ensure the evidence supports the claimed exposure and impact.

## Expected output
Validated network findings with affected service, reachable path, configuration/evidence, impact, and remediation.

## Stop conditions
Stop when instability appears, a fragile asset is discovered unexpectedly, or the target is outside approved ownership.