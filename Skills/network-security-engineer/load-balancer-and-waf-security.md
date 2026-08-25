# Load Balancer and WAF Security

## Purpose
Secure application delivery edges by hardening load balancers, reverse proxies, and WAF policy without degrading legitimate traffic.

## When to use
Use for internet application onboarding, WAF tuning, TLS termination, origin protection, or edge incidents.

## Inputs
Application endpoints, HTTP behavior, TLS requirements, origin topology, threat model, traffic baselines.

## Context to inspect
Listeners, pools, health checks, headers, client IP propagation, TLS, WAF rules, rate limits, admin interfaces.

## Core knowledge
Reverse proxy trust, header spoofing, HTTP normalization, WAF false positives, TLS termination, origin bypass, health-check behavior.

## Procedure
1. Map client-to-origin request path.
2. Restrict origin access to approved edge paths.
3. Harden listeners and TLS.
4. Define trusted forwarding headers explicitly.
5. Baseline application requests.
6. Enable managed WAF rules in staged mode.
7. Tune exceptions narrowly.
8. Add rate controls for abuse patterns.
9. Test failover, health checks, and blocked attacks safely.

## Decision points
Block high-confidence protocol violations; monitor uncertain application-specific rules first. Terminate TLS where inspection and key governance are appropriate.

## Common failure patterns
Publicly reachable origins, trusting arbitrary X-Forwarded-For, blanket WAF exclusions, unsafe health endpoints, edge admin exposure.

## Verification
Test origin bypass, spoofed headers, representative attacks, legitimate transactions, TLS posture, and HA behavior.

## Expected output
Hardened edge configuration, WAF policy, exceptions, test evidence, monitoring.

## Stop conditions
Stop blocking changes when application behavior is insufficiently understood or rollback cannot restore service quickly.