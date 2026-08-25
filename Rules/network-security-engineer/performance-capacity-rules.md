# Security Performance and Capacity
## Purpose
Prevent security controls from becoming bottlenecks or failing under expected load.
## Scope
Firewalls, VPN, inspection, proxies, IDS/IPS, encryption, and gateways.
## MUST
- Capacity decisions MUST use measured traffic, growth assumptions, and security-feature overhead.
- Latency and throughput impact of enabled inspection MUST be measured for critical paths.
- Saturation thresholds MUST have monitoring and operational response.
- Performance changes MUST preserve required security controls unless explicitly approved.
## MUST NOT
- Security inspection MUST NOT be disabled to improve performance without risk approval.
- Capacity claims MUST NOT rely only on vendor maximums.
## SHOULD
- Headroom SHOULD reflect burst, failover, attack, and maintenance scenarios.
## Exceptions
Require measurements, risk analysis, alternatives, approval, and review date.
## Verification
Use benchmarks, production metrics, load tests, failover tests, feature configuration, and capacity forecasts.