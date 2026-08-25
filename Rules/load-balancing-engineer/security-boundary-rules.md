# Security Boundary Rules

## Purpose
Treat the load-balancing tier as a security-sensitive boundary and minimize attack surface.

## Scope
Listeners, management interfaces, network policy, ACLs, WAF integration, trusted proxies, and administrative access.

## MUST
- Exposed listeners MUST be limited to required ports, protocols, addresses, and routes.
- Administrative interfaces MUST use strong authentication, least privilege, and restricted network exposure.
- Trust boundaries for client identity, forwarding headers, TLS termination, and backend identity MUST be explicit.
- Security-control changes affecting production traffic MUST require authorized approval.
- Logs and telemetry MUST avoid exposing secrets, credentials, or sensitive headers.

## MUST NOT
- MUST NOT expose management planes publicly without an approved security design.
- MUST NOT weaken ACL, WAF, authentication, or TLS controls merely to restore convenience.
- MUST NOT treat network location alone as sufficient authorization for sensitive operations.

## SHOULD
- Apply defense in depth across edge, load balancer, and backend controls.
- Separate administrative and data-plane access paths.

## Exceptions
Temporary emergency exceptions require incident authority, compensating controls, explicit expiry, and follow-up remediation.

## Verification
Review listener inventory, ACLs, firewall rules, IAM, WAF policy, forwarded-header trust, management exposure, and security test evidence.