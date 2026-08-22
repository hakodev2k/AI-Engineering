# Firewall Policy Rules

## Purpose
Enforce least-privilege traffic policy with auditable intent.

## Scope
Network firewalls, cloud firewalls, ACLs, security groups, and filtering policy.

## MUST
- Tie every material allow rule to an owner, business/technical need, source, destination, service, and lifecycle.
- Apply least privilege and explicit directionality.
- Assess rule ordering, shadowing, statefulness, asymmetric routing, and blast radius before change.
- Require human approval for material production policy weakening.

## MUST NOT
- Add unrestricted any-to-any rules to resolve connectivity without explicit high-risk approval.
- Disable security controls merely to prove reachability.

## SHOULD
- Expire temporary access automatically and review stale rules periodically.

## Exceptions
Emergency access requires bounded scope, expiry, monitoring, owner, and post-event review.

## Verification
Review policy diff, hit counters, ownership metadata, reachability tests, security review, and expiration controls.