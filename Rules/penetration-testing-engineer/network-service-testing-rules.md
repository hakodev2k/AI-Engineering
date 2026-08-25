# Network and Service Testing Rules

## Purpose
Assess exposed network services and trust boundaries without causing avoidable instability.

## Scope
Covers ports, protocols, remote administration, segmentation, service configuration, encryption, and network-access controls.

## MUST
- MUST confirm target addresses and ownership before active probing.
- MUST identify service exposure, authentication boundaries, encryption posture, and segmentation assumptions using reproducible evidence.
- MUST tune scan concurrency, timeouts, and probes to target sensitivity.
- MUST validate critical scanner findings manually before reporting them as exploitable.
- MUST document source location because segmentation conclusions depend on network vantage point.

## MUST NOT
- MUST NOT use disruptive protocol tests or flooding behavior without explicit authorization.
- MUST NOT assume an open port is a vulnerability without context and impact.
- MUST NOT cross an unapproved network boundary after discovering a route or trust relationship.
- MUST NOT alter network-device configuration to facilitate testing without approval.

## SHOULD
- SHOULD test representative ingress, egress, management, and lateral-movement boundaries when in scope.
- SHOULD correlate service fingerprints with configuration or runtime evidence where available.

## Exceptions
Stress testing, routing changes, or tests against fragile appliances require explicit approval, monitoring, rollback, and stop conditions.

## Verification
Inspect target inventories, scanner settings, source vantage points, packet or service evidence, configuration snapshots, and manual validation notes.