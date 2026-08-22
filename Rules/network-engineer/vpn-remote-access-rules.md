# VPN and Remote Access Rules

## Purpose
Provide authenticated, least-privilege remote connectivity without creating uncontrolled trust paths.

## Scope
Site-to-site VPN, remote-user VPN, private access gateways, and tunnel policy.

## MUST
- Authenticate remote access using approved identity controls and strong authentication appropriate to risk.
- Restrict tunnel routes and access to required resources.
- Define ownership, peer identity, cryptographic policy, monitoring, and recovery for site-to-site tunnels.
- Review split-tunnel and full-tunnel choices against security and capacity requirements.

## MUST NOT
- Share reusable administrative VPN credentials among people.
- Expose broad internal networks through a tunnel without documented need.

## SHOULD
- Automate certificate/key expiry monitoring and access revocation.

## Exceptions
Emergency remote access requires time bounds, named user/owner, logging, and approval.

## Verification
Inspect identity policy, tunnel selectors/routes, crypto configuration, access logs, expiry state, and reachability tests.