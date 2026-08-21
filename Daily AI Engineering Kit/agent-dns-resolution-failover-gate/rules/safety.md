# DNS Resolution and Failover Rules

## MUST
- Resolve every configured dependency host before claiming connectivity readiness.
- Preserve hostname, returned addresses, elapsed time, and failures as evidence.
- Treat private, loopback, link-local, multicast, or policy-forbidden destinations as blocked unless explicitly approved for the target environment.
- Keep application URLs hostname-based; verify failover without pinning a discovered address.
- Separate DNS resolution proof from application-level health proof.
- Require human approval before DNS record, resolver, production network, firewall, certificate, or production configuration changes.

## MUST NOT
- Rewrite DNS, `/etc/hosts`, hosts files, load balancers, or production endpoints automatically.
- Treat one successful resolution as proof that failover works.
- Disable TLS verification or replace a hostname with an IP to bypass resolution failure.
- Log credentials, authorization headers, connection-string secrets, or DNS-provider tokens.
- Retry indefinitely; the gate allows at most the configured retry count.

## SHOULD
- Test each dependency from the same network boundary as the workload.
- Compare failures across resolver, network, TLS, and application layers before changing code.
- Prefer provider-supported DNS/load-balancer failover over client-side address pinning.
