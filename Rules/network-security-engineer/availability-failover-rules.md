# Security Availability and Failover
## Purpose
Ensure security controls fail predictably without creating unacceptable exposure or outages.
## Scope
Firewall clusters, VPN, DNS security, IDS/IPS, proxies, gateways, and management dependencies.
## MUST
- Critical controls MUST have documented failure behavior and recovery objectives.
- Failover paths MUST preserve required security policy.
- Dependencies such as identity, DNS, certificates, and routing MUST be included in resilience analysis.
- Failover MUST be tested periodically with evidence.
## MUST NOT
- High availability MUST NOT be inferred solely from redundant hardware.
- Fail-open behavior MUST NOT be accepted without explicit risk decision.
## SHOULD
- Tests SHOULD include partial failures and degraded dependencies, not only total node loss.
## Exceptions
Require risk owner, compensating controls, monitoring, and remediation plan.
## Verification
Review architecture, failover configuration, dependency maps, test results, alerts, and recovery timing.