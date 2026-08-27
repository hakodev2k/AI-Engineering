# Layer 2 Safety Rules

## Purpose
Prevent automated Layer 2 changes from causing loops, broadcast storms, segmentation errors, or unintended isolation.

## Scope
VLANs, trunks, spanning tree, link aggregation, EVPN/VXLAN attachment, and access ports.

## MUST
- VLAN and segment changes MUST validate identifiers, allowed scope, and endpoint intent before deployment.
- Trunk modifications MUST calculate the resulting allowed set and protect required management or infrastructure segments.
- Link-aggregation changes MUST validate member compatibility and peer expectations.
- Spanning-tree or loop-prevention changes MUST analyze redundancy and failure behavior.
- Broad Layer 2 changes MUST be staged across failure domains.

## MUST NOT
- MUST NOT replace an allow list with an unintentionally broader set due to template defaults.
- MUST NOT disable loop-prevention controls to make automation converge.
- MUST NOT assume interface descriptions prove physical connectivity.

## SHOULD
- Automation SHOULD cross-check discovered neighbors and intended topology before risky port-role changes.
- Segment lifecycle SHOULD include explicit creation, attachment, detachment, and retirement states.

## Exceptions
Emergency isolation may bypass normal staging only with incident authority, explicit target verification, and immediate post-change validation.

## Verification
Inspect computed VLAN sets, neighbor data, port-channel state, spanning-tree topology, MAC/EVPN state, and representative endpoint reachability before and after change.