# Network Security

## Purpose
Control cloud network exposure and lateral movement.

## Scope
Virtual networks, subnets, routing, firewalls, security groups, gateways, private endpoints, and ingress/egress controls.

## MUST
- Internet-facing paths MUST be intentional, documented, minimized, and monitored.
- Inbound and outbound rules MUST identify required protocol, port, source or destination, and owner.
- Administrative interfaces MUST use restricted management paths and strong identity controls.
- Network changes affecting production exposure MUST be reviewed before execution.

## MUST NOT
- MUST NOT expose management ports broadly to the internet.
- MUST NOT use unrestricted ingress or egress without documented necessity and approval.
- MUST NOT assume segmentation replaces authorization.

## SHOULD
- Prefer private connectivity for internal service dependencies.
- Segment workloads by trust and blast-radius requirements rather than organizational convenience.

## Exceptions
Exceptions require threat analysis, bounded exposure, compensating controls, monitoring, and approval.

## Verification
Inspect effective routes, firewall and security-group rules, public IP assignments, reachability analysis, flow logs, and external exposure scans.