# Networking Rules

## Purpose
Ensure infrastructure networking is intentionally designed, least-exposed, observable, and recoverable.

## Scope
Applies to VNets/VPCs, subnets, firewalls, security groups, load balancers, ingress, DNS, private endpoints, and routing.

## MUST
- Network exposure MUST be explicitly justified by service requirements.
- Production administrative endpoints MUST be restricted to approved sources or private access paths.
- Ingress and egress rules MUST use least privilege and avoid unnecessary wildcards.
- DNS, routing, and load-balancing changes MUST include rollback and validation plans.
- Critical dependencies MUST define connectivity monitoring and failure behavior.

## MUST NOT
- MUST NOT expose management ports publicly by default.
- MUST NOT use `0.0.0.0/0` for privileged access without explicit security approval.
- MUST NOT change network policy in production without assessing blast radius.

## SHOULD
- Prefer private connectivity for internal services and managed service endpoints.
- Prefer centralized policy and reusable network modules.

## Exceptions
Temporary broad access requires time-bound approval, logging, compensating controls, and prompt removal.

## Verification
Use configuration review, connectivity tests, firewall analysis, flow logs, DNS checks, route inspection, and external exposure scanning.