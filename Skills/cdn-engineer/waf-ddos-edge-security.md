# WAF, DDoS, and Edge Security

## Purpose
Design layered edge controls that absorb volumetric attacks and block malicious application traffic without unacceptable false positives.

## When to use
Use for CDN security baselines, attack response, WAF tuning, and public application onboarding.

## Inputs
Threat model, endpoints, traffic baselines, known abuse patterns, WAF capabilities, origin capacity, business criticality.

## Context to inspect
Managed/custom WAF rules, DDoS controls, bot management, rate limits, origin restrictions, logs, exceptions.

## Core knowledge
DDoS mitigation and WAF solve different layers. Effective controls combine network absorption, protocol validation, application signatures, behavioral limits, and origin isolation.

## Procedure
1. Establish normal traffic distributions and critical paths.
2. Enable appropriate managed protections in observe mode where possible.
3. Tune rules using real false-positive evidence.
4. Add endpoint-specific rate and abuse controls.
5. Protect expensive dynamic operations more aggressively.
6. Restrict origin bypass.
7. Define emergency attack-mode controls and approvals.
8. Centralize security logs with request correlation.
9. Exercise attack and false-positive scenarios.

## Decision points
Challenge or rate-limit uncertain automation; block high-confidence malicious traffic. Apply stricter controls to login, search, upload, and compute-expensive endpoints.

## Common failure patterns
Global thresholds ignoring endpoint cost, permanent emergency rules, unreviewed WAF exclusions, trusting client-controlled IP headers, and origin exposure.

## Verification
Run safe test payloads, validate allowed legitimate traffic, confirm rate limits, inspect logs, and test origin isolation.

## Expected output
A layered edge-security policy with tuned controls, exceptions, monitoring, and incident procedures.

## Stop conditions
Escalate if mitigation could block critical legitimate traffic or active attack response requires provider/security authority beyond available permissions.