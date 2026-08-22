# Cloud Networking Rules

## Purpose
Keep cloud connectivity explicit, least-privilege, scalable, and aligned with platform failure models.

## Scope
Virtual networks, subnets, peering, transit, private endpoints, gateways, route tables, and hybrid connectivity.

## MUST
- Define address ownership and check overlap before connecting networks.
- Model effective routes and security policy across all participating cloud and on-premises controls.
- Use private connectivity for sensitive services when requirements justify it.
- Evaluate regional/zone dependencies and provider limits before production design.

## MUST NOT
- Assume peering or transit implies intended end-to-end reachability or security.
- Expose management or sensitive services publicly merely to simplify connectivity.

## SHOULD
- Manage cloud network configuration as versioned, reviewable infrastructure code.

## Exceptions
Temporary public exposure requires approval, narrow source controls, expiry, monitoring, and documented removal.

## Verification
Inspect infrastructure definitions, effective routes, security policy, provider limits, flow logs, and connectivity tests.