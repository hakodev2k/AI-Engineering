# Database Network Security Rules

## Purpose
Reduce database attack surface and prevent unauthorized network paths.

## Scope
Covers listeners, firewalls, private networking, proxies, gateways, DNS, service endpoints, and administrative paths.

## MUST
- Production databases MUST expose only required network paths to explicitly authorized sources.
- Administrative access paths MUST be more restrictive than ordinary application connectivity.
- Network policy MUST be represented as reviewable configuration where practical.
- Connectivity changes MUST consider lateral movement, exfiltration, and unintended cross-environment access.
- External exposure MUST have documented necessity, authentication, encryption, monitoring, and risk approval.

## MUST NOT
- Databases MUST NOT be publicly reachable by default.
- Broad allow-all CIDRs or equivalent rules MUST NOT be used as permanent fixes.
- Network reachability MUST NOT be treated as authorization.

## SHOULD
- Prefer private endpoints, segmentation, controlled egress, and narrowly scoped service-to-service paths.
- Periodically validate effective reachability rather than relying only on intended configuration.

## Exceptions
Temporary broadening requires owner, reason, expiry, monitoring, rollback, and approval proportional to risk.

## Verification
Inspect firewall/security-group rules, routing, endpoint configuration, listener bindings, DNS, and network-policy diffs. Run authorized reachability tests from expected and forbidden network locations.