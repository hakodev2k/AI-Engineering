# Network Forensics Rules

## Purpose
Analyze network evidence without confusing observation, attribution, and intent.

## Scope
Covers packet captures, flow records, DNS, proxy, firewall, VPN, load-balancer, and network-security telemetry.

## MUST
- Network findings MUST identify source telemetry and collection boundaries.
- IP, hostname, account, and device attribution MUST account for NAT, DHCP, proxies, VPNs, shared infrastructure, and address reuse.
- Packet or flow timestamps MUST be normalized with documented clock assumptions.
- Missing traffic MUST be interpreted in light of sensor placement, retention, sampling, encryption, and capture loss.
- Material protocol interpretations MUST preserve relevant raw evidence or reproducible filters.

## MUST NOT
- MUST NOT equate an IP address with a person without corroboration.
- MUST NOT infer absence of communication from absence in an incomplete sensor view.
- MUST NOT decrypt or intercept protected traffic without authority.

## SHOULD
- Correlate network evidence with endpoint, identity, DNS, and cloud logs.
- Quantify packet loss or sampling where available.

## Exceptions
When only summarized telemetry exists, state the unavailable packet-level evidence and resulting limits.

## Verification
Re-run filters, validate sensor scope, inspect representative packets, reconcile DNS/address assignment, and corroborate identities across independent logs.