# Network Segmentation Rules

## Purpose
Limit lateral movement and reduce failure and security blast radius.

## Scope
Trust zones, VLAN/VRF segmentation, microsegmentation, management networks, and inter-zone controls.

## MUST
- Segment systems according to trust, sensitivity, exposure, operational role, and regulatory needs.
- Route inter-zone traffic through an enforceable policy point where risk requires it.
- Isolate management planes from ordinary user/application traffic.
- Validate required flows before enforcing new segmentation.

## MUST NOT
- Assume subnet separation alone provides security without enforcement.
- Collapse trust zones solely for operational convenience.

## SHOULD
- Maintain a current flow matrix and remove obsolete cross-zone access.

## Exceptions
Temporary bridging requires explicit risk acceptance, expiry, monitoring, and compensating controls.

## Verification
Inspect topology, VRFs/VLANs, enforcement policy, flow logs, reachability tests, and segmentation test results.