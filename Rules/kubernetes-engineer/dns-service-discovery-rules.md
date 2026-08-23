# DNS and Service Discovery Rules
## Purpose
Keep in-cluster name resolution and service discovery reliable and diagnosable.
## Scope
CoreDNS or equivalent, Services, search domains, caching, endpoints, and dependency resolution.
## MUST
- Monitor DNS availability, latency, error rate, and capacity for production clusters.
- Use stable service identities rather than pod addresses for normal service discovery.
- Evaluate DNS query amplification, search-path behavior, and caching when troubleshooting latency or load.
- Validate endpoint readiness and service selectors when diagnosing discovery failures.
## MUST NOT
- Hard-code ephemeral pod IP addresses into application configuration.
- Increase DNS capacity without investigating pathological query behavior when evidence indicates it.
## SHOULD
- Keep DNS configuration minimal and test custom plugins or forwarding changes before production rollout.
## Exceptions
Direct endpoint use requires a protocol or architecture that explicitly manages endpoint lifecycle.
## Verification
Inspect DNS metrics/logs, Service and EndpointSlice resources, resolver configuration, query tests, and failure evidence.